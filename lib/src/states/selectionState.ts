import { makeAutoObservable } from 'mobx';
import { LinkState } from 'states/linkState';
import { NodeState } from 'states/nodeState';

export class SelectionState {
  private _selectedItems: SelectableItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get selectedItems(): Readonly<SelectableItem[]> {
    return this._selectedItems;
  }

  get selectedNodes(): NodeState[] {
    return this.selectedItems.filter(
      (i) => i instanceof NodeState
    ) as NodeState[];
  }

  select = (item: SelectableItem, unselectOther: boolean = false): boolean => {
    if (unselectOther) this.unselectAll();

    if (!item.selected) {
      item.selected = true;
      this._selectedItems = [...this._selectedItems, item];

      return true;
    } else return false;
  };

  switch = (item: SelectableItem) => {
    if (item.selected) {
      this.unselect(item);
    } else {
      this.select(item);
    }
  };

  unselect = (item: SelectableItem): boolean => {
    if (item.selected) {
      item.selected = false;
      this._selectedItems = this._selectedItems.filter((i) => i !== item);
      return true;
    } else return false;
  };

  unselectAll = () => {
    this._selectedItems.forEach((i) => (i.selected = false));
    this._selectedItems = [];
  };

  unselectItems = (itemsToClear: Readonly<SelectableItem[]>) => {
    itemsToClear.forEach((i) => this.unselect(i));
  };
}

export type SelectableItem = NodeState | LinkState;
