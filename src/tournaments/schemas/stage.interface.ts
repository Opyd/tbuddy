import { MatchInterface } from './match.interface';

export interface StageInterface {
  finished: boolean;

  stageNr: number;

  matches: MatchInterface[];
}
