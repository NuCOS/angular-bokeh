import { Message } from './message';

export class Connector {
  public isFilled = false;
  public data: {};
  public name: string;
  constructor(name: string) { this.name = name; }
  get(): {} { return this.data; }
  set(message: {}): void { this.data = message; }
  change(message: {}): void { this.data = message; }
}



