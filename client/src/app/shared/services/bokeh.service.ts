import { Injectable } from '@angular/core';
import { Connector } from './../../core/types/connector';
import { Message } from './../../core/types/message';
import { MessageService } from './../../core/services/message.service';

// this is the global hook to the bokehjs lib (without types)
declare var Bokeh: any;


@Injectable({
    providedIn: 'root'
  })
  export class BokehService extends Connector {

    constructor(private msgService: MessageService) {
      super('BokehService');
      this.msgService.register(this);
    }

    public plot(msg: Message) {
      const id = msg.args.id;
      const el = document.getElementById(id);
      // first remove the previous charts as child
      // this necessary, since bokeh do not let us update a chart
      while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
      }
      // be sure to include the correct dom-id as second argument
      Bokeh.embed.embed_item(msg.args.item, id);
    }

    public getChart(id: string) {
      const msg = {
        name: 'addChart',
        args: [id],
        action: 'default'
      };
      this.msgService.sendMsg(msg);
    }
}

