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
  about: string;
  preferredRoles: PlayerRoles[];

  lookingForTeam: boolean;

  public constructor() {
    this.firstname = '';
    this.country = '';
    this.about = '';
    this.preferredRoles = [];
    this.lookingForTeam = true;
  }
}
