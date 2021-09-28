import { SuccessOrErrorResult } from "../utils/result";
import { LinkCreationState } from "./linkCreationState";
import { ILinkPortEndpoint } from "./linkPortEndpointState";
import { LinkState, ILinkState } from "./linkState";
import { PortState } from "./portState";
import { RootStore } from "./rootStore";
export declare class LinksStore {
    private _links;
    private _nodesLinksCollection;
    private _linkCreation;
    private _rootStore;
    constructor(rootStore: RootStore);
    import: (newLinks?: ILinkState[] | undefined) => void;
    export: () => ILinkState[];
    get links(): ReadonlyMap<string, LinkState>;
    get linkCreation(): LinkCreationState;
    getNodeLinks: (nodeId: string) => LinkState[];
    getLink: (id: string) => LinkState | undefined;
    getPortLinks: (nodeId: string, portId: string) => LinkState[];
    removeNodeLinks: (nodeId: string) => void;
    removePortLinks: (nodeId: string, portId: string) => void;
    addLink: (link: ILinkState) => LinkState;
    validateAndAddLink: (link: ILinkState) => SuccessOrErrorResult<LinkState>;
    removeLink: (linkId: string) => boolean;
    validateLink: (link: ILinkState) => SuccessOrErrorResult;
    validateLinkProperties: (link: ILinkState) => SuccessOrErrorResult;
    getEndpointPortOrError: (endpoint: ILinkPortEndpoint) => SuccessOrErrorResult<PortState>;
    getEndpointPort: (endpoint: ILinkPortEndpoint) => PortState | undefined;
    areEndpointsConnected: (source: ILinkPortEndpoint, target: ILinkPortEndpoint) => boolean;
    getLinkForEndpointsIfExists: (source: ILinkPortEndpoint, target: ILinkPortEndpoint) => LinkState | undefined;
    private _addLinkToNodeLinksCollection;
    private _removeLinkFromNodeLinksCollection;
}
//# sourceMappingURL=linksStore.d.ts.map