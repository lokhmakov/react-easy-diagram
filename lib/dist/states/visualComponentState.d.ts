/// <reference types="react" />
export declare class VisualComponentState<TComponentProps> {
    private _component;
    private _settings;
    constructor(component: IComponentDefinition<TComponentProps> | VisualComponent<TComponentProps>);
    import: (newComponent: IComponentDefinition<TComponentProps> | VisualComponent<TComponentProps>) => void;
    get component(): VisualComponent<TComponentProps>;
    get settings(): any;
}
export interface IVisualComponentProps<TEntity, TSettings = any> {
    entity: TEntity;
    settings?: TSettings;
}
export declare type VisualComponent<TComponentProps> = React.FunctionComponent<TComponentProps>;
export interface IComponentDefinition<TComponentProps, TSettings = any> {
    component: VisualComponent<TComponentProps>;
    settings?: TSettings;
}
//# sourceMappingURL=visualComponentState.d.ts.map