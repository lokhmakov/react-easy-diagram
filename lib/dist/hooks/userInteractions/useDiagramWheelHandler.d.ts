/// <reference types="react" />
import { Handler } from 'react-use-gesture/dist/types';
import type { IUserInteractionTranslateAndZoom } from "./common";
export declare function useDiagramWheelHandler(state: IUserInteractionTranslateAndZoom): IWheelHandler;
declare type WheelEventHandler = Handler<'wheel', React.WheelEvent<Element> | WheelEvent> | undefined;
interface IWheelHandler {
    onWheel: WheelEventHandler;
}
export {};
//# sourceMappingURL=useDiagramWheelHandler.d.ts.map