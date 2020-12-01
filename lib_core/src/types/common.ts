export interface Point {
  x: number;
  y: number;
}

export interface Dictionary<TValue> {
  [key: string]: TValue;
}

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;