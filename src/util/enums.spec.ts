import { enumAsArray } from './enums';

enum SampleEnum {
  Foo = 'fooString',
  Bar = 'barString'
}

describe('enumAsArray', () => {
  it('should create an array of items from an enum', () => {
    const array = enumAsArray(SampleEnum);

    expect(array.length).toBe(2);
    expect(array).toContain(SampleEnum.Foo);
    expect(array).toContain(SampleEnum.Bar);
  });
});
