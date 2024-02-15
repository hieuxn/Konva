import { Injectable } from "@angular/core";
import Konva from "konva";
import { DimensionIndicatorBase } from "./dimension-indicator-base";
import { EllipseDimensionIndicator } from "./ellipse-dimension-indicator";
import { PolylineDimensionIndicator } from "./polyline-dimension-indicator";
import { RectangleDimensionIndicator } from "./rectangle-dimension-indicator";

export interface ShapesProvider {
    getShape(): Konva.Shape[]
}

@Injectable({
    providedIn: 'root'
})
export class DimensionIndicator implements ShapesProvider {
    private readonly shapes: Konva.Shape[] = [];
    private dimensionMap: Map<string, DimensionIndicatorBase> = new Map<string, DimensionIndicatorBase>([
        [Konva.Rect.name, new RectangleDimensionIndicator(this)],
        [Konva.Ellipse.name, new EllipseDimensionIndicator(this)],
        [Konva.Line.name, new PolylineDimensionIndicator(this)],
    ]);
    public constructor() {
    }

    public getShape(): Konva.Shape[] {
        return this.shapes;
    }

    public inject(dimensionIndicator: DimensionIndicatorBase) {
        this.dimensionMap.set(typeof dimensionIndicator, dimensionIndicator);
    }

    public drawDimensions(layer: Konva.Layer, shape: Konva.Shape) {
        const instance = this.dimensionMap.get(shape.constructor.name);
        if (!instance) return;
        this.destroy();
        instance.drawDimensions(layer, shape);
    }

    public destroy() {
        this.shapes.forEach(shape => shape.destroy())
    }
}