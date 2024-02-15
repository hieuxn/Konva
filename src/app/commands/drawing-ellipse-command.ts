import { Injectable } from "@angular/core";
import Konva from "konva";
import { DrawingCommand, MouseLocation } from "./drawing-command";
@Injectable({
    providedIn: "root"
})

export class DrawingEllipseCommand extends DrawingCommand {
    public override name: string = "Draw Ellipse";
    protected override isFinished(mouseLocations: MouseLocation[]): boolean {
        return mouseLocations.length >= 2;
    }
    protected override drawShapeImplementation(mouseLocations: MouseLocation[]): Konva.Shape | null {
        if (mouseLocations.length < 2) return null;
        const [{ x: startX, y: startY }, { x: endX, y: endY }] = mouseLocations;
        const ellipse = new Konva.Ellipse({
            x: (startX + endX) / 2,
            y: (startY + endY) / 2,
            radiusX: Math.abs((endX - startX) / 2),
            radiusY: Math.abs((endY - startY) / 2),
            fill: 'lightblue',
            draggable: true,
            strokeWidth: 2,
        });
        this.layer.add(ellipse);
        ellipse.on("mousedown", event => {
            event.cancelBubble = true;
            this.dimensionIndicator.drawDimensions(this.layer, ellipse);
        });
        return ellipse;
    }
}