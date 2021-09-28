import { Point } from "../utils/point";
import { LinkPointEndpointState } from "./linkPointEndpointState";
import { LinkPortEndpointState, ILinkPortEndpoint } from "./linkPortEndpointState";
import { RootStore } from "./rootStore";
export declare class LinkState implements ILinkState, ILinkInteractionState {
    private _id;
    private _type;
    private _source;
    private _target;
    private _segments;
    private _selected;
    private _hovered;
    private _extra;
    private _isSelectionEnabled;
    private _rootStore;
    constructor(rootStore: RootStore, id: string, state: ILinkStateWithoutId);
    import: (state: ILinkStateWithoutId) => void;
    private _createEndpointState;
    export: () => ILinkStateWithId;
    get id(): string;
    get type(): string;
    setType: (value: string | null | undefined) => void;
    get segments(): ILinkSegment[];
    setSegments: (value: ILinkSegment[] | null | undefined) => void;
    get path(): ILinkPath | undefined;
    get componentDefinition(): import("./visualComponentState").VisualComponentState<import("./linksSettings").ILinkVisualComponentProps<any>>;
    get selected(): boolean;
    set selected(value: boolean);
    get hovered(): boolean;
    set hovered(value: boolean);
    get extra(): any;
    get source(): LinkPortEndpointState;
    get target(): LinkPortEndpointState;
    setExtra: (value: any) => void;
    get isSelectionEnabled(): boolean;
    setIsSelectionEnabled: (value: boolean | null | undefined) => void;
}
export declare function createLinkPath(rootStore: RootStore, source: LinkPortEndpointState, target: LinkPortEndpointState | LinkPointEndpointState): ILinkPath | undefined;
export interface ILinkInteractionState {
    selected: boolean;
    hovered: boolean;
}
export interface ILinkStateWithoutId {
    type?: string;
    source: ILinkPortEndpoint;
    target: ILinkPortEndpoint;
    segments?: ILinkSegment[];
    extra?: any;
    isSelectionEnabled?: boolean;
}
export interface ILinkStateWithId extends ILinkStateWithoutId {
    id: string;
}
export interface ILinkState extends ILinkStateWithoutId {
    id?: string;
}
export interface ILinkSegment {
    position: Point;
}
export interface ILinkPath {
    svgPath: string;
    source: Point;
    target: Point;
}
//# sourceMappingURL=linkState.d.ts.map