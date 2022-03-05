type Basic = {
  _id: string;
}

export type Flow = {
  name: string;
  stages: Stage[];
} & Basic;

export type Stage = {
  name: string;
} & Basic;