import { Callbacks, SelectionState } from "../index";
import { NodeState } from "./nodeState";
import { Point } from "../utils/point";
/**
 * Encapsulate logic for dragging mechanism. Right now only nodes are supposed to be dragged.
 */
export declare class DragState {
    private _nodesBeingDragged;
    private _remaindersFromDrags;
    private _selectionState;
    private _callbacks;
    constructor(selectionState: SelectionState, callbacks: Callbacks);
    get isActive(): boolean;
    startDragging: (nodeToDrag: NodeState) => void;
    /**
     * Drag by a vector
     * @param vector vector to drag by which takes into account diagram zoom
     */
    dragBy: (vector: Point) => void;
    stopDragging: () => void;
}
//# sourceMappingURL=dragState.d.ts.map