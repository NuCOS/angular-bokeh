import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private subject: Subject<MessageEvent>;

  public connect(url: string): Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
    }
    return this.subject;
  }

  private create(url: string): Subject<MessageEvent> {
    const ws = new WebSocket(url);
    ws.onerror = (event) => {
      console.log('WebSocket Connection Failed with message', event.type);
      return false;
    };


    const observable = new Observable<MessageEvent>(
      (obs: Observer<MessageEvent>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);

        return ws.close.bind(ws);
      })

    const subject = new Subject<MessageEvent>();
    const originalNext = subject.next.bind(subject);

    observable.subscribe({
      next: (msg) => originalNext(msg),
      error: (err) => subject.error(err),
      complete: () => subject.complete(),
    });

    subject.next = (data: any) => {
      if (ws.readyState === WebSocket.OPEN) {
        // console.log(JSON.stringify(data));
        ws.send(JSON.stringify(data));
      } else {
        console.log('not ready yet');
        // try again after 500 ms
        setTimeout(() => { subject.next(data); }, 500);
      }
    };

    return subject;
  }
}
