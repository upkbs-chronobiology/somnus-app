import { arraysEqual } from './arrays';

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
