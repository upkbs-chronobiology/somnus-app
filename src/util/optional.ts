export class Optional<T> {

  constructor(private element: T) {
  }

  exists(): boolean {
    return this.element !== undefined && this.element !== null;
  }

  map<R>(fn: (element: T) => R): Optional<R> {
    return this.exists() ? new Optional(fn(this.element)) : Optional.empty();
  }

  flatMap<R>(fn: (element: T) => Optional<R>): Optional<R> {
    return this.map(fn).map(optional => optional.get());
  }

  get(): T {
    return this.element;
  }

  getOrElse(alternative: T): T {
    return this.exists() ? this.element : alternative;
  }

  static empty<R>(): Optional<R> {
    return new Optional(undefined);
  }
}
