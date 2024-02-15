import { Component, Injector } from '@angular/core';
import { DrawingCommand } from '../commands/drawing-command';
import { DrawingEllipseCommand } from '../commands/drawing-ellipse-command';
import { DrawingPolyLineCommand } from '../commands/drawing-polyline-command';
import { DrawingRectangleCommand } from '../commands/drawing-rectangle-command';


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
  public commands!: DrawingCommand[];
  private currentCommand: DrawingCommand | null = null;
  constructor(injector: Injector) {
    const rectangle = injector.get(DrawingRectangleCommand);
    const ellipse = injector.get(DrawingEllipseCommand);
    const polyline = injector.get(DrawingPolyLineCommand);
    this.commands = [rectangle, ellipse, polyline];
  }

  public execute(drawingCommand: DrawingCommand) {
    this.currentCommand?.cancel();
    drawingCommand.execute();
    this.currentCommand = drawingCommand;
  }
}