import { OPERATIONS, STAGE_TYPE, QUESTION_TYPES } from './enums';

type Basic = {
  _id: string;
}

export type Condition = {
  from: string;
  to: string;
  field?: string;
  operation: OPERATIONS;
  value: string;
} & Basic;

export type Flow = {
  name: string;
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  stages: Stage[];
  conditions: Condition[];
} & Basic;

export type Stage = {
  type: STAGE_TYPE;
  stageID: string;
  startDate?: Date;
  endDate?: Date;
  stageProps: Record<string, any>;
  testDuration?: number;
} & Basic;

export enum ComponentTypes {
  address = "address",
  datePicker = "datePicker",
  dropDown = "dropDown",
  fullName = "fullName",
  header = "header",
  longText = "longText",
  multipleChoice = "multipleChoice",
  phone = "phone",
  shortText = "shortText",
  singleChoice = "singleChoice",
  upload = "upload",
  email = "email"
}

export type Option = {
  value: string
} & Basic;

export type Component = {
  type: ComponentTypes;
  required: boolean;
  title: string;
  titles: string[];
  placeholder: string;
  placeholders: string[];
  options: Option[];
} & Basic;

export type Form = {
  name: string;
  components: Component[];
  flowID: string;
} & Basic;

export type Test = {
  name: string;
  questions: Question[];
  flowID: string;
} & Basic;

export type Question = {
  description: string;
  type: QUESTION_TYPES;
  options?: ({ description: string; isCorrect: boolean; } & Partial<Basic>)[];
  testCases?: ({ input: string; output: string; } & Partial<Basic>)[]
} & Basic;