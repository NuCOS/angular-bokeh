/* MessageService
     this singleton manages the incoming messages from websocket connection to python server
     - connector types can be registered to be updated whenever a message with equal name is coming in
       the exact way of update is defined in the connectors child classes (via set and change methods)
     - after the update of the data of the connectors an update stream is notified
     - for views it is mandatory to listen on the update stream to trigger the update of internal data
     - the messages contains always a name, args and an action
     - this service is also responsible for sending messages to python via method: sendMsg
     - the constructor depends on two external services (WebSocketService and UpdateService), it is never called explicitely
*/
import { Debug } from './debug';
import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { UpdateService } from './update.service';
import { Connector } from '../types/connector';
import { Message } from '../types/message';
import { Dictionary } from '../types/dictionary';
import { share, map } from 'rxjs/operators';
import { sha256, sha224 } from 'js-sha256';

const URL = 'ws://127.0.0.1:9000/ws';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public message: Subject<Message>;
  public connectors = new Dictionary<Connector>();
  public log = '';
  public user = '';
  public password = '';
  public isAuthenticated = false;

  constructor(private wsService: WebsocketService, private updateService: UpdateService) {
    console.log('create message service');
    // think of a nice and individual user name generated here
    const user = this.getRandomInt(9000) + 1000;
    this.connect(String(user), '');
  }

  public connect(user: string, password: string): void {
    console.log('try to connect');
    this.message = <Subject<Message>>this.wsService
      .connect(URL).pipe(
        map((response: MessageEvent): Message => {
          const data = JSON.parse(response.data);
          return {
            name: data.name,
            args: data.args,
            action: data.action,
            directive: data.directive
          };
        }), share());
    this.message.subscribe(msg => {
      this.manageMsg(msg);
    });
    this.user = user;
    this.password = password;
  }

  public getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  public getLog(): string {
    return this.log;
  }

  public sendMsg(msg: Message) {
    // send a message via websocket connection to python backend (here)
    if (Debug.messageService) {
      console.log('new message from angular to python: ', msg);
    }
    msg.user = this.user;
    if (msg.name === '') {
      return;
    } else { this.message.next(msg); }
  }

  public register(con: Connector): void {
    // to register a connector data type to be notified and updated upon incoming messages
    if (Debug.messageService) { console.log('registered: ' + con.name); }
    this.connectors.add(con.name, con);
  }

  public hexdigest_n(input: string, n: number) {
    let i = 0;
    let pre_digest = sha256(input);
    while (i < n - 1) {
      i += 1;
      pre_digest = sha256(pre_digest);
    }
    return pre_digest;
  }

  private manageMsg(msg: Message): void {
    // notify and update all registered connectors upon incoming messages
    // after updating data the UpdateService is notified
    if (this.connectors.containsKey(msg.name)) {
      const con = this.connectors.item(msg.name);
      if (Debug.messageService) {
        console.log('manage done for ' + msg.action + ' ' + con.name);
      }
      try {
        con[msg.action](msg);
        con.isFilled = true;
      }
      catch (err) {
        console.log('message action not available: ' + msg.action + ' ' + msg.name);
      }
    } else {
      if (Debug.messageService && msg.name !== 'Log') {
        console.log('not found in connectors ' + msg.name);
      }
    }

    if (msg.name === 'Log') {
      if (this.log.length > 1500) { this.log = this.log.slice(msg.args.length); }
      this.log += msg.args;
    }

    if (msg.name === 'doAuth') {
      if (msg.action === 'authenticate') {
        const id = msg.args['id'];
        const nonce = msg.args['nonce'];
        const pre_digest = this.hexdigest_n(this.password, 100);
        const challenge = this.hexdigest_n(pre_digest + nonce, 100);
        const authMsg = {
          name: 'doAuth',
          args: { 'user': this.user, 'challenge': challenge, 'id': id },
          action: 'default'
        };
        this.sendMsg(authMsg);
      } else {
        this.isAuthenticated = msg.args['authenticated'];
        if (!msg.args['authenticated']) {
          console.log('auth failed');
        } else {
          console.log('auth success');
        }
      }
    }

    // Important: must run sequencially to know the update time exactly
    if (msg.args.hasOwnProperty('directive')) {
      this.update(msg.name + ' ' + msg.args.directive);
    }
    else if (msg['directive'] !== undefined) {
      this.update(msg.name + ' ' + msg.directive);
    } else { this.update(msg.name); }
  }

  public update(name: string): void {
    this.updateService.push(name);
  }


} // end class MessageService
