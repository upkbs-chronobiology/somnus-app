export class Optional<T> {

  constructor(private element: T) {
  }

  exists(): boolean {
    return this.element !== undefined && this.element !== null;
  }

  map<R>(fn: (t: T) => R): Optional<R> {
    return this.exists() ? new Optional(fn(this.element)) : Optional.empty();
  }

  getOrElse(alternative: T): T {
    return this.exists() ? this.element : alternative;
  }

  static empty<R>(): Optional<R> {
    return new Optional(undefined);
  }
}
