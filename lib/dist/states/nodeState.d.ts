import { Dictionary } from "../utils/common";
import { SuccessOrErrorResult } from "../utils/result";
import { HtmlElementRefState } from "./htmlElementRefState";
import { LinkState } from "./linkState";
import { PortState, IPortStateWithoutIds } from "./portState";
import { RootStore } from "./rootStore";
import { Point } from "../utils/point";
export declare class NodeState {
    private _id;
    private _label;
    private _position;
    private _ports;
    private _ref;
    private _type;
    private _selected;
    private _extra;
    private _isSelectionEnabled;
    private _isDragEnabled;
    private _isDragActive;
    private _rootStore;
    constructor(rootStore: RootStore, id: string, state?: INodeStateWithoutId);
    import: (newState?: INodeStateWithoutId | undefined) => void;
    export: () => INodeStateWithId;
    get id(): string;
    get label(): string;
    set label(value: string);
    get position(): Point;
    /**
     * @param newPosition - new position
     * @param ignoreSnapping - do not take into account snapping to grid
     * @returns remainder in case snap to grid is turned on. For example if newPosition would be [22,17] and snap [10,10],
     * the node position would be set to [20,20] and remainder equals [2,-3]
     */
    setPosition: (newPosition: Point | null | undefined, ignoreSnapping?: boolean) => Point | undefined;
    get type(): string;
    setType: (value: string | null | undefined) => void;
    get selected(): boolean;
    set selected(value: boolean);
    get extra(): any;
    setExtra: (value: any) => void;
    get ref(): HtmlElementRefState;
    get ports(): ReadonlyMap<string, PortState>;
    get transformString(): string;
    get componentDefinition(): import("./visualComponentState").VisualComponentState<import("./nodesSettings").INodeVisualComponentProps<any>>;
    /**
     * @returns Value is calculated without zoom taking into account, that is, the same as zoom would be '1'.
     * Value can be @type {null} in case reference to real DOM object is not set.
     */
    get realSize(): Point | null;
    getPort: (portId: string) => PortState | undefined;
    addPort: (port: INodePortState) => SuccessOrErrorResult<PortState>;
    removePort: (portId: string) => boolean;
    getPortOrThrowException: (portId: string) => PortState;
    get connectedExternalPorts(): Dictionary<PortState[]>;
    get connectedLinks(): LinkState[];
    recalculatePortsSizeAndPosition: () => void;
    get isSelectionEnabled(): boolean;
    setIsSelectionEnabled: (value: boolean | null | undefined) => void;
    get isDragEnabled(): boolean;
    setIsDragEnabled: (value: boolean | null | undefined) => void;
    get isDragActive(): boolean;
    set isDragActive(value: boolean);
}
export interface INodeStateWithoutId {
    label?: string;
    position: Point;
    type?: string;
    extra?: any;
    isSelectionEnabled?: boolean;
    isDragEnabled?: boolean;
}
export interface INodePortState extends IPortStateWithoutIds {
    id?: string;
}
export interface INodeStateWithId extends INodeStateWithoutId {
    id: string;
}
export interface INodeState extends INodeStateWithoutId {
    id?: string;
}
//# sourceMappingURL=nodeState.d.ts.map