export type Point = [number, number];

export const distanceBetweenPoints = (a: Point, b: Point): number =>
  Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));

export const roundPoint = (point: Point) =>
  [Math.round(point[0]), Math.round(point[1])] as Point;

export const addPoints = (a: Point, b: Point): Point => [
  a[0] + b[0],
  a[1] + b[1],
];

export const subtractPoints = (a: Point, b: Point): Point => [
  a[0] - b[0],
  a[1] - b[1],
];

export const multiplyPoint = (a: Point, m: number): Point => [
  a[0] * m,
  a[1] * m,
];

export const arePointsEqual = (a: Point, b: Point): boolean =>
  a === b || (a && b && a[0] === b[0] && a[1] === b[1]);