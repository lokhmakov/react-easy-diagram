import { IComponentDefinition, VisualComponent } from "./visualComponentState";
export declare class VisualComponentWithDefault<TComponentProps> {
    private _innerComponent;
    private _defaultComponent;
    constructor(defaultComponent: IComponentDefinition<TComponentProps>);
    get component(): VisualComponent<TComponentProps>;
    get settings(): any;
    import: (newComponent?: IComponentDefinition<TComponentProps, any> | VisualComponent<TComponentProps> | undefined) => void;
}
//# sourceMappingURL=visualComponentWithDefault.d.ts.map