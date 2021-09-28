export declare type Point = [number, number];
export declare function isPoint(value: any): value is Point;
export declare const distanceBetweenPoints: (a: Point, b: Point) => number;
export declare const roundPoint: (point: Point) => Point;
export declare const addPoints: (...points: (Point | undefined | null)[]) => Point;
export declare const subtractPoints: (...points: Point[]) => Point;
export declare const multiplyPoint: (a: Point, m: number) => Point;
export declare const arePointsEqual: (a?: Point | undefined, b?: Point | undefined) => boolean;
//# sourceMappingURL=point.d.ts.map