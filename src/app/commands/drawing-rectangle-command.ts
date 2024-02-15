import { Injectable } from "@angular/core";
import { default as Konva } from "konva";
import { DrawingCommand, MouseLocation } from "./drawing-command";
@Injectable({
    providedIn: "root"
})

export class DrawingRectangleCommand extends DrawingCommand {
    public override name: string = "Draw Rectangle";
    protected override isFinished(mouseLocations: MouseLocation[]): boolean {
        return mouseLocations.length >= 2;
    }
    protected override drawShapeImplementation(mouseLocations: MouseLocation[]): Konva.Shape | null {
        if (mouseLocations.length < 2) return null;
        const [{ x: startX, y: startY }, { x: endX, y: endY }] = mouseLocations;
        const rect = new Konva.Rect({
            x: startX,
            y: startY,
            width: endX - startX,
            height: endY - startY,
            fill: 'lightblue',
            draggable: true,
            strokeWidth: 2,
        });
        this.layer.add(rect);
        rect.on("mousedown", event => {
            event.cancelBubble = true;
            this.dimensionIndicator.drawDimensions(this.layer, rect);
        });
        return rect;
    }
}
