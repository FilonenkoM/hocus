import { Component, OnInit } from '@angular/core';
import { LevelsService } from '../services/levels.service';
import { Level } from '../level';

@Component({
  selector: 'app-level-selector',
  templateUrl: './level-selector.component.html',
  styleUrls: ['./level-selector.component.css']
})
export class LevelSelectorComponent implements OnInit {

  public levels: Level[] = [];
  constructor(private _levelService: LevelsService) { 
    this.levels = _levelService.levels;
  }


  ngOnInit() {
  }

  
}
