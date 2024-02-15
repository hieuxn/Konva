import Konva from "konva";
import { Layer } from "konva/lib/Layer";
import { DimensionIndicatorBase } from "./dimension-indicator-base";

export class PolylineDimensionIndicator extends DimensionIndicatorBase {
    protected override drawDimensionsImplementation(layer: Layer, shape: Konva.Shape): void {
        if (!(shape instanceof Konva.Line)) return;
        this.drawPoints(layer, shape);
        const line = shape;
        layer.batchDraw();
        
        line.on('dragmove', () => {
            this.destroy();
            this.drawPoints(layer, shape);
            layer.batchDraw();
        })
    }

    private drawPoints(layer: Layer, line: Konva.Line) {
        const points = line.points();
        const position = line.position();
        const textArray: Konva.Text[] = [];
        for (let i = 0; i < points.length; i += 2) {
            const x = points[i] + position.x;
            const y = points[i + 1] + position.y;

            const point = new Konva.Circle({
                x: x,
                y: y,
                radius: 10,
                fill: 'black',
                draggable: true
            });
            point.on('mousedown', event => event.cancelBubble = true);
            point.on('dragmove', () => {
                points[i] = point.x() - position.x;
                points[i + 1] = point.y() - position.y;
                this.updatePolyline(layer, line, points, i, textArray);
            });

            layer.add(point);
            this.shapes.push(point);

            if (i >= 2) {
                const text = this.drawText(line, points, i - 2, i);
                layer.add(text);
                this.shapes.push(text);
                textArray.push(text);
            }
        }
        if (points.length % 2 == 0) {
            const text = this.drawText(line, points, points.length - 2, 0);
            layer.add(text);
            this.shapes.push(text);
            textArray.push(text);
        }
    }

    private drawText(line: Konva.Line, points: number[], lowerIndex: number, upperIndex: number): Konva.Text {
        const prevX = points[lowerIndex];
        const prevY = points[lowerIndex + 1];
        const x = points[upperIndex];
        const y = points[upperIndex + 1];
        const position = line.position();
        const text = new Konva.Text({
            x: (prevX + x) / 2 + position.x,
            y: (prevY + y) / 2 + position.y,
            text: `${Math.abs(Math.round(Math.sqrt(Math.pow(prevX - x, 2) + Math.pow(prevY - y, 2))))} px`,
            fontSize: 16,
            fontFamily: 'Arial',
            fill: 'black',
        });
        return text;
    }

    updatePolyline(layer: Layer, line: Konva.Line, points: number[], index: number, textArray: Konva.Text[]) {
        line.points(points);
        var lowerIndex = index / 2 - 1;
        var indices = [lowerIndex < 0 ? textArray.length - 1 : lowerIndex, lowerIndex + 1];
        indices.forEach(i => {
            textArray[i].destroy();
            const lower = i * 2;
            const upper = i * 2 + 2;
            textArray[i] = this.drawText(line, points, lower, upper >= points.length ? 0 : upper);
            layer.add(textArray[i]);
            this.shapes.push(textArray[i]);
        });
    }
}