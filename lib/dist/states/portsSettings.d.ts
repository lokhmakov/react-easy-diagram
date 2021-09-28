import { PortState } from "./portState";
import { VisualComponents, IVisualComponentsObject } from "./visualComponents";
import { IVisualComponentProps } from "./visualComponentState";
export declare class PortsSettings {
    private _portVisualComponents;
    constructor();
    get portVisualComponents(): VisualComponents<PortState, IPortVisualComponentProps<any>>;
    import: (obj?: IPortsSettings | undefined) => void;
}
export interface IPortVisualComponentProps<TSettings = any> extends IVisualComponentProps<PortState, TSettings> {
}
export interface IPortsSettings {
    portComponents?: IVisualComponentsObject<IPortVisualComponentProps>['components'];
    portDefaultType?: IVisualComponentsObject<IPortVisualComponentProps>['defaultType'];
}
//# sourceMappingURL=portsSettings.d.ts.map