/**
 * Compare two arrays index by index, matching based on === by default.
 */
export function arraysEqual<T>(
  a: T[],
  b: T[],
  equality: (a: T, b: T) => boolean = (a, b) => a === b
): boolean {
  // == because we want to match null and undefined
  if (!a || !b) return a == b;

  if (a === b) return true;

  return a.length === b.length &&
    a.map((item, i) => equality(b[i], item))
      .reduce((merged, item) => merged && item, true);
}

export function groupArray<T>(array: T[], mapping: (t: T) => string): { [key: string]: T[] } {
  const result: { [key: string]: T[] } = {};

  array.forEach(item => {
    const group = mapping(item);
    if (!result[group]) result[group] = [];

    result[group].push(item);
  });

  return result;
}

export function indexBy<K, T>(array: T[], mapping: (t: T) => K): Map<K, T[]> {
  return array.reduce((map: Map<K, T[]>, t: T) => {
    const key = mapping(t);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(t);
    return map;
  }, new Map());
}

export function flatten<T>(arr: T[][]): T[] {
  return arr.reduce((acc: T[], item: T[]) => [...acc, ...item], []);
}

export async function filterAsync<T>(array: T[], filter: (t: T) => Promise<boolean>): Promise<T[]> {
  const removed = Symbol();
  const combed = await Promise.all(array.map(async t => (await filter(t)) ? t : removed));
  return combed
    .filter(t => t !== removed)
    .map(t => t as T);
}
