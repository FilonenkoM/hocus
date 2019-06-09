import { Component, OnInit } from '@angular/core';
import { TopService } from '../services/top.service';
import { BoardService } from '../services/board.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.css']
})
export class NameComponent implements OnInit {

  constructor(private _topService: TopService, private _boardService: BoardService, private _router: Router) { }

  ngOnInit() {
    this._topService.levelEditionInrocessChange.next(true);
    this._topService.setPbValue(80);
  }

  setName(event) {
    this._boardService.level._name = event.target.value;
    this._router.navigateByUrl("/verify");
  }
}
