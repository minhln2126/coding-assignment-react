export function getObjectKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as unknown as (keyof T)[];
}
