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
  name: string;
} & Basic;

export type Form = {
  name: string;
} & Basic;