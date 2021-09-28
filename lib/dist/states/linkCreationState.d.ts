import { Point } from "../utils/point";
import { LinkPointEndpointState } from "./linkPointEndpointState";
import { LinkPortEndpointState } from "./linkPortEndpointState";
import { ILinkInteractionState, ILinkPath } from "./linkState";
import { PortState } from "./portState";
import { RootStore } from "./rootStore";
export declare class LinkCreationState implements ILinkInteractionState {
    private _source;
    private _target;
    private _targetPortCandidate;
    private _rootStore;
    constructor(rootStore: RootStore);
    get selected(): boolean;
    get hovered(): boolean;
    get source(): LinkPortEndpointState | null;
    get target(): LinkPointEndpointState | null;
    get targetPortCandidate(): PortState | null;
    get isLinking(): boolean;
    startLinking: (portState: PortState, pointOnPort: Point) => boolean;
    setTargetPortCandidate: (portState: PortState) => void;
    resetTargetPortCandidate: (portState: PortState) => void;
    stopLinking: () => void;
    get componentDefinition(): import("./visualComponentState").VisualComponentState<import("./linksSettings").ILinkVisualComponentProps<any>>;
    get path(): ILinkPath | undefined;
    private _resetProps;
}
export declare const linkCreationComponentType: string;
//# sourceMappingURL=linkCreationState.d.ts.map