import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BoardService } from '../services/board.service';
import { Level } from '../level';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  @ViewChild('levelCanvas') private levelCanvas: ElementRef;

  private subscriptions: Subscription[] = [];
  private cx: CanvasRenderingContext2D;
  private hexSize = 50;
  private width = this.hexSize * 2 * 4;
  private height = this.hexSize * 2 * 6 + this.hexSize / 2;
  private gridCoof = 1.73;

  public currentIndex = null;

  private positions: [number, number][] = [];
  private centerCoordinatsX: number[] = [];
  private centerCoordinatsY: number[] = [];
  private connections: boolean[][] = [];

  constructor(private _boardService: BoardService) { 
  }

  ngOnInit() {
    this.subscriptions.push(this._boardService.selected.subscribe(value => {
      this.currentIndex = this.indexOfPosition(value[0], value[1]);
    }));
    this.subscriptions.push(this._boardService.needsDisplay.subscribe(value => {
      if(value) {
        this.setNeedsDisplay();
      }
    }));
    this.subscriptions.push(this._boardService.directionSwitcher.subscribe(value => {
      this._boardService.currentDirections[value] = ! this._boardService.currentDirections[value];
    }));``
    this.subscriptions.push(this._boardService.levelLoader.subscribe(value => {
      this.loadLevel(value);
    }))
    this.subscriptions.push(this._boardService.cubeMover.subscribe(value => {
      this._boardService.level.moveTo(value);
    }))
  }

  ngOnDestroy() {
    for(let subscription of this.subscriptions) subscription.unsubscribe();
  }
  ngAfterViewInit() {


    const canvasEl: HTMLCanvasElement = this.levelCanvas.nativeElement;
    this.cx = canvasEl.getContext('2d');
    canvasEl.height = window.innerHeight;
    canvasEl.width = window.innerWidth;

    for(let i=0;i<29;i++) {
      this.connections.push([false, false, false, false, false, false]);
    }

    this.redraw();
  }

  showOverlay(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    let index = this.findClosestHexagon(x ,y);
    if(index != -1) {
      this._boardService.clicked(this.positions[index][0], this.positions[index][1]);
    }
    else this._boardService.clickedOut();
    // editor logic
    // if(this.currentIndex != -1) {
    //   this.level.setNode(this.positions[this.currentIndex][0], this.positions[this.currentIndex][1], new Node())
    // }

  }

  setNeedsDisplay() {

    this.redraw();
  }

  private redraw() {

    this.cx.clearRect(0, 0, this.levelCanvas.nativeElement.width, this.levelCanvas.nativeElement.height);
    this.drawBoard(this.cx, this.hexSize, this.gridCoof);
  
    console.log(JSON.stringify(this._boardService.level));
    for(let i=0;i<this.connections.length;i++) {

      if(this.connections[i].some(value => value == true)) { 

        this.drawNode(i, this.connections[i]);
      }
    }

    if(this.currentIndex != null) {
      this.drawTriangles(this.currentIndex);
      this.drawNode(this.currentIndex, this._boardService.currentDirections);
    }
  }

  public drawBoard (canvasContext, hexSize, gridCoof) {

    let basicHOffset = (this.levelCanvas.nativeElement.width - this.width) / 2;
    let basicYOffset = (this.levelCanvas.nativeElement.height - this.height) / 3;
    for (let i = 0; i < 7; i++) {
      if (i != 6 && i != 5) {
        this.positions.push([0, i]);
        let stroke = ! this._boardService.playMode && (! this._boardService.drawBordersOnlyInExisting || this._boardService.nodeExists(0, i)) 
          this.drawHexagon (canvasContext, basicHOffset + this.hexSize, basicYOffset + this.hexSize * 2.5 + 10 + (i * hexSize * gridCoof), stroke, hexSize); 
      }
      if (i != 6) {
        this.positions.push([1, i]);
        let stroke = ! this._boardService.playMode && (! this._boardService.drawBordersOnlyInExisting || this._boardService.nodeExists(1, i)) 
          this.drawHexagon (canvasContext, basicHOffset + this.hexSize * 2.5, basicYOffset + this.hexSize * 1.5 + 17 + (i * hexSize * gridCoof), stroke, hexSize); 
      }
      this.positions.push([2, i]);
      let stroke = ! this._boardService.playMode && (! this._boardService.drawBordersOnlyInExisting || this._boardService.nodeExists(2, i)) 
      this.drawHexagon (canvasContext, basicHOffset + this.hexSize * 4, basicYOffset + this.hexSize - 1 + (i * hexSize * gridCoof), stroke, hexSize);
      if (i != 6) {
        this.positions.push([3, i]);
        let stroke = ! this._boardService.playMode && (! this._boardService.drawBordersOnlyInExisting || this._boardService.nodeExists(3, i)) 
        this.drawHexagon (canvasContext, basicHOffset + this.hexSize * 5.5, basicYOffset + this.hexSize * 1.5 + 17 + (i * hexSize * gridCoof), stroke, hexSize); 
      }
      if (i != 6 && i != 5) {
        this.positions.push([4, i]);
        let stroke = ! this._boardService.playMode && (! this._boardService.drawBordersOnlyInExisting || this._boardService.nodeExists(4, i)) 
        this.drawHexagon (canvasContext, basicHOffset + this.hexSize * 7, basicYOffset + this.hexSize * 2.5 + 10 + (i * hexSize * gridCoof), stroke, hexSize); 
      }
    }
  }

  private drawTriangles(index: number) {
    this.cx.fillStyle = "red";

    let x = this.centerCoordinatsX[index];
    let y = this.centerCoordinatsY[index];
    let offset = 5;

    this.drawTriangle(x - this.hexSize / 2, y - this.hexSize, 
      x + this.hexSize / 2, y - this.hexSize, 
      x, y - this.hexSize * 1.5);
    
    this.drawTriangle (x - this.hexSize / 2, y + this.hexSize, 
      x + this.hexSize / 2, y + this.hexSize, 
      x, y + this.hexSize * 1.5);

    this.drawTriangle(x + this.hexSize / 2 + offset * 2, y + this.hexSize - offset * 2, 
      x + this.hexSize + offset, y + offset, 
      x + this.hexSize + offset * 4, y + this.hexSize - offset * 2);

    this.drawTriangle(x + this.hexSize / 2 + offset * 2, y - this.hexSize + offset * 2, 
       x + this.hexSize + offset, y - offset, 
       x + this.hexSize + offset * 4, y - this.hexSize + offset * 2);

    this.drawTriangle(x - this.hexSize / 2 - offset * 2, y - this.hexSize + offset * 2, 
      x - this.hexSize - offset, y - offset, 
      x - this.hexSize - offset * 4, y - this.hexSize + offset * 2);

    this.drawTriangle(x - this.hexSize / 2 - offset * 2, y + this.hexSize - offset * 2, 
      x - this.hexSize - offset, y + offset, 
      x - this.hexSize - offset * 4, y + this.hexSize - offset * 2);

  } 

  public loadLevel(level: Level) {
    for(let i=0;i<this.connections.length;i++) this.connections[i] = [false, false, false, false, false, false]

    for(let i=0;i<7;i++) {
      for(let j=0;j<5;j++) {
        if(! level.nodes[i][j]) {

        }
        else for(let k=0;k<6;k++) {
            this.setConnections(j,i,k, level.nodes[i][j].positions[k]);
        }
      }
    }
  }

  private setConnections(column: number, row: number, direction: number, value: boolean) {
    let index = this.indexOfPosition(column, row);
    this.connections[index][direction] = value;
  }

  private drawNode(index: number, connections: boolean[]) {

    let dark = "rgb(72, 69, 71)";
    let mid = "rgb(99, 106, 100";
    let light = "rgb(152, 150, 152)";
    let x = this.centerCoordinatsX[index];
    let y = this.centerCoordinatsY[index];

    let height = (this.hexSize / 2) * Math.sqrt(3);

    let m = height / 3;

    let a1 = x + m * Math.sin(Math.PI / 3);
    let b1 = y - m * Math.cos(Math.PI / 3);

    let a2 = x;
    let b2 = y - m;

    let a3 = x - m * Math.sin(Math.PI / 3);
    let b3 = b1;

    let a4 = a3;
    let b4 = b3 + m;

    let a5 = x;
    let b5 = y + m;

    let a6 = a1;
    let b6 = b1 + m;

    if(this._boardService.level.current 
      && this.positions[index][0] == this._boardService.level.current.column
      && this.positions[index][1] == this._boardService.level.current.row) {

        if(this._boardService.level.current.direction == 1)
          this.drawCube(a1, b1);
        if(this._boardService.level.current.direction == 3)
          this.drawCube(a5, b5);
        if(this._boardService.level.current.direction == 5)
          this.drawCube(a3, b3);
        if(this._boardService.level.current.direction == 17)
          this.drawCube(a6, b6);
        if(this._boardService.level.current.direction == 18)
          this.drawCube(a4, b4);
        if(this._boardService.level.current.direction == 19)
          this.drawCube(a2, b2);
      }

    this.cx.fillStyle = light;
    this.drawQuadriateral(x, y, a1, b1, a2, b2, a3, b3);

    this.cx.fillStyle = dark;
    this.drawQuadriateral(x ,y, a3, b3, a4, b4, a5, b5);

    this.cx.fillStyle = mid;
    this.drawQuadriateral(x ,y, a5, b5, a6, b6, a1, b1);


    let kx: number[] = [
      x + height * Math.sin(Math.PI / 3),
      x - height * Math.sin(Math.PI / 3),
    ];

    let ky: number[] = [
      y - height * Math.cos(Math.PI / 3),
      y + height * Math.cos(Math.PI / 3),
    ];

    let mx: number[] = [
      a5 + (m / 2 + Math.sqrt(3) * this.hexSize / 2) * Math.cos(Math.PI / 6),
      a5 - (m / 2 + Math.sqrt(3) * this.hexSize / 2) * Math.cos(Math.PI / 6),
    ];

    let my: number[] = [
      b5 - (m / 2 + Math.sqrt(3) * this.hexSize / 2) * Math.sin(Math.PI / 6),
      b2 + (m / 2 + Math.sqrt(3) * this.hexSize / 2) * Math.sin(Math.PI / 6),
    ];

    let nx: number[] = [
      a3 + (m / 2 + Math.sqrt(3) * this.hexSize / 2) * Math.cos(Math.PI / 6),
      a1 - (m / 2 + Math.sqrt(3) * this.hexSize / 2) * Math.cos(Math.PI / 6),
    ];

    let ny: number[] = [
      b3 - (m / 2 + Math.sqrt(3) * this.hexSize / 2) * Math.sin(Math.PI / 6),
      b4 + (m / 2 + Math.sqrt(3) * this.hexSize / 2) * Math.sin(Math.PI / 6),
    ];


    // bottom
    if(connections[3]) {
      this.cx.fillStyle = mid;
      this.drawQuadriateral(a5 ,b5, a6, b6, a6, y + height, a5, y + height);
      this.cx.fillStyle = dark;
      this.drawQuadriateral(a5, b5, a4, b4, a4, y + height, a5, y + height);
    }


    // right top
    if(connections[1]) {
      this.cx.fillStyle = mid;
      this.drawQuadriateral(x ,y, a5, b5, mx[0], my[0], kx[0], ky[0]);
      this.cx.fillStyle = light;
      this.drawQuadriateral(x ,y, a3, b3, nx[0], ny[0], kx[0], ky[0]);
    }
    // left top
    if(connections[5]) {
      this.cx.fillStyle = dark;
      this.drawQuadriateral(x ,y, a5, b5, mx[1], my[0], kx[1], ky[0]);
      this.cx.fillStyle = light;
      this.drawQuadriateral(x ,y, a1, b1, nx[1], ny[0], kx[1], ky[0]);
    }

    if(this._boardService.level.current 
      && this.positions[index][0] == this._boardService.level.current.column
      && this.positions[index][1] == this._boardService.level.current.row) {

        if(this._boardService.level.current.direction == 6)
          this.drawCube(a1, b1 - m) ;
        if(this._boardService.level.current.direction == 11)
          this.drawCube(a4, y - 1.5*m) ;
        if(this._boardService.level.current.direction == 9)
          this.drawCube(a4, b4 + m) ;
        if(this._boardService.level.current.direction == 7)
          this.drawCube(2*a1 - x, y) ;
        if(this._boardService.level.current.direction == 10)
          this.drawCube(x - (x - a4) * 2, y) ;

      }

    // top
    if(connections[0]) {
      this.cx.fillStyle = mid;
      this.drawQuadriateral(a1, b1, a5, b5, a2, y - height, a1, y - height);
      this.cx.fillStyle = dark;
      this.drawQuadriateral(x, y, a3, b3, a3, y - height, a2, y - height);
    }

    // // left bottom
    if(connections[4]) {
      this.cx.fillStyle = light;
      this.drawQuadriateral(x ,y, a3, b3, mx[1], my[1], kx[1], ky[1]);
      this.cx.fillStyle = mid;
      this.drawQuadriateral(x ,y, a5, b5, nx[1], ny[1], kx[1], ky[1]);
    }


  if(this._boardService.level.current 
    && this.positions[index][0] == this._boardService.level.current.column
    && this.positions[index][1] == this._boardService.level.current.row) {
      if(this._boardService.level.current.direction == 8)
      this.drawCube(a1, y + 1.5*m) ;
    }

    // right bottom
    if(connections[2]) {
      this.cx.fillStyle = light;
      this.drawQuadriateral(x ,y, a1, b1, mx[0], my[1], kx[0], ky[1]);
      this.cx.fillStyle = dark;
      this.drawQuadriateral(x ,y, a5, b5, nx[0], ny[1], kx[0], ky[1]);
    }

    if(this._boardService.level.current 
      && this.positions[index][0] == this._boardService.level.current.column
      && this.positions[index][1] == this._boardService.level.current.row) {
        if(this._boardService.level.current.direction == 0)
          this.drawCube(a2, b2);
        if(this._boardService.level.current.direction == 2)
          this.drawCube(a6, b6);
        if(this._boardService.level.current.direction == 4)
          this.drawCube(a4, b4);
        if(this._boardService.level.current.direction == 13)
          this.drawCube(a3, b3);
        if(this._boardService.level.current.direction == 15)
          this.drawCube(a5, b5);
        if(this._boardService.level.current.direction == 16)
          this.drawCube(a1, b1);
      }
    
    dark = "rgb(139, 5, 1)";
    mid = "rgb(190, 0, 3)";
    light = "rgb(245, 5, 1)";

    if(this._boardService.level.goal 
      && this._boardService.level.goal.column == this.positions[index][0] 
      && this._boardService.level.goal.row == this.positions[index][1]) {
        if(this._boardService.level.goal.direction == 0) {
          this.cx.fillStyle = light;
          this.drawQuadriateral(x ,y, a1, b1, a2, b2, a3, b3);
        }
        if(this._boardService.level.goal.direction == 4) {
          this.cx.fillStyle = dark;
          this.drawQuadriateral(x, y, a3, b3, a4, b4, a5, b5);
        }
        if(this._boardService.level.goal.direction == 2) {
          this.cx.fillStyle = mid;
          this.drawQuadriateral(x, y, a5, b5, a6, b6, a1, b1);
        }
      }


  }

  private drawQuadriateral(a1, b1, a2, b2, a3, b3, a4, b4) {
    this.cx.beginPath();
    this.cx.moveTo(a1, b1);
    this.cx.lineTo(a2, b2);
    this.cx.lineTo(a3, b3);
    this.cx.lineTo(a4, b4);
    this.cx.closePath();
    this.cx.fill();
  }

  private drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    this.cx.beginPath();
    this.cx.moveTo(x1, y1);
    this.cx.lineTo(x2, y2);
    this.cx.lineTo(x3, y3);
    this.cx.fill();
  }

  private indexOfPosition(a,b) {
    for(let i=0;i<this.positions.length;i++) {
      let coords = this.positions[i];

      if(coords[0] == a && coords[1] == b) 
      return i;
    }
  }

  public drawHexagon (canvasContext, x, y, stroke, hexSize) {
    this.centerCoordinatsX.push(x);
    this.centerCoordinatsY.push(y);
    canvasContext.beginPath();
    for (let side = 0; side < 7; side++) {
      this.cx.lineTo(x + hexSize * Math.cos(side * 2 * Math.PI / 6), y + hexSize * Math.sin(side * 2 * Math.PI / 6));
    }
    canvasContext.closePath();

    if (stroke) { canvasContext.stroke(); }
  }

  private findClosestHexagon(x: number, y: number): number {
    let minDistance = 100000;
    let minIndex = 1100000;
    for(let i=0;i<this.centerCoordinatsX.length;i++) {
      let distance = Math.sqrt((x - this.centerCoordinatsX[i]) ** 2 + (y - this.centerCoordinatsY[i]) ** 2);
      if(distance < minDistance) {
        minDistance = distance;
        minIndex = i;
      }
    }
    return minDistance < this.hexSize ? minIndex : -1;
  }

  private drawCube(x: number, y: number) {
    let dark = "rgb(139, 5, 1)";
    let mid = "rgb(190, 0, 3)";
    let light = "rgb(245, 5, 1)";

    let height = (this.hexSize / 2) * Math.sqrt(3);

    let m = height / 3;

    let a1 = x + m * Math.sin(Math.PI / 3);
    let b1 = y - m * Math.cos(Math.PI / 3);

    let a2 = x;
    let b2 = y - m;

    let a3 = x - m * Math.sin(Math.PI / 3);
    let b3 = b1;

    let a4 = a3;
    let b4 = b3 + m;

    let a5 = x;
    let b5 = y + m;

    let a6 = a1;
    let b6 = b1 + m;

    this.cx.fillStyle = light;
    this.drawQuadriateral(x, y, a1, b1, a2, b2, a3, b3);

    this.cx.fillStyle = dark;
    this.drawQuadriateral(x ,y, a3, b3, a4, b4, a5, b5);

    this.cx.fillStyle = mid;
    this.drawQuadriateral(x ,y, a5, b5, a6, b6, a1, b1);

  }
}
