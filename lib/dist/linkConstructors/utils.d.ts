import { Point } from "../utils/point";
import { DirectionWithDiagonals } from "../utils/position";
export declare function getDegree(dir: DirectionWithDiagonals | undefined): number | undefined;
export declare function getRadian(dir: DirectionWithDiagonals | undefined): number | undefined;
export declare function createVector(point1: Point, length: number, angleInRadian: number | undefined): Point;
export declare function commandM(point: Point): string;
export declare function commandC(startPoint: Point, control1: Point, control2: Point, endPoint: Point): string;
export declare function coordinateFromPoint(point: Point): string;
//# sourceMappingURL=utils.d.ts.map