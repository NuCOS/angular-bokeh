import { Injectable } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
export class UpdateService {
    private update = new Subject<string>();
    push(name: string): void { this.update.next(name); }
    subscribe(action: any): Subscription { return this.update.subscribe(action); }
}

