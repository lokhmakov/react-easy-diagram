/// <reference types="react" />
import { ReactEventHandlers } from 'react-use-gesture/dist/types';
import { Point } from "../utils/point";
import { DirectionWithDiagonals } from "../utils/position";
import { LinkCreationState } from "./linkCreationState";
import { LinkState } from "./linkState";
import { VisualComponents, IVisualComponentsObject } from "./visualComponents";
import { IVisualComponentProps } from "./visualComponentState";
export declare class LinksSettings {
    private _pathConstructor;
    private _visualComponents;
    private _preferLinksDirection;
    private _defaultSvgMarkers;
    private _svgMarkers;
    constructor();
    import: (obj?: ILinksSettings | undefined) => void;
    get pathConstructor(): ILinkPathConstructor;
    setPathConstructor: (value: ILinkPathConstructor | null | undefined) => void;
    get visualComponents(): VisualComponents<LinkState | LinkCreationState, ILinkVisualComponentProps<any>>;
    get preferLinksDirection(): "horizontal" | "vertical" | "both";
    get svgMarkers(): ReadonlyArray<React.FunctionComponent>;
}
export interface ILinkVisualComponentProps<TSettings = any> extends IVisualComponentProps<LinkState | LinkCreationState, TSettings> {
    bind: (...args: any[]) => ReactEventHandlers;
}
export interface ILinksSettings extends IVisualComponentsObject<ILinkVisualComponentProps> {
    pathConstructor?: ILinkPathConstructor;
    preferLinksDirection?: LinksSettings['preferLinksDirection'];
    svgMarkers?: React.FunctionComponent[];
}
export interface ILinkPathConstructorEndpointInfo {
    point: Point;
    portType?: string;
    direction?: DirectionWithDiagonals;
}
export declare type ILinkPathConstructor = (source: ILinkPathConstructorEndpointInfo, target: ILinkPathConstructorEndpointInfo) => string;
//# sourceMappingURL=linksSettings.d.ts.map