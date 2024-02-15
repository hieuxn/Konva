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
    private shiftPressing: boolean = false;

    protected override onKeyDown(event: KeyboardEvent) {
        this.shiftPressing = event.key == 'Shift';
    }

    protected override onKeyUp(event: KeyboardEvent) {
        this.shiftPressing = this.shiftPressing && !(event.key == 'Shift');
    }

    private arePointsEqual(point1: MouseLocation, point2: MouseLocation, tolerance: number): boolean {
        return Math.abs(point1.x - point2.x) < tolerance && Math.abs(point1.y - point2.y) < tolerance;
    }

    protected override isFinished(mouseLocations: MouseLocation[]): boolean {
        return this.isDrawingFinished = mouseLocations.length >= 2
            && this.arePointsEqual(mouseLocations[mouseLocations.length - 1], mouseLocations[0], DrawingPolyLineCommand.SnappingDistance);
    }

    protected override drawShapeImplementation(mouseLocations: MouseLocation[]): Konva.Shape | null {
        if (mouseLocations.length < 2) return null;
        if (this.isDrawingFinished) {
            // to snap final point to first point
            mouseLocations.length = mouseLocations.length - 1;
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

    protected override onMouseClick(mouseLocation: MouseLocation): void {
        if (this.shiftPressing && this.mouseLocations.length > 1) {
            const lastPoint = this.mouseLocations[this.mouseLocations.length - 2];
            mouseLocation = this.enforceSnapping(lastPoint, mouseLocation);
        }
        super.onMouseClick(mouseLocation);
    }

    protected override onMouseMove(mouseLocation: MouseLocation): void {
        if (this.shiftPressing && this.mouseLocations.length > 1) {
            const lastPoint = this.mouseLocations[this.mouseLocations.length - 2];
            mouseLocation = this.enforceSnapping(lastPoint, mouseLocation);
        }
        super.onMouseMove(mouseLocation);
    }

    private enforceSnapping(lastPoint: MouseLocation, currentPosition: MouseLocation): MouseLocation {
        const angleTolerance = 10;
        const angle = this.calculateAngle(lastPoint, currentPosition);

        let targetAngle;
        if (angle >= -angleTolerance && angle <= angleTolerance) {
            targetAngle = 0;
        } else if (angle >= 90 - angleTolerance && angle <= 90 + angleTolerance) {
            targetAngle = 90;
        } else if (angle >= 180 - angleTolerance && angle <= 180 + angleTolerance) {
            targetAngle = 180;
        } else if (angle >= -90 - angleTolerance && angle <= -90 + angleTolerance) {
            targetAngle = -90;
        }

        if (targetAngle !== undefined) {
            const distance = Math.sqrt(Math.pow(lastPoint.x - currentPosition.x, 2) + Math.pow(lastPoint.y - currentPosition.y, 2));
            const snapDelta = this.calculateSnapDelta(angle, targetAngle, distance);
            currentPosition.x = lastPoint.x + snapDelta.x;
            currentPosition.y = lastPoint.y + snapDelta.y;
        }

        return currentPosition;
    }

    private calculateAngle(point1: MouseLocation, point2: MouseLocation): number {
        return (Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180) / Math.PI;
    }

    private calculateSnapDelta(angle: number, targetAngle: number, distance: number): MouseLocation {
        const snapAngleRad = (targetAngle * Math.PI) / 180;
        return {
            x: Math.cos(snapAngleRad) * distance,
            y: Math.sin(snapAngleRad) * distance
        };
    }
}