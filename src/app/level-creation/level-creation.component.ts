import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TopService } from '../services/top.service';
import { createText } from '@angular/core/src/view/text';
import { Level } from '../level';
import { Node } from "../node"

@Component({
  selector: 'app-level-creation',
  templateUrl: './level-creation.component.html',
  styleUrls: ['./level-creation.component.css']
})

export class LevelCreationComponent implements OnInit {

  constructor(private _topService: TopService) { }

  currentIndex: number = -1;

  level: Level = new Level();
  currentPositions: boolean[] = [true, true, true, true, true, true];

  private indexOfPosition(a,b) {
    for(let i=0;i<this.positions.length;i++) {
      let coords = this.positions[i];

      if(coords[0] == a && coords[1] == b) 
      return i;
    }
  }
  private redraw() {
    this.cx.clearRect(0, 0, this.levelCanvas.nativeElement.width, this.levelCanvas.nativeElement.height);
    this.drawBoard(this.cx, this.hexSize, this.gridCoof);
    
    for(let i=0;i<5;i++) {
      for(let j=0;j<7;j++) {
        let node = this.level.getNode(i ,j);
        if(node) {
          let index = this.indexOfPosition(i, j);
          this.drawCube(this.centerCoordinatsX[index], this.centerCoordinatsY[index]);
        }
      }
    }

    if(this.currentIndex != -1) {
      this.drawTriangles(this.currentIndex);
      this.drawCube(this.centerCoordinatsX[this.currentIndex],this.centerCoordinatsY[this.currentIndex]);
    }
  }

  ngOnInit() {
    this._topService.levelEditionInrocessChange.next(true);
  }

  ngOnDestroy() {
    this._topService.levelEditionInrocessChange.next(false);
  }

  @ViewChild('levelCanvas') public levelCanvas: ElementRef;

  public hexSize = 50;
  public width = this.hexSize * 2 * 4;
  public height = this.hexSize * 2 * 6 + this.hexSize / 2;
  public gridCoof = 1.73;
  public centerCoordinatsX: number[] = [];
  public centerCoordinatsY: number[] = [];
  public positions: [number, number][] = [];

  private cx: CanvasRenderingContext2D;

  public drawBoard (canvasContext, hexSize, gridCoof) {
    let basicHOffset = (this.levelCanvas.nativeElement.width - this.width) / 2;
    let basicYOffset = (this.levelCanvas.nativeElement.height - this.height) / 3;
    for (let i = 0; i < 7; i++) {
      if (i != 6 && i != 5) {
        this.positions.push([0, i]);
        this.drawHexagon (canvasContext, basicHOffset + this.hexSize, basicYOffset + this.hexSize * 2.5 + 10 + (i * hexSize * gridCoof), false, hexSize); 
      }
      if (i != 6) {
        this.positions.push([1, i]);
        this.drawHexagon (canvasContext, basicHOffset + this.hexSize * 2.5, basicYOffset + this.hexSize * 1.5 + 17 + (i * hexSize * gridCoof), false, hexSize); 
      }
      this.positions.push([2, i]);
      this.drawHexagon (canvasContext, basicHOffset + this.hexSize * 4, basicYOffset + this.hexSize - 1 + (i * hexSize * gridCoof), false, hexSize);
      if (i != 6) {
        this.positions.push([3, i]);
        this.drawHexagon (canvasContext, basicHOffset + this.hexSize * 5.5, basicYOffset + this.hexSize * 1.5 + 17 + (i * hexSize * gridCoof), false, hexSize); 
      }
      if (i != 6 && i != 5) {
        this.positions.push([4, i]);
        this.drawHexagon (canvasContext, basicHOffset + this.hexSize * 7, basicYOffset + this.hexSize * 2.5 + 10 + (i * hexSize * gridCoof), false, hexSize); 
      }
    }
  }

  public drawHexagon (canvasContext, x, y, fill, hexSize) {
    this.centerCoordinatsX.push(x);
    this.centerCoordinatsY.push(y);
    canvasContext.beginPath();
    for (let side = 0; side < 7; side++) {
      this.cx.lineTo(x + hexSize * Math.cos(side * 2 * Math.PI / 6), y + hexSize * Math.sin(side * 2 * Math.PI / 6));
    }
    canvasContext.closePath();
    if (fill) { canvasContext.fill(); } else { canvasContext.stroke(); }
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
    return minIndex;
  }

