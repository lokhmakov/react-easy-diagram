import { Point } from "../utils/point";
export declare class HtmlElementRefState {
    private _currentInternal;
    private _triggerSizePositionRecalculation;
    constructor(initValue: HTMLDivElement | null);
    get current(): HTMLDivElement | null;
    set current(value: HTMLDivElement | null);
    offsetRelativeToParent: (parent: HTMLElement, zoom: number) => Point | null;
    /**
     * @returns Value is calculated without zoom taking into account, that is, the same as zoom would be '1'.
     * Value can be @type {null} in case reference to real DOM object is not set.
     */
    get realSize(): Point | null;
    recalculateSizeAndPosition: () => void;
}
export interface IHtmlElementRect {
    left: number;
    top: number;
    width: number;
    height: number;
}
//# sourceMappingURL=htmlElementRefState.d.ts.map