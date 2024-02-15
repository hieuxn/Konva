import { Injectable } from '@angular/core';
import Konva from 'konva';
import { Subscription } from 'rxjs';
import { DimensionIndicator } from '../dimensionIndicators/dimension-indicator';
import { KonvaKeyboardService } from '../services/konva-keyboard.service';
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
    protected mouseLocations: MouseLocation[] = [];
    protected subscriptions: Subscription | null = null;
    private shape: Konva.Shape | null = null;
    private mouseUpCount: number = 0;

    constructor(
        private mouseService: KonvaMouseService,
        private keyboardService: KonvaKeyboardService,
        private konvaService: KonvaLayerService,
        protected dimensionIndicator: DimensionIndicator) { }

    public execute() {
        const layer = this.konvaService.GetLayer(0);
        if (!layer) return;
        this.layer = layer;
        this.initEvents();
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

    protected onKeyDown(event: KeyboardEvent) {
    }

    protected onKeyUp(event: KeyboardEvent) {
    }

    protected onMouseClick(mouseLocation: MouseLocation) {
        if (this.mouseLocations.length > 0) this.mouseLocations[this.mouseLocations.length - 1] = mouseLocation;
        else this.mouseLocations.push(mouseLocation);
        ++this.mouseUpCount;

        const isFinished = this.isFinished(this.mouseLocations);
        if (this.mouseLocations.length > 0) this.drawShape();
        if (!isFinished) return;

        this.cancel();
    }

    protected onMouseMove(mouseLocation: MouseLocation) {
        if (this.mouseLocations.length == 0) return;
        if (this.mouseUpCount == this.mouseLocations.length) this.mouseLocations.push(mouseLocation);
        else if (this.mouseUpCount + 1 == this.mouseLocations.length) this.mouseLocations[this.mouseLocations.length - 1] = mouseLocation;
        if (this.mouseLocations.length > 0) this.drawShape();
    }

    protected abstract isFinished(mouseLocations: MouseLocation[]): boolean;

    protected abstract drawShapeImplementation(mouseLocations: MouseLocation[]): Konva.Shape | null;

    private initEvents() {
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

        this.subscriptions.add(this.keyboardService.keyDown$
            .subscribe((event: KeyboardEvent) => {
                this.onKeyDown(event);
            }));

        this.subscriptions.add(this.keyboardService.keyUp$
            .subscribe((event: KeyboardEvent) => {
                this.onKeyUp(event);
            }));
    }

    private handleMouseDown(event: MouseEvent) {
        if (!this.drawOnMouseDown) return;
        const pointerPosition = this.layer.getRelativePointerPosition();
        if (!pointerPosition) return;

        this.onMouseClick(pointerPosition);
    }

    private handleMouseUp(event: MouseEvent) {
        if (this.drawOnMouseDown) return;
        const pointerPosition = this.layer.getRelativePointerPosition();
        if (!pointerPosition) return;

        this.onMouseClick(pointerPosition);
    }

    private handleMouseMove(event: MouseEvent) {
        const pointerPosition = this.layer.getRelativePointerPosition();
        if (!pointerPosition) return;

        this.onMouseMove(pointerPosition);
    }

    private drawShape() {
        if (this.shape) this.shape.destroy();

        this.shape = this.drawShapeImplementation(this.mouseLocations)
        if (!this.shape) return;

        this.layer.draw();
    }
}
