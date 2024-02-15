import Konva from 'konva';
import { ShapesProvider } from './dimension-indicator';

export abstract class DimensionIndicatorBase {
    protected shapes: Konva.Shape[];
    constructor(shapesProvider: ShapesProvider) {
        this.shapes = shapesProvider.getShape();
    }

    public drawDimensions(layer: Konva.Layer, shape: Konva.Shape) {
        this.destroy();
        this.drawDimensionsImplementation(layer, shape);
    }

    public destroy(): void {
        this.shapes.forEach(shape => shape.destroy())
    }

    protected abstract drawDimensionsImplementation(layer: Konva.Layer, shape: Konva.Shape): void;
}
