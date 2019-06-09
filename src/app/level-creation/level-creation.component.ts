import { Component, OnInit, HostListener } from '@angular/core';
import { TopService } from '../services/top.service';
import { Node } from "../node"
import { BoardService } from '../services/board.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-level-creation',
  templateUrl: './level-creation.component.html',
  styleUrls: ['./level-creation.component.css']
})

export class LevelCreationComponent implements OnInit {
  
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch(event.keyCode) {
      case KeyDirections.TOP: 
        this._boardService.switchDirection(0);
        break;
      case KeyDirections.RIGHT_TOP:
        this._boardService.switchDirection(1);
        break;
      case KeyDirections.RIGHT_BOTTOM:
        this._boardService.switchDirection(2);
        break;
      case KeyDirections.BOTTOM:
        this._boardService.switchDirection(3);
        break;
      case KeyDirections.LEFT_BOTTOM:
        this._boardService.switchDirection(4);
        break;
      case KeyDirections.LEFT_TOP:
        this._boardService.switchDirection(5);
        break;
    }

    this._boardService.loadLevel(this._boardService.level);
    this._boardService.setNeedsDisplay();
  }

  constructor(private _topService: TopService, private _boardService: BoardService, private _router: Router) { }

  currentPosition: [number ,number] = null;

  subscriptions: Subscription[] = [];

  ngOnInit() {
    this._topService.setPbValue(20);
    this._boardService.level.current = null;
    this._boardService.drawBordersOnlyInExisting = false;
    this.subscriptions.push(this._topService.nextClicked.subscribe(value => {
      this._router.navigateByUrl("/balledit");
    }));

    this._topService.levelEditionInrocessChange.next(true);
    this._boardService.toEditMode();


    this.subscriptions.push(this._boardService.notifyClicked.subscribe(value => {


      this.save();
      
      this._boardService.select(value[0], value[1]);
      this._boardService.clearDirections();

      if(this._boardService.level.getNode(value[0], value[1])) {
        this._boardService.currentDirections = this._boardService.level.getNode(value[0], value[1]).positions;
      }

      this._boardService.setNeedsDisplay();
      this.currentPosition = [value[0], value[1]]
    }));
  }

  ngOnDestroy() {
    for(let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this._topService.levelEditionInrocessChange.next(false);
    this.save();
  }

  ngAfterViewInit() {
    this._boardService.loadLevel(this._boardService.level);
    this._boardService.setNeedsDisplay();
  }

  public save() {
    if(this.currentPosition) {
      if(this._boardService.level.getNode(this.currentPosition[0], this.currentPosition[1]) == null) 
      {
        this._boardService.level.setNode(this.currentPosition[0], this.currentPosition[1], new Node(this._boardService.currentDirections));
      }
      else {
        this._boardService.level.getNode(this.currentPosition[0], this.currentPosition[1]).positions = this._boardService.currentDirections;
      }
      this._boardService.loadLevel(this._boardService.level);
    }
  }
}

export enum KeyCodes {
  Q = 81, 
  W = 87,
  E = 69,
  A = 65,
  S = 83,
  D = 68,
}

export enum KeyDirections {
  TOP = KeyCodes.W,
  RIGHT_TOP = KeyCodes.E,
  RIGHT_BOTTOM = KeyCodes.D,
  BOTTOM = KeyCodes.S,
  LEFT_BOTTOM = KeyCodes.A,
  LEFT_TOP = KeyCodes.Q,
}