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
} & Basic;

export enum ComponentTypes { 
  address = "address", 
  datePicker = "datePicker", 
  dropdown = "dropDown", 
  fullName = "fullName",
  header = "header",
  longText = "longText",
  multipleChoice = "multipleChoice",
  phone = "phone",
  shortText = "shortText",
  singleChoice = "singleChoice",
  upload = "upload"
}

export interface Option {
  key: number,
  value: string
}

export type Component = {
  type: ComponentTypes;
  required: boolean;
  title: string;
  titles: string[];
  placeholder: string;
  placeholders: string[];
  options: Option[];
}

export type Form = {
  name: string;
  components: Component[] 
} & Basic;

export type Test = {
  name: string;
  questions: Question[];
} & Basic;

export type Question = {
  description: string;
  type: QUESTION_TYPES;
  options?: { description: string; isCorrect: boolean; }[];
  testCases?: { input: string; output: string; }
} & Basic;