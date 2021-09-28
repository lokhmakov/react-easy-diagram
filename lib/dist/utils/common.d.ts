import { Point } from "./point";
export declare type BoundingBox = {
    topLeftCorner: Point;
    bottomRightCorner: Point;
    size: Point;
};
export interface Dictionary<TValue> {
    [key: string]: TValue;
}
export declare type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export declare function isNumber(value: any): value is number;
export declare function isObject(value: any): value is object;
export declare function isBoolean(value: any): value is boolean;
//# sourceMappingURL=common.d.ts.map