import React from 'react';
import type { ILinkVisualComponentProps } from "../states/linksSettings";
import type { IComponentDefinition } from "../states/visualComponentState";
export declare const LinkDefault: React.FC<ILinkVisualComponentProps<Partial<ILinkDefaultSettings>>>;
export interface ILinkDefaultSettings {
    color: string;
    selectedColor?: string;
    hoveredColor?: string;
    enableHoverEffect: boolean;
    strokeWidth: number;
    cirleRadius: number;
    markerStart?: ILinkSvgMarker;
    markerEnd?: ILinkSvgMarker;
}
declare type ILinkSvgMarker = {
    default: string;
    hovered?: string;
    selected?: string;
} | string;
export declare function createLinkDefault(settings?: Partial<ILinkDefaultSettings>): IComponentDefinition<ILinkVisualComponentProps, Partial<ILinkDefaultSettings>>;
export {};
//# sourceMappingURL=LinkDefault.d.ts.map