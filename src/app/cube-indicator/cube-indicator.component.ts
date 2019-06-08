import { Component, OnInit, ViewChild, ElementRef, HostBinding } from '@angular/core';
import { BoardService } from '../services/board.service';
import { Subscription } from 'rxjs';
import { Position } from '../position';
import { TopService } from '../services/top.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cube-indicator',
  templateUrl: './cube-indicator.component.html',
  styleUrls: ['./cube-indicator.component.css']
})
export class CubeIndicatorComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  private cx: CanvasRenderingContext2D;
  private currentPosition: [number, number];
  @ViewChild('canvas') private canvas: ElementRef;
  @HostBinding("hidden") private isHidden = true;

  public directionsAvailable: boolean[] = [];

  constructor(private _topService: TopService, private _boardService: BoardService, private _router: Router) { }

  ngOnInit() {
    this._topService.levelEditionInrocessChange.next(true);

    this.subscriptions.push(this._boardService.notifyClicked.subscribe(value => {
      if(! this._boardService.nodeExists(value[0], value[1])) {
        this.isHidden = true;
      }
      else {
        this.directionsAvailable = this._boardService.level.getNode(value[0], value[1]).positions;
        this.isHidden = false;
        this.currentPosition = [value[0], value[1]];
        this.redraw();
      }
    }))
    this.subscriptions.push(this._boardService.notifyClickedOutOfBoard.subscribe(value => {
      this.isHidden = true;
    }))

    this._topService.nextClicked.subscribe(value => {
      if(this._boardService.level.current) {
        this._router.navigateByUrl("/endpoint");
      }
    })
  }

  ngAfterViewInit() {
    this.canvas.nativeElement.width = window.innerWidth;
    this.cx = this.canvas.nativeElement.getContext("2d");
    this.redraw();
  }

  ngOnDestroy() {
    for(let subscription of this.subscriptions) subscription.unsubscribe();
  }

  setCurrent(event) {
    let index = this.findClosestHexagon(event.offsetX, event.offsetY);
    if(! this.directionsAvailable[index]) {
      this._boardService.level.current = new Position(this.currentPosition[0] ,this.currentPosition[1], index);
      this._boardService.setNeedsDisplay();
    }
  }

  public redraw() {
    this.cx.clearRect(0 ,0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.drawHexagons();
  }

  private hexSize = 70;
  private coordinateX: number[] = [];
  private coordinateY: number[] = [];

  public drawHexagons() {
    let hexDistance = 110;
    let xOffset = (window.innerWidth - hexDistance * 6 - this.hexSize * 6) / 2 + this.hexSize / 2;
    let yOffset =  75;
    for(let i=0;i<6;i++) {
      if(! this.directionsAvailable[i]) {
        this.drawHexagon(this.cx, xOffset + i * (this.hexSize + hexDistance), yOffset, this.hexSize);
        this.drawNode(this.coordinateX[i], this.coordinateY[i], [false, false, false, false, false, false], i + 1);
      }
    }
  }

  public drawHexagon (canvasContext, x, y, hexSize) {
    if(this.coordinateX.length < 6) {
      this.coordinateX.push(x);
      this.coordinateY.push(y);
    }

    canvasContext.beginPath();
    for (let side = 0; side < 7; side++) {
      this.cx.lineTo(x + hexSize * Math.cos(side * 2 * Math.PI / 6), y + hexSize * Math.sin(side * 2 * Math.PI / 6));
    }
    canvasContext.closePath();

    this.cx.fillStyle = "white";
    this.cx.fill();
  }

  private drawNode(x: number, y: number, connections: boolean[], cube) {

    let dark = cube == undefined ? "rgb(139, 5, 1)" : "rgb(72, 69, 71)";
    let mid = cube == undefined ? "rgb(190, 0, 3)" : "rgb(101,101,101";
    let light =  cube == undefined ? "rgb(245, 5, 1)"  :"rgb(152, 150, 152)";


    let height = (this.hexSize / 2) * Math.sqrt(3);

    let m = height / 2.2;

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

    if(cube == 4) {
      this.drawNode(x, y + m, [false, false, false, false, false, false], undefined);
    }
    if(cube == 2) {
      this.drawNode(a1, b1, [false, false, false, false, false, false], undefined);
    }
    if(cube == 6) {
      this.drawNode(a3, b3, [false, false, false, false, false, false], undefined);
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
    // top
    if(connections[0]) {
      this.cx.fillStyle = mid;
      this.drawQuadriateral(a1, b1, a5, b5, a2, y - height, a1, y - height);
      this.cx.fillStyle = dark;
      this.drawQuadriateral(x, y, a3, b3, a3, y - height, a2, y - height);
    }
    // right bottom
    if(connections[2]) {
      this.cx.fillStyle = light;
      this.drawQuadriateral(x ,y, a1, b1, mx[0], my[1], kx[0], ky[1]);
      this.cx.fillStyle = dark;
      this.drawQuadriateral(x ,y, a4, b4, nx[0], ny[1], kx[0], ky[1]);
    }
    // // left bottom
    if(connections[4]) {
      this.cx.fillStyle = light;
      this.drawQuadriateral(x ,y, a3, b3, mx[1], my[1], kx[1], ky[1]);
      this.cx.fillStyle = mid;
      this.drawQuadriateral(x ,y, a5, b5, nx[1], ny[1], kx[1], ky[1]);
    }

    if(cube == 1) {
      this.drawNode(x, y - m, [false, false, false, false, false, false], undefined);
    }
    if(cube == 3) {
      this.drawNode(a6, b6, [false, false, false, false, false, false], undefined);
    }
    if(cube == 5) {
      this.drawNode(a4, b4, [false, false, false, false, false, false], undefined);
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

  private findClosestHexagon(x: number, y: number): number {
    let minDistance = 100000;
    let minIndex = 1100000;
    for(let i=0;i<this.coordinateX.length;i++) {
      let distance = Math.sqrt((x - this.coordinateX[i]) ** 2 + (y - this.coordinateY[i]) ** 2);
      if(distance < minDistance) {
        minDistance = distance;
        minIndex = i;
      }
    }
    return minIndex;
  }

}
