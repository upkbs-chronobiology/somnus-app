import { Role } from './role';

export class User {
  constructor(
    public readonly name: string,
    public readonly role: Role,
    public readonly id: number = 0,
  ) { }
}
