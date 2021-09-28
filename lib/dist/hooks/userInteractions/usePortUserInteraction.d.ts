import { ReactEventHandlers } from 'react-use-gesture/dist/types';
import { PortState } from "../../states/portState";
export declare const usePortUserInteraction: (portState?: PortState | undefined) => IUsePortUserInteractionResult;
export interface IUsePortUserInteractionResult {
    active: boolean;
    bind: (...args: any[]) => ReactEventHandlers;
}
//# sourceMappingURL=usePortUserInteraction.d.ts.map