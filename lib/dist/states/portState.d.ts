import { Point } from "../utils/point";
import { DirectionWithDiagonals } from "../utils/position";
import { HtmlElementRefState } from "./htmlElementRefState";
import { LinkState } from "./linkState";
import { NodeState } from "./nodeState";
import { IPortVisualComponentProps } from "./portsSettings";
import { RootStore } from "./rootStore";
import { VisualComponentState, VisualComponent } from "./visualComponentState";
export declare class PortState {
    private _id;
    private _nodeId;
    private _label;
    private _type;
    private _extra;
    private _component;
    private _linkDirection;
    private _isConnectionEnabled;
    private _ref;
    private _dragging;
    private _hovered;
    private _validForConnection;
    private _sizeAndPositionRecalculationWithDelay;
    private _rootStore;
    constructor(rootStore: RootStore, id: string, nodeId: string, state?: IPortStateWithoutIds);
    get id(): string;
    get nodeId(): string;
    get fullId(): string;
    get ref(): HtmlElementRefState;
    get dragging(): boolean;
    set dragging(value: boolean);
    get hovered(): boolean;
    set hovered(value: boolean);
    get validForConnection(): boolean;
    set validForConnection(value: boolean);
    get label(): string;
    setLabel: (value: string | null | undefined) => void;
    get type(): string;
    setType: (value: string | null | undefined) => void;
    /**
     * Update all properties. If some property missing in `state` parameter, the default one will be used.
     */
    import: (state?: IPortStateWithoutIds | undefined) => void;
    /**
     * Update only those properties presented in `state` parameter
     */
    update: (state?: IPortStateWithoutIds | undefined) => void;
    export: () => IPortStateWithIds;
    get extra(): any;
    setExtra: (value: any) => void;
    get node(): NodeState;
    get offsetRelativeToNode(): Point | null;
    /**
     * @returns Value is calculated without zoom taking into account, that is, the same as zoom would be '1'.
     * Value can be @type {null} in case reference to real DOM object is not set.
     */
    get realSize(): Point | null;
    setComponent: (value?: VisualComponent<IPortVisualComponentProps<any>> | null | undefined) => void;
    get componentDefinition(): VisualComponentState<IPortVisualComponentProps<any>>;
    get connectedLinks(): LinkState[];
    get connectedPorts(): PortState[];
    get linkDirection(): DirectionWithDiagonals | undefined;
    setLinkDirection: (value: DirectionWithDiagonals | undefined) => void;
    setLinkDirectionIfNotYet: (direction: DirectionWithDiagonals) => void;
    recalculateSizeAndPosition: () => void;
    recalculateSizeAndPositionWithoutDelay: () => void;
    get sizeAndPositionRecalculationWithDelay(): number;
    get isConnectionEnabled(): boolean;
    setIsConnectionEnabled: (value: boolean | null | undefined) => void;
}
export interface IPortStateWithoutIds {
    label?: string;
    type?: string;
    extra?: any;
    component?: VisualComponent<IPortVisualComponentProps>;
    linkDirection?: DirectionWithDiagonals;
    isConnectionEnabled?: boolean;
}
export interface IPortState extends IPortStateWithoutIds {
    id: string;
}
export interface IPortStateWithIds extends IPortStateWithoutIds {
    id: string;
    nodeId: string;
}
export declare function createFullPortId(nodeId: string, portId: string): string;
//# sourceMappingURL=portState.d.ts.map