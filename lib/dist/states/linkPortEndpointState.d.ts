import { Point } from "../utils/point";
import { NodeState } from "./nodeState";
import { PortState } from "./portState";
import { RootStore } from "./rootStore";
export declare class LinkPortEndpointState implements ILinkPortEndpoint {
    private _nodeId;
    private _portId;
    private _rootStore;
    constructor(nodeId: string, portId: string, rootStore: RootStore);
    export: () => ILinkPortEndpoint;
    get nodeId(): string;
    get portId(): string;
    get node(): NodeState | undefined;
    get port(): PortState | undefined;
    get point(): Point | undefined;
}
export interface ILinkPortEndpoint {
    nodeId: string;
    portId: string;
}
export declare function linkPortEndpointsEquals(a: ILinkPortEndpoint, b: ILinkPortEndpoint): boolean;
//# sourceMappingURL=linkPortEndpointState.d.ts.map