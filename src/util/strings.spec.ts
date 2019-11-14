import { decodeBase64, encodeBase64 } from '../util/strings';

describe('strings', () => {
  it('should serialize to and deserialize from unicode consistently', () => {
    const before = 'foo bar 👌😂🔫 ,,?';
    expect(decodeBase64(encodeBase64(before))).toEqual(before);
  });
});
