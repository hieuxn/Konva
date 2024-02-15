import { Injectable } from '@angular/core';
import Konva from 'konva';
import { Subscription } from 'rxjs';
import { DimensionIndicator } from '../dimensionIndicators/dimension-indicator';
import { KonvaLayerService } from '../services/konva-layer.service';
import { KonvaMouseService } from '../services/konva-mouse.service';
export interface MouseLocation {
    x: number,
    y: number
}

@Injectable({
    providedIn: "root"
})

export abstract class DrawingCommand {
    public abstract name: string;
    protected layer!: Konva.Layer;
    protected drawOnMouseDown: boolean = true;
    private shape: Konva.Shape | null = null;
    private subscriptions: Subscription | null = null;
    private mouseLocations: MouseLocation[] = [];
    private mouseUpCount: number = 0;

    constructor(private mouseService: KonvaMouseService, private konvaService: KonvaLayerService, protected dimensionIndicator: DimensionIndicator) { }

    public execute() {
        const layer = this.konvaService.GetLayer(0);
        if (!layer) return;
        this.layer = layer;
        this.initMouseEvents();
    }

    public cancel() {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe()
            this.subscriptions = null;
            this.shape = null;
            this.mouseUpCount = 0;
            this.mouseLocations.length = 0;
        }
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

    private handleMouseDown(event: MouseEvent) {
        if (!this.drawOnMouseDown) return;
        const pointerPosition = this.layer.getRelativePointerPosition();
        if (!pointerPosition) return;

        this.handleMouseClick(pointerPosition);
    }

    private handleMouseUp(event: MouseEvent) {
        if (this.drawOnMouseDown) return;
        const pointerPosition = this.layer.getRelativePointerPosition();
        if (!pointerPosition) return;

        this.handleMouseClick(pointerPosition);
    }

    private handleMouseMove(event: MouseEvent) {
        const pointerPosition = this.layer.getRelativePointerPosition();
        if (!pointerPosition) return;

        this.handleMouseMovement(pointerPosition);
    }

    private handleMouseClick(mouseLocation: MouseLocation) {
        if (this.mouseLocations.length > 0) this.mouseLocations[this.mouseLocations.length - 1] = mouseLocation;
        else this.mouseLocations.push(mouseLocation);
        ++this.mouseUpCount;

        const isFinished = this.isFinished(this.mouseLocations);
        if (this.mouseLocations.length > 0) this.drawShape();
        if (!isFinished) return;

        this.cancel();
    }

    private handleMouseMovement(mouseLocation: MouseLocation) {
        if (this.mouseLocations.length == 0) return;
        if (this.mouseUpCount == this.mouseLocations.length) this.mouseLocations.push(mouseLocation);
        else if (this.mouseUpCount + 1 == this.mouseLocations.length) this.mouseLocations[this.mouseLocations.length - 1] = mouseLocation;
        if (this.mouseLocations.length > 0) this.drawShape();
    }

    private drawShape() {
        if (this.shape) this.shape.destroy();

        this.shape = this.drawShapeImplementation(this.mouseLocations)
        if (!this.shape) return;

        this.layer.draw();
    }

    protected abstract isFinished(mouseLocations: MouseLocation[]): boolean;
    protected abstract drawShapeImplementation(mouseLocations: MouseLocation[]): Konva.Shape | null
}
