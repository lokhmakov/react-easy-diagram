import React from 'react';
import type { IDiagramInitState } from "../components/Diagram";
import { RootStore } from "../states/rootStore";
import type { ISettings } from "../states/rootStore";
export declare const useDiagram: (initState?: IDiagramInitState | undefined, settings?: ISettings | undefined) => {
    Diagram: () => JSX.Element;
    storeRef: React.MutableRefObject<RootStore | null>;
};
//# sourceMappingURL=useDiagram.d.ts.map