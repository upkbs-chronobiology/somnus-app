import { decodeBase64, encodeBase64 } from '../util/strings';

export class Credentials {
  constructor(
    public name: string,
    public password: string,
  ) { }

  combine(): string {
    // "name:pw", base64 versions to avoid conflicts
    return `${encodeBase64(this.name)}:${encodeBase64(this.password)}`;
  }

  static fromCombined(combined: string): Credentials {
    const parts = combined.split(':');
    return new Credentials(decodeBase64(parts[0]), decodeBase64(parts[1]));
  }
}

export class Particulars extends Credentials {
}
