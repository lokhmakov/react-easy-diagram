import React from 'react';
import { INodeVisualComponentProps } from '../states/nodesSettings';
import { IComponentDefinition, VisualComponent } from "../states/visualComponentState";
import { NodeState } from "../states/nodeState";
import { Optional } from "../utils/common";
import { IPortProps } from './Port';
export declare const Node: React.FC<INodeVisualComponentProps<INodeSettings>>;
export interface INodeFinalSettings {
    style?: React.CSSProperties;
    selectedStyle: React.CSSProperties;
    ports?: IPortProps[];
    innerNode: VisualComponent<{
        node: NodeState;
    }>;
    padding?: React.CSSProperties['padding'];
}
export declare function createNode(settings?: INodeSettings): IComponentDefinition<INodeVisualComponentProps<INodeSettings>, INodeSettings>;
export declare type INodeSettings = Optional<INodeFinalSettings, 'innerNode' | 'selectedStyle'>;
export declare type INodeDefaultSettingsWithoutPorts = Omit<INodeSettings, 'ports'>;
export declare const createInputOutputHorizontalNode: (settings?: Pick<Optional<INodeFinalSettings, "innerNode" | "selectedStyle">, "innerNode" | "selectedStyle" | "style" | "padding"> | undefined) => IComponentDefinition<INodeVisualComponentProps<Optional<INodeFinalSettings, "innerNode" | "selectedStyle">>, Optional<INodeFinalSettings, "innerNode" | "selectedStyle">>;
export declare const createInputOutputVerticalNode: (settings?: Pick<Optional<INodeFinalSettings, "innerNode" | "selectedStyle">, "innerNode" | "selectedStyle" | "style" | "padding"> | undefined) => IComponentDefinition<INodeVisualComponentProps<Optional<INodeFinalSettings, "innerNode" | "selectedStyle">>, Optional<INodeFinalSettings, "innerNode" | "selectedStyle">>;
export declare const createInputHorizontalNode: (settings?: Pick<Optional<INodeFinalSettings, "innerNode" | "selectedStyle">, "innerNode" | "selectedStyle" | "style" | "padding"> | undefined) => IComponentDefinition<INodeVisualComponentProps<Optional<INodeFinalSettings, "innerNode" | "selectedStyle">>, Optional<INodeFinalSettings, "innerNode" | "selectedStyle">>;
export declare const createInputVerticalNode: (settings?: Pick<Optional<INodeFinalSettings, "innerNode" | "selectedStyle">, "innerNode" | "selectedStyle" | "style" | "padding"> | undefined) => IComponentDefinition<INodeVisualComponentProps<Optional<INodeFinalSettings, "innerNode" | "selectedStyle">>, Optional<INodeFinalSettings, "innerNode" | "selectedStyle">>;
export declare const createOutputHorizontalNode: (settings?: Pick<Optional<INodeFinalSettings, "innerNode" | "selectedStyle">, "innerNode" | "selectedStyle" | "style" | "padding"> | undefined) => IComponentDefinition<INodeVisualComponentProps<Optional<INodeFinalSettings, "innerNode" | "selectedStyle">>, Optional<INodeFinalSettings, "innerNode" | "selectedStyle">>;
export declare const createOutputVerticalNode: (settings?: Pick<Optional<INodeFinalSettings, "innerNode" | "selectedStyle">, "innerNode" | "selectedStyle" | "style" | "padding"> | undefined) => IComponentDefinition<INodeVisualComponentProps<Optional<INodeFinalSettings, "innerNode" | "selectedStyle">>, Optional<INodeFinalSettings, "innerNode" | "selectedStyle">>;
export declare const createStarNode: (settings?: Pick<Optional<INodeFinalSettings, "innerNode" | "selectedStyle">, "innerNode" | "selectedStyle" | "style" | "padding"> | undefined) => IComponentDefinition<INodeVisualComponentProps<Optional<INodeFinalSettings, "innerNode" | "selectedStyle">>, Optional<INodeFinalSettings, "innerNode" | "selectedStyle">>;
//# sourceMappingURL=Node.d.ts.map