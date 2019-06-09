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

    private neighbors(np: NodePosition): NodePosition[] {
        let candidates: NodePosition[] = [
            new NodePosition(this.current.row - 2, this.current.column, this.getNode(this.current.row - 2, this.current.column)),
            new NodePosition(this.current.row - 1, this.current.column + 1, this.getNode(this.current.row - 1, this.current.column + 1)),
            new NodePosition(this.current.row + 1, this.current.column + 1, this.getNode(this.current.row + 1, this.current.column + 1)),
            new NodePosition(this.current.row + 2, this.current.column, this.getNode(this.current.row + 2, this.current.column)),
            new NodePosition(this.current.row + 1, this.current.column - 1, this.getNode(this.current.row + 1, this.current.column - 1)),
            new NodePosition(this.current.row - 1, this.current.column - 1, this.getNode(this.current.row - 1, this.current.column - 1)),
        ];
        return candidates.map((np: NodePosition) => (np.row >= 0 
            && np.column >= 0 
            && np.row < 13 
            && np.column < 5
            && ((np.row == 0 && np.column == 0) 
                || (np.row == 0 && np.column == 4) 
                || (np.row == 12 && np.column == 0) 
                || (np.row == 12 && np.column == 4))) ? null : np);
    }

    public getAvailableDirections(): boolean[] {
        let directions =  this.neighbors(new NodePosition(this.current.row, this.current.column, this.getNode(this.current.row, this.current.column))).map(
            (np: NodePosition) => np == null
        );
        directions[Level.oppositeDirection(this.current.direction)] = false;
        return directions;
    }

    public canMoveIn(direction: number) {
        return this.getAvailableDirections()[direction];
    }

    public moveIn(direction: number): boolean {
        if(! this.canMoveIn(direction)) throw -1;
        let neighbors = this.neighbors(new NodePosition(this.current.row, this.current.column, this.getNode(this.current.row, this.current.column)));
        let target = neighbors[direction];
        this._current = new Position(target.row, target.column, Level.oppositeDirection(direction));
        return this._current.row == this._goal.row && this._current.column == this._goal.column && this._current.direction == this._goal.direction;
    }
}

class NodePosition {
    constructor(public row: number, public column: number, public node: Node) { }
}