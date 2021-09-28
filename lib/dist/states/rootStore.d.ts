import { Callbacks, ICallbacks } from "./callbacks";
import { DiagramSettings, IDiagramSettings } from "./diagramSettings";
import { DiagramState } from "./diagramState";
import { LinksSettings, ILinksSettings } from "./linksSettings";
import { LinksStore } from "./linksStore";
import { ILinkState } from "./linkState";
import { NodesSettings, INodesSettings } from "./nodesSettings";
import { NodesStore } from "./nodesStore";
import { INodeState } from "./nodeState";
import { PortsSettings, IPortsSettings } from "./portsSettings";
import { SelectionState } from "./selectionState";
import { DragState } from "./dragState";
import { CommandExecutor } from "./commandExecutor";
export declare class RootStore {
    private _diagramState;
    private _nodesStore;
    private _linksStore;
    private _selectionState;
    private _dragState;
    private _commandExecutor;
    private _diagramSettings;
    private _nodesSettings;
    private _portsSettings;
    private _linksSettings;
    private _callbacks;
    constructor();
    get diagramState(): DiagramState;
    get nodesStore(): NodesStore;
    get linksStore(): LinksStore;
    get diagramSettings(): DiagramSettings;
    get nodesSettings(): NodesSettings;
    get linksSettings(): LinksSettings;
    get portsSettings(): PortsSettings;
    get callbacks(): Callbacks;
    get selectionState(): SelectionState;
    get dragState(): DragState;
    get commandExecutor(): CommandExecutor;
    importState: (nodes?: INodeState[] | undefined, links?: ILinkState[] | undefined) => void;
    export: () => {
        nodes: INodeState[];
        links: ILinkState[];
    };
    importSettings: (settings: ISettings) => void;
}
export interface ISettings {
    diagram?: IDiagramSettings;
    nodes?: INodesSettings;
    links?: ILinksSettings;
    ports?: IPortsSettings;
    callbacks?: ICallbacks;
}
//# sourceMappingURL=rootStore.d.ts.map