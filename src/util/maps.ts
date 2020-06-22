export function transformValues<K, V1, V2>(map: Map<K, V1>, transformation: (v: V1) => V2): Map<K, V2> {
  return new Map(
    // FIXME: 'unknown' conversion shouldn't be necessary
    Array.from(map as unknown as Iterable<[K, V1]>)
      .map(([k, v]) => [k, transformation(v)])
  );
}
