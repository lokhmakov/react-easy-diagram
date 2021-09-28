/// <reference types="react" />
import { NodeState } from "./nodeState";
import { VisualComponents, IVisualComponentsObject } from "./visualComponents";
import { IVisualComponentProps } from "./visualComponentState";
import { Point } from "../utils/point";
export declare class NodesSettings {
    private _visualComponents;
    private _gridSnap;
    constructor();
    get visualComponents(): VisualComponents<NodeState, INodeVisualComponentProps<any>>;
    import: (obj?: INodesSettings | undefined) => void;
    get gridSnap(): Point | null;
    setGridSnap: (gridSnap?: number | Point | undefined) => void;
}
export interface INodeVisualComponentProps<TSettings = any> extends IVisualComponentProps<NodeState, TSettings> {
    draggableRef: React.RefObject<any>;
}
export interface INodesSettings extends IVisualComponentsObject<INodeVisualComponentProps> {
    gridSnap?: number | Point;
}
//# sourceMappingURL=nodesSettings.d.ts.map