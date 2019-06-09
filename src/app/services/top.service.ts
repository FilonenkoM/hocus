import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class TopService {
  levelEditionInProcess: boolean = false;

  public nextClicked: EventEmitter<boolean> = new EventEmitter();
  public notifyPbChanged: EventEmitter<number> = new EventEmitter();

  public levelEditionInrocessChange: Subject<boolean> = new Subject<boolean>();

  constructor() { 
    this.levelEditionInrocessChange.subscribe((value) => {
      this.levelEditionInProcess = value;
    });
  }

  public startLevelEditionProcess() {
    this.levelEditionInrocessChange.next(true);
  }

  public endLevelEditionProcess() {
    this.levelEditionInrocessChange.next(false);
  }

  public next() {
    this.nextClicked.next(true);
  }

  public setPbValue(value: number) {
    this.notifyPbChanged.next(value);
  }
}
