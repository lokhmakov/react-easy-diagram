export declare class UserInteractionSettings {
    private _diagramZoom;
    private _diagramPan;
    private _nodeDrag;
    private _portConnection;
    private _nodeSelection;
    private _linkSelection;
    constructor();
    import: (obj?: boolean | Partial<IUserInteraction> | undefined) => void;
    setAll: (value: boolean) => void;
    get diagramZoom(): boolean;
    set diagramZoom(value: boolean);
    get diagramPan(): boolean;
    set diagramPan(value: boolean);
    get nodeDrag(): boolean;
    set nodeDrag(value: boolean);
    get portConnection(): boolean;
    set portConnection(value: boolean);
    get nodeSelection(): boolean;
    set nodeSelection(value: boolean);
    get linkSelection(): boolean;
    set linkSelection(value: boolean);
}
export interface IUserInteraction {
    diagramZoom: boolean;
    diagramPan: boolean;
    nodeDrag: boolean;
    portConnection: boolean;
    nodeSelection: boolean;
    linkSelection: boolean;
}
//# sourceMappingURL=userInteractionSettings.d.ts.map