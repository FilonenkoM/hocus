
export class Position {
    constructor(private _row: number, private _column: number, private _direction: number) { } 

    public get row() { return this._row; }
    get column() { return this.column; }
    get direction() { return this._direction; }

    public set row(value) { this._row = value; }
    set column(value) { this._column = value; }
    set direction(value) { this._direction = value; }

}
