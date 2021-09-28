/// <reference types="react" />
import { Handler, WebKitGestureEvent } from 'react-use-gesture/dist/types';
declare type PinchEvent = React.TouchEvent | TouchEvent | React.WheelEvent | WheelEvent | WebKitGestureEvent;
declare type PinchEventHandler = Handler<'pinch', PinchEvent> | undefined;
interface IPinchHandlers {
    onPinch: PinchEventHandler;
    onPinchStart: PinchEventHandler;
    onPinchEnd: PinchEventHandler;
}
export declare function useDiagramPinchHandlers(cancel: (event: PinchEvent) => boolean): IPinchHandlers;
export {};
//# sourceMappingURL=useDiagramPinchHandlers.d.ts.map