export enum PlayerRoles {
  MID = 'MID',
  TOP = 'TOP',
  JUNGLE = 'JUNGLE',
  BOT = 'BOT',
  SUPPORT = 'SUPPORT',
}

export class UserDetails {
  firstname: string;
  country: string;
  avatar: string;
  about: string;
  preferredRoles: PlayerRoles[];

  public constructor() {
    this.firstname = '';
    this.country = '';
    this.avatar = null;
    this.about = '';
    this.preferredRoles = [];
  }
}
