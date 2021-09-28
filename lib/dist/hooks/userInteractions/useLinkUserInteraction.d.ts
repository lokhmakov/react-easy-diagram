import { ReactEventHandlers } from 'react-use-gesture/dist/types';
import { LinkCreationState } from "../../states/linkCreationState";
import { LinkState } from "../../states/linkState";
export declare const useLinkUserInteraction: (linkState: LinkState | LinkCreationState) => IUseLinkUserInteractionResult;
export interface IUseLinkUserInteractionResult {
    bind: (...args: any[]) => ReactEventHandlers;
}
//# sourceMappingURL=useLinkUserInteraction.d.ts.map