import { BoundingBox } from "../utils/common";
import { SuccessOrErrorResult } from "../utils/result";
import { NodeState, INodeState, INodeStateWithId } from "./nodeState";
import { RootStore } from "./rootStore";
export declare class NodesStore {
    private _nodes;
    private _rootStore;
    constructor(rootStore: RootStore);
    get nodes(): ReadonlyMap<string, NodeState>;
    import: (newNodes?: INodeState[] | undefined) => void;
    export: () => INodeStateWithId[];
    addNodes: (nodes: INodeState[], rewriteIfExists?: boolean) => SuccessOrErrorResult<NodeState, INodeState>[];
    private _addNodesInternal;
    addNode: (node: INodeState, rewriteIfExists?: boolean) => SuccessOrErrorResult<NodeState, INodeState>;
    private _addNodeInternal;
    removeNode: (nodeId: string) => boolean;
    getNode: (nodeId: string) => NodeState | undefined;
    /**
     * @returns Values are calculated without zoom taking into account, that is, the same as zoom would be '1'
     */
    getNodesBoundingBox: () => BoundingBox;
}
//# sourceMappingURL=nodesStore.d.ts.map