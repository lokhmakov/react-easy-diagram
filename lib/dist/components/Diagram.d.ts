import React from 'react';
import type { ISettings } from "../states/rootStore";
import { RootStore } from "../states/rootStore";
import type { INodeState } from "../states/nodeState";
import type { ILinkState } from "../states/linkState";
import '../Diagram.css';
export declare const RootStoreContext: React.Context<RootStore | null>;
export declare function Diagram(props: IDiagramProps): JSX.Element;
export declare namespace Diagram {
    var displayName: string;
}
export interface IDiagramProps {
    settings?: ISettings;
    initState?: IDiagramInitState;
    storeRef?: React.MutableRefObject<RootStore | null>;
}
export interface IDiagramInitState {
    nodes?: INodeState[];
    links?: ILinkState[];
}
//# sourceMappingURL=Diagram.d.ts.map