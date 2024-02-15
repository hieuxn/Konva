import { AfterViewInit, Component, HostListener } from '@angular/core';
import Konva from 'konva';
import { KonvaLayerService } from '../services/konva-layer.service';
import { KonvaMouseService } from '../services/konva-mouse.service';

@Component({
  selector: 'app-konva',
  standalone: true,
  imports: [],
  templateUrl: './konva.component.html',
  styleUrl: './konva.component.scss',
})

export class KonvaComponent implements AfterViewInit {
  private layer!: Konva.Layer;
  private static number: number = 0;
  public ngAfterViewInit() {
    const stage = new Konva.Stage({
      container: 'konva-container',
      width: window.innerWidth,
      height: window.innerHeight,
    });

    this.layer = new Konva.Layer();
    stage.add(this.layer);
    this.konvaService.InjectStage(stage);
    this.konvaService.InjectLayer(this.layer);
  }

  constructor(private mouseService: KonvaMouseService, private konvaService: KonvaLayerService) {
  }

  @HostListener('mousedown', ['$event'])
  public handleMouseDown(event: MouseEvent) {
    this.mouseService.handleMouseDown(event);
  }

  @HostListener('mouseup', ['$event'])
  public handleMouseUp(event: MouseEvent) {
    this.mouseService.handleMouseUp(event);
  }

  @HostListener('mousemove', ['$event'])
  public handleMouseMove(event: MouseEvent) {
    this.mouseService.handleMouseMove(event);
  }
}