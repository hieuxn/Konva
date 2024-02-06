import { Injectable } from "@angular/core";
import Konva from "konva";
import { DimensionIndicator } from "../classes/dimension-indicator";

@Injectable({
    providedIn: 'root'
})
export class KonvaService {
    private stage!: Konva.Stage;
    private layers: Konva.Layer[] = [];
    public constructor(private dimensionIndicator: DimensionIndicator) { }
    public InjectStage(stage: Konva.Stage) {
        this.stage = stage;
        // stage.on('mousedown', event => {
        //     this.dimensionIndicator.destroy()
        // })
    }
    public InjectLayer(layer: Konva.Layer) {
        this.layers.push(layer);
    }
    public GetLayer(index: number): Konva.Layer | null {
        if (index >= this.layers.length) return null;
        return this.layers[index]
    }
    public GetStage(): Konva.Stage {
        return this.stage;
    }
}