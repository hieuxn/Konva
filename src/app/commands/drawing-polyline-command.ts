import { Injectable } from "@angular/core";
import Konva from "konva";
import { DrawingCommand, MouseLocation } from "./drawing-command";
@Injectable({
    providedIn: "root"
})

export class DrawingPolyLineCommand extends DrawingCommand {
    public override name: string = "Draw Polyline";
    private static readonly SnappingDistance: number = 10; // px
    private isDrawingFinished: boolean = false;
    private arePointsEqual(point1: MouseLocation, point2: MouseLocation, tolerance: number): boolean {
        return Math.abs(point1.x - point2.x) < tolerance && Math.abs(point1.y - point2.y) < tolerance;
    }
    protected override isFinished(mouseLocations: MouseLocation[]): boolean {
        return this.isDrawingFinished = mouseLocations.length >= 2
            && this.arePointsEqual(mouseLocations[mouseLocations.length - 1], mouseLocations[0], DrawingPolyLineCommand.SnappingDistance);
    }
    protected override drawShapeImplementation(mouseLocations: MouseLocation[]): Konva.Shape | null {
        if (mouseLocations.length < 2) return null;
        // to snap final point to first point
        if (this.isDrawingFinished) {
            mouseLocations.length = mouseLocations.length - 1;
            // mouseLocations[mouseLocations.length - 1] = mouseLocations[0];
        }
        const points = mouseLocations.flatMap(point => [point.x, point.y]);
        const polyline = new Konva.Line({
            points: points,
            stroke: 'lightblue',
            draggable: true,
            lineJoin: 'round',
            strokeWidth: 4,
            closed: this.isDrawingFinished
        });
        this.layer.add(polyline);
        if (this.isDrawingFinished) {
            polyline.on("mousedown", event => {
                event.cancelBubble = true;
                this.dimensionIndicator.drawDimensions(this.layer, polyline);
            });
        }
        return polyline;
    }
}