import { Injectable } from '@angular/core';
import { MessageService } from './../../core/services/message.service';
import { filter } from 'rxjs/operators';

// this is the global hook to the bokehjs lib (without types)
declare var Bokeh: any;


@Injectable({
    providedIn: 'root'
  })
  export class BokehService {

    constructor(private msgService: MessageService) { }

    public plot(id: string, item: any) {
      const el = document.getElementById(id);
      // first remove the previous charts as child
      // this necessary, since bokeh do not let us update a chart
      while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
      }
      // be sure to include the correct dom-id as second argument
      Bokeh.embed.embed_item(item, id);
    }

    public getChart(id: string) {
      const callbackId = 'plot';
      const msg = {
        name: 'addChart',
        args: [id, callbackId],
        action: 'default'
      };
      this.msgService.sendMsg(msg);
      this.msgService.awaitMessage()
        .pipe(filter(msg=> msg.name == callbackId))
        .subscribe(
          msg => {
            this.plot(msg.args.id, msg.args.item);
          }
        )
    }
}

