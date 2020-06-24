import { transformValues } from './maps';

describe('transformValues', () => {
  it('should transform values', () => {
    const map = new Map(Object.entries({
      'aa': 'foo',
      'bb': 'bar'
    }));

    const transformed = transformValues(map, s => s + '2');

    expect(transformed).toEqual(new Map(Object.entries({
      'aa': 'foo2',
      'bb': 'bar2'
    })));
  });
});
