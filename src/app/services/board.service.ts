import { Injectable, EventEmitter } from '@angular/core';
import { Level } from '../level';


@Injectable({
  providedIn: 'root'
})
export class BoardService {
  public notifyClicked: EventEmitter<[number, number]> = new EventEmitter();
  public selected: EventEmitter<[number, number]> = new EventEmitter();
  public needsDisplay: EventEmitter<boolean> = new EventEmitter();
  public directionSwitcher: EventEmitter<number> = new EventEmitter();
  public cubeMover: EventEmitter<number> = new EventEmitter();

  public levelLoader: EventEmitter<Level> = new EventEmitter();
  public notifyClickedOutOfBoard: EventEmitter<boolean> = new EventEmitter();;
  
  public drawBordersOnlyInExisting = false;
  public playMode = false;
  public level = new Level();
  public currentDirections = [false, false, false, false, false, false];

  constructor(private _boardServie: BoardService) { }

  public clicked(column: number, row: number) {
    this.notifyClicked.next([column, row]);
  }

  public setNeedsDisplay() {
    this.needsDisplay.next(true);
  }

  public trianglesNeedsToBeShown = false;
  public connections: number[][];

  public select(column: number, row: number) {
    this.selected.next([column, row]);
  }

  public toEditMode() {
    this.trianglesNeedsToBeShown = true;
  }

  public toDisplayMode() {
    this.trianglesNeedsToBeShown = false;
  }

  public switchDirection(direction: number) {
    this.directionSwitcher.next(direction);
  }

  public clearDirections() {
    this.currentDirections = [false, false, false, false, false, false];
  }

  public loadLevel(level: Level) {
    this.levelLoader.next(level);
  }

  public nodeExists(column: number, row: number) {
    return this.level.getNode(column, row) && this.level.getNode(column, row).positions.some(value => value);
  }

  public clickedOut() {
    this.notifyClickedOutOfBoard.next(true);
  }

  public moveCube(direction: number) {
    this.cubeMover.next(direction);
  }
}
