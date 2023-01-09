import { EventEnum } from './team-events-history.schema';

export interface TeamHistoryInterface {
  matchId: string;
  oponnent: string;
  oponnentId: string;
  result: string;
  date: Date;
}

export interface TeamEventsInterface {
  type: EventEnum;

  date: Date;

  msg: string;
}
