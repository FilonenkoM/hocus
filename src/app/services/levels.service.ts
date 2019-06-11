import { Injectable } from '@angular/core';
import { Level } from '../level';
import { Node } from "../node";
import { Position } from '../position';

@Injectable({
  providedIn: 'root'
})
export class LevelsService {

  private levelCodes = [
    `{"_name":"1","_nodes":[[null,null,null,null,null],[null,{"_positions":[false,false,false,false,false,false]},null,null,null],[null,{"_positions":[false,false,false,false,false,false]},null,{"_positions":[false,false,false,false,true,false]},null],[null,{"_positions":[false,true,false,false,false,false]},{"_positions":[false,true,false,false,true,false]},null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],"_current":{"_column":1,"_row":3,"_direction":0},"_goal":{"_column":3,"_row":2,"_direction":0}} `,
    `{"_name":"2","_nodes":[[null,null,null,null,null],[null,null,null,{"_positions":[false,false,false,true,false,false]},null],[null,null,{"_positions":[false,false,false,true,false,false]},{"_positions":[true,false,false,false,true,false]},null],[null,null,{"_positions":[true,true,false,false,false,false]},null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],"_current":{"_column":3,"_row":1,"_direction":2},"_goal":{"_column":2,"_row":2,"_direction":2}} `,
    `{"_name":"3","_nodes":[[null,null,null,null,null],[null,null,null,null,null],[null,null,{"_positions":[false,false,true,true,false,false]},{"_positions":[false,false,false,false,true,true]},null],[null,null,{"_positions":[true,true,false,false,false,false]},null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],"_current":{"_column":3,"_row":2,"_direction":1},"_goal":{"_column":2,"_row":2,"_direction":0}} `,
    `{"_name":"4","_nodes":[[null,null,null,null,null],[null,null,null,null,null],[null,{"_positions":[false,true,false,true,false,false]},{"_positions":[false,false,false,true,true,false]},null,null],[null,{"_positions":[true,false,true,false,false,false]},{"_positions":[true,false,false,true,false,false]},null,null],[null,null,{"_positions":[true,false,false,false,false,true]},null,null],[null,null,null,null,null],[null,null,null,null,null]],"_current":{"_column":2,"_row":3,"_direction":1},"_goal":{"_column":1,"_row":2,"_direction":4}} `,
    `{"_name":"4","_nodes":[[null,null,null,null,null],[null,null,null,null,null],[null,{"_positions":[false,true,false,true,false,false]},{"_positions":[false,false,true,true,true,false]},{"_positions":[false,false,false,true,false,true]},null],[null,{"_positions":[true,false,true,false,false,false]},{"_positions":[true,false,false,true,false,false]},{"_positions":[true,false,false,false,true,false]},null],[null,null,{"_positions":[true,true,false,false,false,true]},null,null],[null,null,null,null,null],[null,null,null,null,null]],"_current":{"_column":3,"_row":2,"_direction":1},"_goal":{"_column":1,"_row":2,"_direction":2}} `,
    `{"_name":"5","_nodes":[[null,null,null,null,null],[{"_positions":[false,false,false,false,false,false]},null,null,{"_positions":[false,false,false,true,true,false]},null],[{"_positions":[false,true,true,false,false,false]},{"_positions":[false,true,true,false,true,false]},{"_positions":[false,true,false,false,true,false]},{"_positions":[true,false,false,true,true,false]},{"_positions":[false,false,false,false,false,false]}],[null,{"_positions":[false,false,true,false,false,true]},{"_positions":[false,true,false,true,false,true]},{"_positions":[true,false,false,true,false,false]},null],[null,null,{"_positions":[true,false,true,false,false,true]},{"_positions":[true,false,false,false,false,true]},null],[null,null,null,null,null],[null,null,null,null,null]],"_current":{"_column":3,"_row":1,"_direction":1},"_goal":{"_column":0,"_row":2,"_direction":4}} `,
    `{"_name":"6","_nodes":[[null,null,null,null,null],[null,null,null,null,null],[null,{"_positions":[false,true,true,true,false,false]},{"_positions":[false,false,true,false,true,false]},{"_positions":[false,false,false,true,true,true]},null],[null,{"_positions":[true,true,true,false,false,false]},{"_positions":[false,true,false,true,true,true]},{"_positions":[true,false,false,false,true,false]},{"_positions":[false,false,false,false,false,false]}],[null,null,{"_positions":[true,true,false,false,false,true]},null,{"_positions":[false,false,false,false,false,false]}],[null,null,null,null,null],[null,null,null,null,null]],"_current":{"_column":3,"_row":2,"_direction":0},"_goal":{"_column":3,"_row":3,"_direction":2}} `,
    `{"_name":"7","_nodes":[[null,null,null,null,null],[null,null,null,null,{"_positions":[false,false,false,false,false,false]}],[null,{"_positions":[false,true,true,true,false,false]},{"_positions":[false,false,true,true,true,false]},{"_positions":[false,false,false,true,true,true]},null],[null,{"_positions":[true,true,true,false,false,false]},{"_positions":[true,true,true,true,true,true]},{"_positions":[true,false,false,false,true,true]},null],[null,{"_positions":[false,false,false,false,false,false]},{"_positions":[true,true,false,false,false,true]},null,null],[null,null,null,null,null],[null,null,null,null,null]],"_current":{"_column":2,"_row":2,"_direction":0},"_goal":{"_column":1,"_row":3,"_direction":4}} `,
    `{"_name":"8","_nodes":[[{"_positions":[false,false,true,true,false,false]},{"_positions":[false,false,true,true,false,false]},null,null,null],[{"_positions":[true,false,false,true,false,false]},{"_positions":[true,false,true,true,false,true]},{"_positions":[false,false,true,false,false,true]},{"_positions":[false,false,false,false,true,true]},{"_positions":[false,false,false,false,false,false]}],[{"_positions":[true,false,false,true,false,false]},{"_positions":[true,true,false,false,false,false]},{"_positions":[false,true,true,false,true,true]},{"_positions":[false,false,true,false,false,true]},{"_positions":[false,false,false,false,true,true]}],[{"_positions":[true,false,false,true,false,false]},null,null,{"_positions":[false,true,false,false,true,false]},null],[{"_positions":[true,true,false,false,false,false]},{"_positions":[false,true,false,false,true,false]},{"_positions":[false,true,false,false,true,false]},null,null],[null,null,null,null,null],[null,null,null,null,null]],"_current":{"_column":0,"_row":4,"_direction":4},"_goal":{"_column":2,"_row":1,"_direction":0}} `,
    `{"_name":"9","_nodes":[[null,null,null,null,null],[null,null,null,{"_positions":[false,false,false,true,true,false]},null],[{"_positions":[false,true,true,false,false,false]},{"_positions":[false,true,false,false,true,false]},{"_positions":[false,true,false,false,true,false]},{"_positions":[true,false,false,true,true,false]},null],[null,{"_positions":[false,true,true,false,false,true]},{"_positions":[false,true,false,true,true,false]},{"_positions":[true,false,false,true,false,false]},null],[null,null,{"_positions":[true,false,true,false,false,true]},{"_positions":[true,false,false,false,false,true]},null],[null,null,null,null,null],[null,null,null,null,null]],"_current":{"_column":3,"_row":3,"_direction":2},"_goal":{"_column":3,"_row":1,"_direction":0}} `
  ]
  public levels: Level[] = [];

  constructor() { 
    
    for(let code of this.levelCodes) {
      let json = JSON.parse(code);

      let level: Level = new Level(json._name);

      let i = 0;
      for(let nodeArray of json._nodes) {
        let j = 0;
        if(nodeArray != null) for(let node of nodeArray) {
          if(node != null) 
          {
            level.setNode(j ,i, new Node(node._positions));      
          }
          j++;
        }
        // if(nodeArray != null) level.setNode(i ,j, nodeArray._positions);
        i++;
      }

      level.current = new Position(json._current._column, json._current._row, json._current._direction);
      level.goal = new Position(json._goal._column, json._goal._row, json._goal._direction);

      this.levels.push(level);
    }
  }
}
