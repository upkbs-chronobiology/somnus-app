export enum Role {
  Admin = 'admin',
  Researcher = 'researcher'
}

export class Roles {
  static isEditor(role: Role): boolean {
    return role === Role.Admin || role === Role.Researcher;
  }
}
