import React from 'react';
import { NodeState } from "../states/nodeState";
export declare const NodeWrapper: React.FunctionComponent<{
    node: NodeState;
}>;
export declare const NodeContext: React.Context<NodeState | null>;
interface IRenderedPorts {
    render: (id: string) => void;
    unrender: (id: string) => void;
}
export declare const RenderedPortsComponentsContext: React.Context<IRenderedPorts>;
export declare const className: string;
export {};
//# sourceMappingURL=NodeWrapper.d.ts.map