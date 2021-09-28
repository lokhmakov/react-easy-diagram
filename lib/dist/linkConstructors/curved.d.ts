import { ILinkPathConstructor } from '../states/linksSettings';
export interface ICurvedLinkPathConstructorSettings {
    directionFactor: number;
    tweakDirectionFactorBasedOnDistance: (distance: number, directionFactor: number) => number;
}
export declare function createCurvedLinkPathConstructor(settings?: Partial<ICurvedLinkPathConstructorSettings>): ILinkPathConstructor;
//# sourceMappingURL=curved.d.ts.map