import { Injectable } from '@angular/core';
import Konva from 'konva';

@Injectable({
    providedIn: 'root'
})
export class DimensionIndicator {
    private shapes: Konva.Shape[] = [];
    public drawDimensions(layer: Konva.Layer, shape: Konva.Shape) {
        this.destroy();
        this.drawDimensionsImplementation(layer, shape);
    }

    public destroy() {
        this.shapes.forEach(shape => shape.destroy())
    }

    private drawDimensionsImplementation(layer: Konva.Layer, shape: Konva.Shape): void {
        if (!(shape instanceof Konva.Rect) && !(shape instanceof Konva.Ellipse)) return;

        this.drawWidthDimensionLine(layer, shape);
        this.drawHeightDimensionLine(layer, shape);
    }

    private drawWidthDimensionLine(layer: Konva.Layer, shape: Konva.Shape): void {
        if (!(shape instanceof Konva.Rect) && !(shape instanceof Konva.Ellipse)) return;

        const radius = 10;
        let width = shape.width();
        let height = shape.height();
        let x = shape.x();
        let y = shape.y();
        let arrow1X = 0;
        let arrow2X = 0;

        if (shape instanceof Konva.Ellipse) width /= 2;
        else if (height > 0) y = y + height;
        if (width < 0) {
            width *= 1;
            arrow1X = x - radius;
            arrow2X = x + width + radius;
        }
        else {
            arrow1X = x + width - radius;
            arrow2X = x + radius;
        }

        const line = new Konva.Line({
            points: [x, y, x + width, y],
            stroke: 'black',
            strokeWidth: 2,
        });
        const arrow1 = new Konva.RegularPolygon({
            x: arrow1X,
            y: y,
            sides: 3,
            radius: radius,
            fill: 'black',
            rotation: 90,
            draggable: true
        });

        const arrow2 = new Konva.RegularPolygon({
            x: arrow2X,
            y: y,
            sides: 3,
            radius: radius,
            fill: 'black',
            rotation: -90,
        });

        const text = new Konva.Text({
            x: x + width / 2,
            y: y - 20,
            text: `${Math.abs(Math.round(width))}px`,
            fontSize: 16,
            fontFamily: 'Arial',
            fill: 'black',
        });

        layer.add(line);
        layer.add(arrow1);
        layer.add(arrow2);
        layer.add(text);

        shape.on('dragmove', () => {
            this.updateWidthDimensionPositions(layer, shape, line, arrow1, arrow2, text);
        });
        arrow1.on('dragmove', event => {
            const y = arrow2.y();
            const xLeft = arrow2.x();
            let xRight = arrow1.x()
            if (xLeft - 2 * radius > xRight) {
                xRight = xLeft - 2 * radius;
            }
            let width = xRight - xLeft + 2 * radius;
            if (shape instanceof Konva.Ellipse) width *= 2;

            arrow1.x(xRight);
            arrow1.y(y)
            line.points([xLeft, y, xRight, y]);
            text.x((xLeft + xRight) / 2);

            shape.x(xLeft - radius);
            shape.width(width);
            text.text(`${Math.abs(Math.round(width))}px`);
            layer.batchDraw();
        });
        this.shapes.push(line, arrow1, arrow2, text);
    }

    private drawHeightDimensionLine(layer: Konva.Layer, shape: Konva.Shape): void {
        if (!(shape instanceof Konva.Rect) && !(shape instanceof Konva.Ellipse)) return;

        const radius = 10;
        let width = shape.width();
        let height = shape.height();
        let x = shape.x();
        let y = shape.y();

        if (shape instanceof Konva.Ellipse) height /= -2;

        if (height < 0) {
            y += height;
            height *= -1;
        }
        if (width < 0) {
            x += width;
        }

        const arrow1Y = y + height - radius;
        const arrow2Y = y + radius;

        const line = new Konva.Line({
            points: [x, y, x, y + height],
            stroke: 'black',
            strokeWidth: 2,
        });
        const arrow1 = new Konva.RegularPolygon({
            x: x,
            y: arrow1Y,
            sides: 3,
            radius: radius,
            fill: 'black',
            rotation: 180,
        });

        const arrow2 = new Konva.RegularPolygon({
            x: x,
            y: arrow2Y,
            sides: 3,
            radius: radius,
            fill: 'black',
            draggable: true
        });

        const text = new Konva.Text({
            x: x + 10,
            y: y + height / 2,
            text: `${Math.abs(Math.round(height))}px`,
            fontSize: 16,
            fontFamily: 'Arial',
            fill: 'black',
        });

        layer.add(line);
        layer.add(arrow1);
        layer.add(arrow2);
        layer.add(text);

        shape.on('dragmove', () => {
            this.updateHeightDimensionPositions(layer, shape, line, arrow1, arrow2, text);
        });

        arrow2.on('dragmove', event => {
            const x = arrow1.x();
            let height = shape.height();
            let yBottom = height + shape.y();
            let yTop = arrow2.y();
            if (shape instanceof Konva.Ellipse || height < 0) {
                yBottom = shape.y();
            }
            if (yTop > yBottom) {
                yTop = yBottom;
            }
            height = yBottom - yTop;
            arrow2.x(x);
            arrow2.y(yTop + radius)
            line.points([x, yTop, x, yBottom]);
            text.y((yTop + yBottom) / 2);

            if (shape instanceof Konva.Ellipse || height < 0) {
                shape.height(height * 2);
            }
            else {
                shape.y(yTop);
                shape.height(height);
            }

            text.text(`${Math.abs(Math.round(height))}px`);
            layer.batchDraw();
        });
        this.shapes.push(line, arrow1, arrow2, text);
    }

    private updateWidthDimensionPositions(layer: Konva.Layer, shape: any, line: Konva.Line, arrow1: Konva.RegularPolygon, arrow2: Konva.RegularPolygon, text: Konva.Text): void {
        const radius = 10;
        let width = shape.width();
        let height = shape.height();
        let x = shape.x();
        let y = shape.y();

        if (shape instanceof Konva.Ellipse) width /= 2;
        else if (height > 0) y = y + height;
        if (width < 0) {
            width *= 1;
            arrow1.position({ x: x - radius, y: y });
            arrow2.position({ x: x + width + radius, y: y });
        }
        else {
            arrow1.position({ x: x + width - radius, y: y });
            arrow2.position({ x: x + radius, y: y });
        }

        line.points([x, y, x + width, y]);
        text.position({ x: x + width / 2, y: y - 20 });

        layer.batchDraw();
    }

    private updateHeightDimensionPositions(layer: Konva.Layer, shape: any, line: Konva.Line, arrow1: Konva.RegularPolygon, arrow2: Konva.RegularPolygon, text: Konva.Text): void {
        const radius = 10;
        let width = shape.width();
        let height = shape.height();
        let x = shape.x();
        let y = shape.y();

        if (shape instanceof Konva.Ellipse) height /= -2;

        if (height < 0) {
            y += height;
            height *= -1;
        }
        if (width < 0) {
            x += width;
        }

        const arrow1Y = y + height - radius;
        const arrow2Y = y + radius;
        arrow1.position({ x: x, y: arrow1Y });
        arrow2.position({ x: x, y: arrow2Y });
        line.points([x, y, x, y + height]);
        text.position({ x: x + 10, y: y + height / 2 });

        layer.batchDraw();
    }
}
