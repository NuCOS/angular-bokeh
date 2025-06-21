import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { BokehService } from './bokeh.service';
import { MessageService } from '../../core/services/message.service';

class MockMessageService {
  public sent: any = null;
  public stream = new Subject<any>();
  sendMsg(msg: any) { this.sent = msg; }
  awaitMessage() { return this.stream; }
}

declare var Bokeh: any;

describe('BokehService', () => {
  let service: BokehService;
  let mock: MockMessageService;

  beforeEach(() => {
    mock = new MockMessageService();
    (global as any).Bokeh = { embed: { embed_item: jasmine.createSpy('embed_item') } };
    TestBed.configureTestingModule({
      providers: [
        BokehService,
        { provide: MessageService, useValue: mock }
      ]
    });
    service = TestBed.inject(BokehService);
  });

  it('should embed chart when data arrives', () => {
    const div = document.createElement('div');
    div.id = 'test-div';
    document.body.appendChild(div);

    service.getChart('test-div');

    mock.stream.next({ name: 'plot', args: { id: 'test-div', item: { foo: 'bar' } } });

    expect(Bokeh.embed.embed_item).toHaveBeenCalledWith({ foo: 'bar' }, 'test-div');

    document.body.removeChild(div);
  });
});
