import { Dictionary } from "../utils/common";
import { IVisualComponentProps, VisualComponentState, IComponentDefinition, VisualComponent } from "./visualComponentState";
export declare class VisualComponents<TEntity, TComponentProps extends IVisualComponentProps<TEntity>> {
    private _defaultType;
    private _defaultComponents;
    private _components;
    constructor(defaultComponents: Dictionary<IComponentDefinition<TComponentProps> | VisualComponent<TComponentProps>>);
    import: (obj?: IVisualComponentsObject<TComponentProps> | undefined) => void;
    getComponent: (type: string | undefined | null) => VisualComponentState<TComponentProps>;
    get defaultType(): string;
    setDefaultType: (value: string | undefined | null) => void;
    private _createComponentCollection;
}
export declare const componentDefaultType = "default";
export interface IVisualComponentsObject<TComponentProps> {
    defaultType?: string;
    components?: Dictionary<IComponentDefinition<TComponentProps> | VisualComponent<TComponentProps>>;
}
//# sourceMappingURL=visualComponents.d.ts.map