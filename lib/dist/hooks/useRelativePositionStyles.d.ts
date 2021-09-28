import React from 'react';
import { Point } from "../utils/point";
export declare const useRelativePositionStyles: (position?: "left-top" | "left-center" | "left-bottom" | "top-left" | "top-center" | "top-right" | "right-top" | "right-center" | "right-bottom" | "bottom-left" | "bottom-center" | "bottom-right" | "diagonal-left-top" | "diagonal-right-top" | "diagonal-right-bottom" | "diagonal-left-bottom" | undefined, offsetFromParentCenter?: number | undefined, offsetFromOrigin?: Point | undefined, usePortCenterPivot?: boolean) => RelativePositionStyles;
declare type RelativePositionStyles = Pick<Partial<React.CSSProperties>, 'position' | 'left' | 'top' | 'right' | 'bottom' | 'width' | 'height' | 'transform'>;
export declare const portPositionValues: readonly ["left-top", "left-center", "left-bottom", "top-left", "top-center", "top-right", "right-top", "right-center", "right-bottom", "bottom-left", "bottom-center", "bottom-right", "diagonal-left-top", "diagonal-right-top", "diagonal-right-bottom", "diagonal-left-bottom"];
export declare type PortPosition = typeof portPositionValues[number];
export {};
//# sourceMappingURL=useRelativePositionStyles.d.ts.map