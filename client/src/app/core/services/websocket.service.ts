import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private subject: Rx.Subject<MessageEvent>;

  public connect(url: string): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
    }
    return this.subject;
  }

  private create(url: string): Rx.Subject<MessageEvent> {
    const ws = new WebSocket(url);
    ws.onerror = (event) => {
      console.log('WebSocket Connection Failed with message', event.type);
      return false;
    };


    const observable = Rx.Observable.create(
      (obs: Rx.Observer<MessageEvent>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);

        return ws.close.bind(ws);
      })

    const observer = {
      next: (data: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          // console.log(JSON.stringify(data));
          ws.send(JSON.stringify(data));
        } else {
          console.log('not ready yet');
          // try again after 500 ms
          setTimeout(() => { this.subject.next(data); }, 500);
        }
      }
    }

    return Rx.Subject.create(observer, observable);
  }
}
