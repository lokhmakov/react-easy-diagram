import { EventTypes, NativeHandlers, UserHandlers, Vector2 } from 'react-use-gesture/dist/types';
import { Point } from "../../utils/point";
/**
 * Check each element starting from the first one in composedPath() (see https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath),
 * if exceptClassName is the first class found -> return false,
 * if className is the first class found -> return true,
 * if neither exceptClassName nor className were found -> return false
 */
export declare const eventPathContainsClass: (event: PointerEvent | React.PointerEvent<Element>, className: string, exceptClassName?: string | undefined) => boolean;
/**
 * Does gesture can be potentially a tap/click event?
 * Drag gesture will be tap/click gesture on mouse or touch release only when the drag displacement is inferior to 3 pixels.
 * See useGestures documetation for more information.
 * @param movement - state value of gesture, represent gesture offset
 */
export declare function canDragGestureBeTapInstead(movement: Vector2): boolean;
export interface IUserInteractionTranslate {
    offset: Point;
    setOffset: (newOffset: Point) => any;
}
export interface IUserInteractionTranslateAndZoom {
    offset: Point;
    zoom: number;
    tranlsateAndZoomInto: (translateBy: Point, pointToZoomInto: Point, changeZoomBy: number) => any;
}
export declare type GestureHandlers = Partial<UserHandlers<EventTypes> & NativeHandlers<EventTypes>>;
//# sourceMappingURL=common.d.ts.map