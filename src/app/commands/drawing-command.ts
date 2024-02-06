import Konva from 'konva';
import { Subscription } from 'rxjs';
import { DimensionIndicator } from '../classes/dimension-indicator';
import { KonvaService } from '../services/konva.service';
import { MouseService } from '../services/mouse.service';

export abstract class DrawingCommand {
    protected layer!: Konva.Layer;
    private startX: number = 0;
    private startY: number = 0;
    private endX: number = 0;
    private endY: number = 0;
    private shape: Konva.Shape | null = null;
    private isDrawing: boolean = false;
    private allowToDraw: boolean = false;
    public abstract name: string;
    private subscriptions: Subscription | null = null;

    constructor(protected dimensionIndicator: DimensionIndicator, private mouseService: MouseService, private konvaService: KonvaService) { }

    execute() {
        const layer = this.konvaService.GetLayer(0);
        if (!layer) return;
        this.layer = layer;
        this.allowToDraw = true;
        this.initMouseEvents();
    }

    startDrawing(startX: number, startY: number) {
        this.startX = startX;
        this.startY = startY;
    }

    continueDrawing(endX: number, endY: number) {
        this.endX = endX;
        this.endY = endY;
        this.drawshape();
    }

    private drawshape() {
        if (this.shape) {
            this.shape.destroy();
        }

        this.shape = this.drawShape(this.startX, this.endX, this.startY, this.endY)
        if (!this.shape) return;

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

    private handleMouseDown(event: MouseEvent) {
        if (!this.allowToDraw) return;
        this.isDrawing = true;
        const pointerPosition = this.layer.getRelativePointerPosition() ?? { x: 0, y: 0 };
        const { x: startX, y: startY } = pointerPosition;
        this.onMouseDown(startX, startY);
    }

    private handleMouseUp(event: MouseEvent) {
        if (!this.isDrawing) return;
        const pointerPosition = this.layer.getRelativePointerPosition() ?? { x: 0, y: 0 };
        const { x: endX, y: endY } = pointerPosition;
        this.onMouseUp(endX, endY);
        this.isDrawing = false;
        this.allowToDraw = false;
        if (this.subscriptions) {
            this.subscriptions.unsubscribe()
            this.subscriptions = null;
        }
    }

    private handleMouseMove(event: MouseEvent) {
        if (!this.isDrawing) {
            this.shape = null;
            return;
        }
        const pointerPosition = this.layer.getRelativePointerPosition() ?? { x: 0, y: 0 };
        const { x: endX, y: endY } = pointerPosition;
        this.onMouseMove(endX, endY);
    }

    protected onMouseDown(startX: number, startY: number) {
        this.startDrawing(startX, startY);
    }

    protected onMouseUp(endX: number, endY: number) {
        this.continueDrawing(endX, endY);
    }

    protected onMouseMove(endX: number, endY: number) {
        this.continueDrawing(endX, endY);
    }

    protected abstract drawShape(startX: number, endX: number, startY: number, endY: number): Konva.Shape | null
}
