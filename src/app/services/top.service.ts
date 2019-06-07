import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class TopService {
  levelEditionInProcess: boolean = false;
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
}
