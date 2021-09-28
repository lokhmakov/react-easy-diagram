import { Point } from "./point";
export declare const generateTransform: (translate: Point, scale?: number | undefined) => string;
export interface ITransformation {
    zoom: number;
    offset: Point;
}
export declare const areTranformationsEqual: (a: ITransformation, b: ITransformation) => boolean;
//# sourceMappingURL=transformation.d.ts.map