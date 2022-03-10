import { STAGE_TYPE } from '../constants';

type Basic = {
  _id: string;
}

export type Flow = {
  name: string;
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  stages: Stage[];
} & Basic;

export type Stage = {
  type: STAGE_TYPE;
  stageID: string;
  startDate?: Date;
  endDate?: Date;
  stageProps: Record<string, any>;
} & Basic;

export type Form = {
  name: string;
} & Basic;