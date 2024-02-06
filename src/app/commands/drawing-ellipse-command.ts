import Konva from "konva";
import { DrawingCommand } from "./drawing-command";

export class DrawingEllipseCommand extends DrawingCommand {
    public override name: string = "Draw Ellipse";
    protected override drawShape(startX: number, endX: number, startY: number, endY: number): Konva.Shape | null {
        const ellipse = new Konva.Ellipse({
            x: (startX + endX) / 2,
            y: (startY + endY) / 2,
            radiusX: Math.abs((endX - startX) / 2),
            radiusY: Math.abs((endY - startY) / 2),
            fill: 'lightblue',
            draggable: true,
            strokeWidth: 2,
        });
        this.layer.add(ellipse);
        ellipse.on("mousedown", event => {
            event.cancelBubble = true;
            this.dimensionIndicator.drawDimensions(this.layer, ellipse);
        });
        return ellipse;
    }
}