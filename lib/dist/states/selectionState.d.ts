import { LinkState } from "./linkState";
import { NodeState } from "./nodeState";
export declare class SelectionState {
    private _selectedItems;
    constructor();
    get selectedItems(): Readonly<SelectableItem[]>;
    get selectedNodes(): NodeState[];
    select: (item: SelectableItem, unselectOther?: boolean) => boolean;
    switch: (item: SelectableItem) => void;
    unselect: (item: SelectableItem) => boolean;
    unselectAll: () => void;
    unselectItems: (itemsToClear: Readonly<SelectableItem[]>) => void;
}
export declare type SelectableItem = NodeState | LinkState;
//# sourceMappingURL=selectionState.d.ts.map