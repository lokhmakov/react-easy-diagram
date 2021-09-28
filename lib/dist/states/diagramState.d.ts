import { IUserInteractionTranslate, IUserInteractionTranslateAndZoom } from "../hooks/userInteractions/common";
import { HtmlElementRefState } from "./htmlElementRefState";
import { RootStore } from "./rootStore";
import { Point } from "../utils/point";
export declare class DiagramState implements IUserInteractionTranslate, IUserInteractionTranslateAndZoom {
    private _offset;
    private _zoom;
    private _renderedOffset;
    private _renderedZoom;
    private _diagramInnerRef;
    private _rootStore;
    constructor(rootStore: RootStore);
    import: (state?: IDiagramState | undefined) => void;
    export: () => IDiagramState;
    setOffset: (newOffset: Point | null | undefined) => void;
    setZoom: (newZoom: number | null | undefined) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    zoomInto: (pointToZoomInto: Point, zoomMultiplicator: number) => void;
    setTransformation: (newOffset: Point, newZoom: number) => void;
    translate: (translateBy: Point) => void;
    tranlsateAndZoomInto: (translateBy: Point, pointToZoomInto: Point, zoomMultiplicator: number) => void;
    zoomIntoCenter: (zoomMultiplicator: number) => void;
    get diagramInnerRef(): HtmlElementRefState;
    get offset(): Point;
    get zoom(): number;
    get renderedOffset(): Point;
    get renderedZoom(): number;
    /**
     * Set offset and zoom values that were already rendered.
     */
    renderOffsetAndZoom: (offset: Point, zoom: number) => void;
    zoomToFit: () => void;
    private _getNodesBoundingBoxWithPadding;
}
export interface IDiagramState {
    offset: Point;
    zoom: number;
}
//# sourceMappingURL=diagramState.d.ts.map