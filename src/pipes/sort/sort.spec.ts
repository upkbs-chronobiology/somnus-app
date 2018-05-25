import { SortPipe } from './sort';

describe('sort pipe', () => {

  let pipe: SortPipe;

  beforeAll(() => {
    pipe = new SortPipe();
  });

  it('should sort string arrays case-insensitively', () => {
    expect(pipe.transform(['foo', 'bar', 'Baz', '<test>']))
      .toEqual(['<test>', 'bar', 'Baz', 'foo']);
  });
});
