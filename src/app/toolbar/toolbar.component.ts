import { Component } from '@angular/core';
import { DimensionIndicator } from '../classes/dimension-indicator';
import { DrawingCommand } from '../commands/drawing-command';
import { DrawingEllipseCommand } from '../commands/drawing-ellipse-command';
import { DrawingRectangleCommand } from '../commands/drawing-rectangle-command';
import { KonvaService } from '../services/konva.service';
import { MouseService } from '../services/mouse.service';


@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})

export class ToolbarComponent {
  // @Output() drawShape = new EventEmitter<string>();

  // selectShape(shape: string): void {
  //   this.drawShape.emit(shape);
  // }
  commands!: DrawingCommand[];
  constructor(private dimensionIndicator: DimensionIndicator, private mouseService: MouseService, private konvaService: KonvaService) {
    const rectangle = new DrawingRectangleCommand(dimensionIndicator, mouseService, konvaService);
    const ellipse = new DrawingEllipseCommand(dimensionIndicator, mouseService, konvaService);
    this.commands = [rectangle, ellipse];
  }
}