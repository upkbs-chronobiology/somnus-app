export function enumAsArray<E>(Enum): E[] {
  return Object.keys(Enum).map(key => Enum[key]);
}
