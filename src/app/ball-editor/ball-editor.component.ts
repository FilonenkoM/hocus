import { Component, OnInit } from '@angular/core';
import { BoardService } from '../services/board.service';

@Component({
  selector: 'app-ball-editor',
  templateUrl: './ball-editor.component.html',
  styleUrls: ['./ball-editor.component.css']
})
export class BallEditorComponent implements OnInit {

  constructor(private _boardService: BoardService) { }

  ngOnInit() {
    this._boardService.drawBordersOnlyInExisting = true;
  }

  ngAfterViewInit() {
    this._boardService.loadLevel(this._boardService.level);
    this._boardService.setNeedsDisplay();
  }
}
