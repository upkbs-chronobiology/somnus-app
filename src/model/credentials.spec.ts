import { Credentials } from './credentials';

describe('credentials', () => {
  it('should serialize to and deserialize from string consistently', () => {
    const username = 'd3@dmäu5!.?:';
    const password = 'the🔑magic🔑key';
    const credentials = new Credentials(username, password);

    const serialized = credentials.combine();
    const deserialized = Credentials.fromCombined(serialized);

    expect(deserialized.name).toEqual(username);
    expect(deserialized.password).toEqual(password);
  });
});
