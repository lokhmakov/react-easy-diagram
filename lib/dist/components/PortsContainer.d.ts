import React from 'react';
import { VisualComponent } from "../states/visualComponentState";
import { Position } from "../utils/position";
import { IPortState } from "../states/portState";
export interface IPortsContainerSettings {
    style?: React.CSSProperties;
    gapBetweenPorts: string;
    /**
     * If number - offset from origin position in direction from the center of parent element.
     * If Point - horizontal offset and vertical offset.
     */
    offsetFromOriginPosition?: number;
}
export interface IPortsContainerProps {
    position: Position;
    ports?: IPortState[];
}
export declare function createPortsContainer(settings?: Partial<IPortsContainerSettings>): VisualComponent<IPortsContainerProps>;
//# sourceMappingURL=PortsContainer.d.ts.map