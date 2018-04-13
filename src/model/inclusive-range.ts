export class InclusiveRange {
  constructor(
    public min: number,
    public max: number
  ) { }

  static clone(range: InclusiveRange) {
    if (!range) return range;
    return new InclusiveRange(range.min, range.max);
  }

  static equal(a: InclusiveRange, b: InclusiveRange): boolean {
    // double (and not triple) equals check to cover null vs. undefined
    if (!a || !b) return a == b;

    return a.min === b.min && a.max === b.max;
  }
}
