import { Position } from './position';
import { Node } from './node';

export class Level {

    constructor(public _name: string = null, private _nodes: Node[][] = [], private _current: Position = null, private _goal: Position = null)
    { 
        for(let i=0;i<7;i++) {
            _nodes.push([]);
            for(let j=0;j<5;j++) {
                _nodes[i].push(null);
            }
        }

    }

    public foundIntermediate(first: number, second: number) {
        if(first == 0 && second == 1 || first == 1 && second == 0) return 6;
        if(first == 0 && second == 4 || first == 4 && second == 4) return 13;
        if(first == 2 && second == 4 || first == 4 && second == 2) return 15;
        if(first == 2 && second == 0 || first == 0 && second == 2) return 16;
        if(first == 0 && second == 5 || first == 5 && second == 0) return 11;
        if(first == 1 && second == 3 || first == 3 && second == 1) return 17;
        if(first == 3 && second == 4 || first == 4 && second == 3) return 9;
        if(first == 1 && second == 2 || first == 2 && second == 1) return 7;
        if(first == 3 && second == 5 || first == 5 && second == 3) return 18;
        if(first == 1 && second == 5 || first == 5 && second == 1) return 19;
        if(first == 4 && second == 5 || first == 5 && second == 4) return 10;
        if(first == 2 && second == 3 || first == 3 && second == 2) return 8;

    }

    public getClosest(direction: number) {
        if(direction == 6) return [0, 1];
        if(direction == 13) return [0, 4];
        if(direction == 15) return [2, 4];
        if(direction == 16) return [0, 2];
        if(direction == 11) return [0, 5];
        if(direction == 17) return [1, 3];
        if(direction == 9) return [3, 4];
        if(direction == 7) return [1, 2];
        if(direction == 18) return [3, 5];
        if(direction == 19) return [1, 5];
        if(direction == 10) return [4, 5];
        if(direction == 8) return [2, 3];

    }
    
    public getNode(column: number, row: number) : Node {
        return this._nodes[row][column];
    }

    public setNode(column: number, row: number, node: Node) : void {
        this._nodes[row][column] = node;
    }

    get current(): Position {
        return this._current;
    }

    get nodes() : Node[][] {
        return this._nodes;
    }

    get goal(): Position {
        return this._goal;
    }

    set current(value) {
        this._current = value;
    }

    set goal(value) {
        this._goal = value;
    }

    static oppositeDirection(direction: number) {
        switch(direction) {
            case 0: return 3;
            case 1: return 4;
            case 2: return 5;
            case 3: return 0;
            case 4: return 1;
            case 5: return 2;
            default: throw -1;
        }
    }

    public neighbors(): [number, number][] {
        let n = [];
        for(let i=0;i<6;i++) {
            n.push([undefined, undefined]);
        }
        n[0] = [this.current.column, this.current.row - 1];
        n[3] = [this.current.column, this.current.row + 1];

        switch(this.current.column) {
            case 0:
                n[1] = [this.current.column + 1, this.current.row];
                n[2] = [this.current.column + 1, this.current.row + 1];
                break;
            case 1:
                 n[1] = [this.current.column + 1, this.current.row];
                 n[2] = [this.current.column + 1, this.current.row + 1];
                 n[4] = [this.current.column - 1, this.current.row];
                 n[5] = [this.current.column - 1, this.current.row - 1];

                 break;
            case 2:
                n[1] = [this.current.column + 1, this.current.row -1];
                n[2] = [this.current.column + 1, this.current.row];
                n[4] = [this.current.column - 1, this.current.row];
                n[5] = [this.current.column - 1, this.current.row - 1];

                break;
            case 3:
                n[1] = [this.current.column + 1, this.current.row - 1];
                n[2] = [this.current.column + 1, this.current.row];
                n[4] = [this.current.column - 1, this.current.row + 1];
                n[5] = [this.current.column - 1, this.current.row];

                break;
            case 4:
                n[4] = [this.current.column - 1, this.current.row + 1];
                n[5] = [this.current.column - 1, this.current.row];

        }
        return n;

    }

    moveTo(direction: number) {
        let neighbors = this.neighbors();


        if(this.current.direction < 6) {
            if(this.getNode(this.current.column, this.current.row).positions[direction] 
                && ! (this.current.direction == Level.oppositeDirection(direction)) 
                && this.getNode(neighbors[direction][0], neighbors[direction][1])
                && this.getNode(neighbors[direction][0], neighbors[direction][1]).positions.some(value => value))
            {  
                if(! this.getNode(neighbors[direction][0], neighbors[direction][1]).positions[this.current.direction]) {
                    this.current.column = neighbors[direction][0];
                    this.current.row = neighbors[direction][1];
                }
                else {
                    let intermediate = this.foundIntermediate(this.current.direction, Level.oppositeDirection(direction));
                    this.current.column = neighbors[direction][0];
                    this.current.row = neighbors[direction][1];
                    this.current.direction = intermediate;
                }
            }
        }
        else {
            let closest = this.getClosest(this.current.direction);

            if(direction == closest[0]) {
                this.current.direction = closest[1];
                this.moveTo(closest[0]);
            }
            if(direction == closest[1]){
                this.current.direction = closest[0];
                this.moveTo(closest[1]);
            }
        }

    }

    public finished() {
        return this.current.column == this.goal.column && this.current.row == this.goal.row && this.current.direction == this.goal.direction;
    }
}

class NodePosition {
    constructor(public row: number, public column: number, public node: Node) { }
}