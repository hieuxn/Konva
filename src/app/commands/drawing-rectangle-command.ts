import { default as Konva, default as Konya } from "konva";
import { DrawingCommand } from "./drawing-command";

export class DrawingRectangleCommand extends DrawingCommand {
    public override name: string = "Draw Rectangle";
    protected override drawShape(startX: number, endX: number, startY: number, endY: number): Konya.Shape | null {
        const rect = new Konva.Rect({
            x: startX,
            y: startY,
            width: endX - startX,
            height: endY - startY,
            fill: 'lightblue',
            draggable: true,
            strokeWidth: 2,
        });
        this.layer.add(rect);
        rect.on("mousedown", event => {
            event.cancelBubble = true;
            this.dimensionIndicator.drawDimensions(this.layer, rect);
        });
        return rect;
    }
}
