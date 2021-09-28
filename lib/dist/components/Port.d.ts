import React from 'react';
import { PortPosition } from "../hooks/useRelativePositionStyles";
import { Point } from "../utils/point";
import { IPortState } from "../states/portState";
export interface IPortProps extends IPortState {
    position?: PortPosition;
    offsetFromNodeCenter?: number;
    offsetFromOrigin?: Point;
}
export declare const Port: React.FC<IPortProps>;
//# sourceMappingURL=Port.d.ts.map