export class Credentials {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) { }
}

export class Particulars extends Credentials {
}
