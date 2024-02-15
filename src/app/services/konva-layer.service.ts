import { Injectable } from "@angular/core";
import Konva from "konva";
import { DimensionIndicator } from "../dimensionIndicators/dimension-indicator";

@Injectable({
    providedIn: 'root'
})
export class KonvaLayerService {
    private stage!: Konva.Stage;
    private layers: Konva.Layer[] = [];
    public constructor(private dimensionIndicatorManager: DimensionIndicator) { }
    public InjectStage(stage: Konva.Stage) {
        this.stage = stage;
        stage.on('mousedown', event => {
            this.dimensionIndicatorManager.destroy()
        })
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