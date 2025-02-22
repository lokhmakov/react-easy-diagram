import { Point } from 'utils/point';

export type BoundingBox = {
  topLeftCorner: Point;
  bottomRightCorner: Point;
  size: Point;
};

export interface Dictionary<TValue> {
  [key: string]: TValue;
}

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export function isNumber(value: any): value is number {
  return Number.isFinite(value);
}

export function isObject(value: any): value is object {
  return value != null && typeof value == 'object' && !Array.isArray(value);
}

export function isBoolean(value: any): value is boolean {
  return value != null && typeof value == 'boolean';
}