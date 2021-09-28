import { PortState } from "../states/portState";
import { INodePortState } from "../states/nodeState";
interface IPortStateWithNodeId extends INodePortState {
    nodeId: string;
}
export declare function useUpdateOrCreatePortState(port: IPortStateWithNodeId): PortState | undefined;
export {};
//# sourceMappingURL=useUpdateOrCreatePortState.d.ts.map