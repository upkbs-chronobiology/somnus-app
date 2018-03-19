export class User {
  constructor(
    public readonly name: string,
    public readonly role: string,
    public readonly id: number = 0,
  ) { }
}
