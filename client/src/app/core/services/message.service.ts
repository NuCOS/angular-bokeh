import { Debug } from './debug';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { Message } from '../types/message';
import { share, map } from 'rxjs/operators';
import { sha256 } from 'js-sha256';

const URL = 'ws://127.0.0.1:9000/ws';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public message: Subject<Message>;
  public log = '';
  public user = '';
  public password = '';
  public isAuthenticated = false;
  public dataStream = new Subject<Message>();

  constructor(private wsService: WebsocketService) {
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

  public hexdigest_n(input: string, n: number) {
    let i = 0;
    let pre_digest = sha256(input);
    while (i < n - 1) {
      i += 1;
      pre_digest = sha256(pre_digest);
    }
    return pre_digest;
  }

  public awaitMessage() {
    return this.dataStream;
  }

  private manageMsg(msg: Message): void {
    if (msg.name === 'Log') {
      if (this.log.length > 1500) { this.log = this.log.slice(msg.args.length); }
      this.log += msg.args;
    }
    else if (msg.name === 'doAuth') {
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
    } else {
      this.dataStream.next(msg);
    }
  }
} // end class MessageService
