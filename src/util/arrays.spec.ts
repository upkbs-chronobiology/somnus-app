import { arraysEqual, groupArray, indexBy } from './arrays';

describe('arraysEqual', () => {
  it('should match empty arrays', () => {
    expect(arraysEqual([], [])).toBeTruthy();
  });

  it('should match corresponding non-empty arrays', () => {
    expect(arraysEqual(['foo', 1, 2, 3], ['foo', 1, 2, 3])).toBeTruthy();
  });

  it('should distinguish arrays of different lengths', () => {
    expect(arraysEqual([], ['foo'])).toBeFalsy();
    expect(arraysEqual([1], [])).toBeFalsy();
    expect(arraysEqual(['foo', 1, 2, 3], ['foo', 1, 2])).toBeFalsy();
  });

  it('should distinguish arrays with different item orders', () => {
    expect(arraysEqual(['foo', 1, 2, 3], ['foo', 3, 2, 1])).toBeFalsy();
  });

  it('should distinguish arrays with different contents', () => {
    expect(arraysEqual(['foo'], ['asdf'])).toBeFalsy();
  });

  it('should correctly handle undefined/null cases', () => {
    expect(arraysEqual(['foo'], null)).toBeFalsy();
    expect(arraysEqual(null, ['foo'])).toBeFalsy();
    expect(arraysEqual(['foo'], undefined)).toBeFalsy();
    expect(arraysEqual(undefined, ['foo'])).toBeFalsy();
    expect(arraysEqual([], null)).toBeFalsy();
    expect(arraysEqual(undefined, [])).toBeFalsy();
    expect(arraysEqual(undefined, undefined)).toBeTruthy();
    expect(arraysEqual(null, null)).toBeTruthy();
  });
});

describe('groupArray', () => {
  it('should map an empty array to an empty object', () => {
    expect(groupArray([], x => '')).toEqual({});
  });

  it('should correctly group an array', () => {
    expect(groupArray(['foo', 'bar', 'baz'], word => word.substring(0, 1)))
      .toEqual({
        'f': ['foo'],
        'b': ['bar', 'baz']
      });
  });
});

describe('indexBy', () => {
  it('should map an empty array to an empty object', () => {
    expect(indexBy([], x => '')).toEqual(new Map());
  });

  it('should correctly index an array by a string', () => {
    expect(indexBy(['foo', 'bar', 'baz'], word => word.substring(0, 1)))
      .toEqual(new Map(Object.entries({
        'f': ['foo'],
        'b': ['bar', 'baz']
      })));
  });

  it('should correctly index an array by a number', () => {
    expect(indexBy<number, string>(['foo', 'baar', 'baz'], word => word.length))
      .toEqual(new Map(Object.entries({
        3: ['foo', 'baz'],
        4: ['baar']
      }).map(([a, b]) => [parseInt(a), b])));
  });
});
