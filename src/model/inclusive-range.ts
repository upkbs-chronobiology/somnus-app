export class InclusiveRange {
  constructor(
    public min: number,
    public max: number
  ) { }

  static clone(range: InclusiveRange) {
    return new InclusiveRange(range.min, range.max);
  }
}
