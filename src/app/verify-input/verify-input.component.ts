import { Component, OnInit } from '@angular/core';
import { TopService } from '../services/top.service';
import { BoardService } from '../services/board.service';

@Component({
  selector: 'app-verify-input',
  templateUrl: './verify-input.component.html',
  styleUrls: ['./verify-input.component.css']
})
export class VerifyInputComponent implements OnInit {

  constructor(private _topService: TopService, private _boardService: BoardService) { }

  textarea = "Test input";
  ngOnInit() {
    this._topService.levelEditionInrocessChange.next(true);
    this._topService.setPbValue(100);
    this.textarea = JSON.stringify(this._boardService.level);
  }


}