  showOverlay(event) {

    var x = event.offsetX;
    var y = event.offsetY;

    if(this.currentIndex != -1) {
      this.level.setNode(this.positions[this.currentIndex][0], this.positions[this.currentIndex][1], new Node())
    }

    this.currentIndex = this.findClosestHexagon(x, y);
    this.redraw();

    // var x = e.clientX - this.cx.canvas.offsetLeft;
    // var y = e.clientY - this.cx.canvas.offsetTop;

    // this.drawHexagon(this.cx, this.centerCoordinatsX[index], this.centerCoordinatsY[index], true, this.hexSize);
    

    // this.centerCoordinatsX.sort(function(a, b) {
    //   a = (x - a);
    //   b = (x - b);
    //   if(a < b) return a;
    //   return b;
    // });
    // this.centerCoordinatsY.sort(function(a, b) {
    //   a = (y - a);
    //   b = (y - b);
    //   if(a < b) return a;
    //   return b;
    // });
    // //alert(minX + ' ' + minY);
    // const target = e.target;

  }



  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.levelCanvas.nativeElement;
    this.cx = canvasEl.getContext('2d');
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    this.redraw();
  }

  private drawTriangles(index: number) {
    this.cx.fillStyle = "red";

    let x = this.centerCoordinatsX[index];
    let y = this.centerCoordinatsY[index];
    let offset = 5;

    this.drawTriangle(x - this.hexSize / 2, y - this.hexSize, 
      x + this.hexSize / 2, y - this.hexSize, 
      x, y - this.hexSize * 1.5);
    
    this.drawTriangle(x - this.hexSize / 2, y + this.hexSize, 
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

  private drawCube(x: number, y: number) {

    let dark = "rgb(72, 69, 71)";
    let mid = "rgb(99, 106, 100";
    let light = "rgb(152, 150, 152)";

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
    if(this.currentPositions[3]) {
      this.cx.fillStyle = mid;
      this.drawQuadriateral(a5 ,b5, a6, b6, a6, y + height, a5, y + height);
      this.cx.fillStyle = dark;
      this.drawQuadriateral(a5, b5, a4, b4, a4, y + height, a5, y + height);
    }

    // right top
    if(this.currentPositions[1]) {
      this.cx.fillStyle = mid;
      this.drawQuadriateral(x ,y, a5, b5, mx[0], my[0], kx[0], ky[0]);
      this.cx.fillStyle = light;
      this.drawQuadriateral(x ,y, a3, b3, nx[0], ny[0], kx[0], ky[0]);
    }

    // left top
    if(this.currentPositions[5]) {
      this.cx.fillStyle = dark;
      this.drawQuadriateral(x ,y, a5, b5, mx[1], my[0], kx[1], ky[0]);
      this.cx.fillStyle = light;
      this.drawQuadriateral(x ,y, a1, b1, nx[1], ny[0], kx[1], ky[0]);
    }

    // top
    if(this.currentPositions[0]) {
      this.cx.fillStyle = mid;
      this.drawQuadriateral(a1, b1, a5, b5, a2, y - height, a1, y - height);
      this.cx.fillStyle = dark;
      this.drawQuadriateral(x, y, a3, b3, a3, y - height, a2, y - height);
    }

    // right bottom
    if(this.currentPositions[2]) {
      this.cx.fillStyle = light;
      this.drawQuadriateral(x ,y, a1, b1, mx[0], my[1], kx[0], ky[1]);
      this.cx.fillStyle = dark;
      this.drawQuadriateral(x ,y, a4, b4, nx[0], ny[1], kx[0], ky[1]);
    }

    // // left bottom
    if(this.currentPositions[4]) {
      this.cx.fillStyle = light;
      this.drawQuadriateral(x ,y, a3, b3, mx[1], my[1], kx[1], ky[1]);
      this.cx.fillStyle = mid;
      this.drawQuadriateral(x ,y, a5, b5, nx[1], ny[1], kx[1], ky[1]);
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
}

