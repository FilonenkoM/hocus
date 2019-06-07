
export class Node {

    constructor(private _positions: boolean[] = [false, false, false, false, false, false]) { }
    get positions() { return this._positions; }
    set positions(value) { this._positions = value; }
    public get(at: number): boolean { return this._positions[at]; }
    public set(at: number, value: boolean): void { this.positions[at] = value; }
}