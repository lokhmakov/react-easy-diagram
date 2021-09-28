import React from 'react';
import type { IMiniControlComponentProps } from "../states/diagramSettings";
import { IComponentDefinition } from "../states/visualComponentState";
import { CornerPosition } from "../utils/position";
export declare const Button: React.FC<{
    size: number;
    onClick: () => any;
}>;
export declare const createDefaultMiniControl: (settings?: Partial<IMiniControlDefaultSettings> | undefined) => IComponentDefinition<IMiniControlComponentProps, IMiniControlDefaultSettings>;
export interface IMiniControlDefaultSettings {
    position: CornerPosition;
    containerStyle: React.CSSProperties;
    buttons: ButtonsValue;
    buttonsSize: number;
    parentOffset: number;
}
interface ButtonsValue {
    zoomIn?: boolean;
    zoomOut?: boolean;
    deleteSelection?: boolean;
    cloneSelectedNodes?: boolean;
    zoomToFit?: boolean;
}
export {};
//# sourceMappingURL=MiniControlDefault.d.ts.map