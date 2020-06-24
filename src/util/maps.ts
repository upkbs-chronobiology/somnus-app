export function transformValues<K, V1, V2>(map: Map<K, V1>, transformation: (v: V1) => V2): Map<K, V2> {
  const mappedEntries: [K, V2][] = Array.from(map as Iterable<[K, V1]>)
    .map(([k, v]: [K, V1]) => {
      // TODO: Inline once we move to a newer TS version. This is necessary due to bad type inference for
      // destructed arrays, i.e. [A, B] becomes (A | B)[]. Related issue:
      // https://github.com/microsoft/TypeScript/issues/32465
      const transformed: [K, V2] = [k, transformation(v)];
      return transformed;
    });
  return new Map(mappedEntries);
}
