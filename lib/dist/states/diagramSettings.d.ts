import { Point } from "../utils/point";
import { VisualComponentWithDefault } from "./visualComponentWithDefault";
import { RootStore } from "./rootStore";
import { IComponentDefinition, VisualComponent } from "./visualComponentState";
import { IUserInteraction, UserInteractionSettings } from "./userInteractionSettings";
export declare class DiagramSettings {
    private _backgroundComponentState;
    private _miniControlComponentState;
    private _zoomInterval;
    private _zoomToFitSettings;
    private _userInteraction;
    constructor();
    import: (obj?: IDiagramSettings | undefined) => void;
    get backgroundComponentState(): VisualComponentWithDefault<IBackgroundComponentProps<any>>;
    get miniControlComponentState(): VisualComponentWithDefault<IMiniControlComponentProps<any>>;
    get zoomInterval(): Point;
    get zoomToFitSettings(): IZoomToFitSettings;
    setZoomInterval: (value: Point | null | undefined) => void;
    get userInteraction(): UserInteractionSettings;
}
export interface IDiagramSettings {
    backgroundComponent?: IComponentDefinition<IBackgroundComponentProps> | VisualComponent<IBackgroundComponentProps>;
    miniControlComponent?: IComponentDefinition<IMiniControlComponentProps> | VisualComponent<IMiniControlComponentProps>;
    zoomInterval?: Point;
    zoomToFitSettings?: IZoomToFitSettings;
    userInteraction?: Partial<IUserInteraction> | boolean;
}
export interface IBackgroundComponentProps<TSettings = any> {
    diagramOffset: Point;
    diagramZoom: number;
    settings?: TSettings;
}
export interface IMiniControlComponentProps<TSettings = any> {
    rootStore: RootStore;
    settings?: TSettings;
}
export interface IZoomToFitSettings {
    padding: Point;
}
//# sourceMappingURL=diagramSettings.d.ts.map