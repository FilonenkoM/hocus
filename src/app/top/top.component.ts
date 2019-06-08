import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { TopService } from '../services/top.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {
  tickHidden: boolean = true;
  ngOnInit() {

  }
  constructor(private _location: Location, private _topService: TopService) {  
    this._topService.levelEditionInrocessChange.subscribe((value) => {
      this.tickHidden = ! value;
    });
  }
  public back(event) {
    this._location.back();
  }

  public next() {
    this._topService.next();
  }
}
