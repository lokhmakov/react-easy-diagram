/// <reference types="react" />
import { Handler } from 'react-use-gesture/dist/types';
declare type DragEventHandler = Handler<'drag', React.PointerEvent<Element> | PointerEvent> | undefined;
export interface IDragHandlers {
    onDrag: DragEventHandler;
    onDragStart: DragEventHandler;
    onDragEnd: DragEventHandler;
}
export declare function useDiagramDragHandlers(cancelEvent?: (event: React.PointerEvent<Element> | PointerEvent) => boolean): IDragHandlers;
export {};
//# sourceMappingURL=useDiagramDragHandlers.d.ts.map