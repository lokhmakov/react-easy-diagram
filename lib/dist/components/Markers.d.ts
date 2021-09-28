import React, { CSSProperties } from 'react';
export interface ISvgMarkerSettings {
    id: string;
    style?: CSSProperties;
}
export interface ISvgCircleMarkerSettings extends ISvgMarkerSettings {
    radius?: number;
}
export declare function createCircleMarker(settings: ISvgCircleMarkerSettings): React.FunctionComponent;
export interface ISvgArrowMarkerSettings extends ISvgMarkerSettings {
    height?: number;
    width?: number;
}
export declare function createArrowMarker(settings: ISvgArrowMarkerSettings): React.FunctionComponent;
//# sourceMappingURL=Markers.d.ts.map