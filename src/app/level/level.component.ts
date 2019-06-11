import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { LevelsService } from '../services/levels.service';
import { BoardService } from '../services/board.service';
import { Level } from '../level';
import { Subscription } from 'rxjs';
import { KeyDirections } from '../level-creation/level-creation.component';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {

  private levelIndex: number;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch(event.keyCode) {
      case KeyDirections.TOP: 
        this._boardService.moveCube(0);
        break;
      case KeyDirections.RIGHT_TOP:
        this._boardService.moveCube(1);
        break;
      case KeyDirections.RIGHT_BOTTOM:
        this._boardService.moveCube(2);
        break;
      case KeyDirections.BOTTOM:
        this._boardService.moveCube(3);
        break;
      case KeyDirections.LEFT_BOTTOM:
        this._boardService.moveCube(4);
        break;
      case KeyDirections.LEFT_TOP:
        this._boardService.moveCube(5);
        break;
    }
    this._boardService.setNeedsDisplay();

    if(this._boardService.level.finished()) {
      if(this.levelIndex < this._levelService.levels.length - 1) {
        this.levelIndex ++;
        this.router.navigateByUrl("/level/" + this.levelIndex);
      }
    }
  }

  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router, private _levelService: LevelsService, private _boardService: BoardService) { }

  ngOnInit() {
    this._boardService.playMode = true;
  }

  ngOnDestroy() {
    this._boardService.playMode = false;
    this._boardService.level = new Level();
    this._boardService.loadLevel(this._boardService.level);

    for(let subscription of this.subscriptions) subscription.unsubscribe();

    
  }

  ngAfterViewInit() {
    this.subscriptions.push(this.route.params.subscribe(value => {
      let index = +value["id"];
      this.levelIndex = index;
      this._boardService.level = this._levelService.levels[index];
      this._boardService.loadLevel(this._boardService.level);
      this._boardService.setNeedsDisplay();
    }))

  }
}
