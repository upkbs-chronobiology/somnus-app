export function arraysEqual<T>(a: T[], b: T[]): boolean {
  // == because we want to match null and undefined
  if (!a || !b) return a == b;

  return a.length === b.length &&
    a.map((item, i) => b[i] === item)
      .reduce((merged, item) => merged && item, true);
}
