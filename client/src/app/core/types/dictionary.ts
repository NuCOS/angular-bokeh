export interface IDictionary<T> {
  add(key: string, value: T): void;
  containsKey(key: string): boolean;
  count(): number;
  item(key: string): T;
  keys(): string[];
  remove(key: string): T;
  values(): T[];
  pos(key: string): number;
  replace(newkey: string, value: T, oldkey: string): boolean;
  removeAll(): void;
}

export class Dictionary<T> implements IDictionary<T> {
  public items: { [index: string]: T } = {};

  public _count = 0;

  constructor(private maxCount: number = -1) { }

  public containsKey(key: string): boolean {
    return this.items.hasOwnProperty(key);
  }

  public count(): number {
    return this._count;
  }

  public add(key: string, value: T): void {
    if (((this._count < this.maxCount) && (this.maxCount > -1)) || (this.maxCount === -1)) {
      this.items[key] = value;
      this._count++;
    }
  }

  public remove(key: string): T {
    if (this.containsKey(key)) {
      const val = this.items[key];
      delete this.items[key];
      this._count--;
      return val;
    } else {
      return null;
    }
  }

  public removeAll(): void {
    for (const k of this.keys()) { this.remove(k); }
  }

  public item(key: string): T {
    return this.items[key];
  }

  public keys(): string[] {
    return Object.keys(this.items);
  }

  public values(): T[] {
    const values: T[] = [];
    for (const prop in this.items) {
      if (this.items.hasOwnProperty(prop)) {
        values.push(this.items[prop]);
      }
    }
    return values;
  }

  public pos(key: string): number {
    return this.keys().indexOf(key);
  }

  public replace(newkey: string, value: T, oldkey: string): boolean {
    // should insert a value of type T on the same place as given by oldkey. (Key,value) of oldkey is deleted after operation.
    if (this.containsKey(oldkey)) {
      // since the order of attributes can not be changed ( at least not known ) ->
      // create a new storage with changed Items
      const changedItems: { [index: string]: T } = {};
      for (const key in this.items) {
        if (key === oldkey) {
          changedItems[newkey] = value;
        } else { changedItems[key] = this.item(key); }
      }
      this.items = changedItems;
      return true;
    } else {
      return false;
    }
  }
}


