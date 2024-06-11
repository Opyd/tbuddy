import { EventEnum } from './team-events-history.schema';

export interface TeamHistoryInterface {
  matchId: string;
  opponent: string;
  result: string;
  date: Date;
}

export interface TeamEventsInterface {
  type: EventEnum;

  date: Date;

  msg: string;
}
