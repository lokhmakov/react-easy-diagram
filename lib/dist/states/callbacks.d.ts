import { PortState } from "./portState";
import { RootStore } from "./rootStore";
import { INodeState, NodeState } from "./nodeState";
import { ErrorResult, SuccessOrErrorResult } from "../utils/result";
import { Point } from "../utils/point";
export declare class Callbacks {
    private _validateLinkEndpoints?;
    private _nodesAdded?;
    private _nodePositionChanged?;
    private _dragStateChanged?;
    private _rootStore;
    constructor(rootStore: RootStore);
    import: (callbacks?: ICallbacks | undefined) => void;
    export: () => ICallbacks;
    validateLinkEndpoints: (source: PortState, target: PortState) => boolean;
    nodesAdded: (addResults: SuccessOrErrorResult<NodeState, INodeState>[], importing: boolean) => void | undefined;
    nodePositionChanged: (node: NodeState, oldPosition: Point, newPosition: Point, isDragActive: boolean) => void | undefined;
    dragStateChanged: (nodes: NodeState[], started: boolean) => void | undefined;
}
export interface ICallbacks {
    validateLinkEndpoints?: (source: PortState, target: PortState, rootStore: RootStore) => boolean;
    nodesAdded?: (addedNodes: NodeState[], failedToAdd: ErrorResult<INodeState>[], importing: boolean, rootStore: RootStore) => void;
    nodePositionChanged?: (node: NodeState, oldPosition: Point, newPosition: Point, isDragActive: boolean, rootStore: RootStore) => void;
    dragStateChanged?: (nodes: NodeState[], started: boolean, rootStore: RootStore) => void;
}
//# sourceMappingURL=callbacks.d.ts.map