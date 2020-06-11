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
