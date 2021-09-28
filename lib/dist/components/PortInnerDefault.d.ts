import React from 'react';
import type { IPortVisualComponentProps } from "../states/portsSettings";
import type { IComponentDefinition } from "../states/visualComponentState";
import { Point } from "../utils/point";
export interface IPortDefaultSettings {
    size: Point;
    opacity?: number;
    color: string;
    dragColor: string;
    hoverColor: string;
    invalidColor: string;
}
export declare const PortInnerDefault: React.FC<IPortVisualComponentProps<IPortDefaultSettings>>;
export declare function createPortInnerDefault(settings?: Partial<IPortDefaultSettings>): IComponentDefinition<IPortVisualComponentProps, IPortDefaultSettings>;
//# sourceMappingURL=PortInnerDefault.d.ts.map