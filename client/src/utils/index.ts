import { Nullable } from "../types";

export function getObjectKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as unknown as (keyof T)[];
}

type Timer = ReturnType<typeof setTimeout>;
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timerId: Nullable<Timer> = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    const context = this;
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      func.apply(context, args);
      timerId = null;
    }, delay);
  };
}

export function uniques<T>(arr: T[]): T[] {
  const set = new Set(arr);
  return Array.from(set);
}
