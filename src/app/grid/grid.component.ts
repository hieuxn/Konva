import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import Konva from 'konva';
import { Subscription } from 'rxjs';
import { KonvaService } from '../services/konva.service';
import { MouseService } from '../services/mouse.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements AfterViewInit {
  @ViewChild('container', { static: true }) container!: ElementRef;

  private stage!: Konva.Stage;
  private layer!: Konva.Layer;
  private isDragging: boolean = false;
  private lastPointerPosition: { x: number; y: number } = { x: 0, y: 0 };
  private subscriptions: Subscription | null = null;

  constructor(private mouseService: MouseService, private konvaService: KonvaService) {

  }
  ngAfterViewInit(): void {
    this.layer = this.konvaService.GetLayer(0)!;
    this.stage = this.konvaService.GetStage();
    // this.stage.container = this.container.nativeElement;
    this.drawGrid();
    this.initMouseEvents();
    let scale = 1;
    this.stage.on('wheel', (e) => {
      e.evt.preventDefault();

      const oldScale = scale;
      const pointer = this.stage.getPointerPosition() ?? { x: 0, y: 0 };

      const delta = e.evt.deltaY;
      scale = Math.max(0.1, scale - delta * 0.001);

      this.stage.scale({ x: scale, y: scale });

      const newPos = {
        x: pointer.x - (pointer.x - this.stage.x()) * scale / oldScale,
        y: pointer.y - (pointer.y - this.stage.y()) * scale / oldScale
      };
      this.stage.position(newPos);

      this.layer.batchDraw();
    });
  }

  private drawGrid() {
    const gridSize = 50;
    const width = Math.ceil(window.innerWidth / 0.1);
    const height = Math.ceil(window.innerHeight / 0.1);

    // Draw horizontal lines
    for (let y = -height; y < height; y += gridSize) {
      const line = new Konva.Line({
        points: [-width, y, width, y],
        stroke: '#ddd',
        strokeWidth: 1
      });
      this.layer.add(line);
    }

    // Draw vertical lines
    for (let x = -width; x < width; x += gridSize) {
      const line = new Konva.Line({
        points: [x, -height, x, height],
        stroke: '#ddd',
        strokeWidth: 1
      });
      this.layer.add(line);
    }

    this.layer.draw();
  }

  private initMouseEvents() {
    this.subscriptions = new Subscription();
    this.subscriptions.add(this.mouseService.mouseDown$
      .subscribe((event: MouseEvent) => {
        this.handleMouseDown(event);
      }));

    this.subscriptions.add(this.mouseService.mouseUp$
      .subscribe((event: MouseEvent) => {
        this.handleMouseUp(event);
      }));
    this.subscriptions.add(this.mouseService.mouseMove$
      .subscribe((event: MouseEvent) => {
        this.handleMouseMove(event);
      }));
  }

  @HostListener('mousedown', ['$event'])
  handleMouseDown(event: MouseEvent) {
    if (event.button != 1) return;
    event.preventDefault();
    this.isDragging = true;
    this.lastPointerPosition = this.stage.getPointerPosition() ?? { x: 0, y: 0 };
  }

  @HostListener('mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const pointerPosition = this.stage.getPointerPosition() ?? { x: 0, y: 0 };
      const dx = pointerPosition.x - this.lastPointerPosition.x;
      const dy = pointerPosition.y - this.lastPointerPosition.y;

      this.stage.x(this.stage.x() + dx);
      this.stage.y(this.stage.y() + dy);

      this.lastPointerPosition = pointerPosition;
      this.stage.batchDraw();
    }
  }

  @HostListener('mouseup')
  handleMouseUp(event: MouseEvent) {
    this.isDragging = false;
  }
}
