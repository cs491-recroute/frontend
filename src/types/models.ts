import { OPERATIONS, STAGE_TYPE, QUESTION_TYPES } from './enums';

type Basic = {
  _id: string;
}

export type Condition = {
  from: string;
  to: string;
  field?: string;
  operation: OPERATIONS;
  value: any;
} & Basic;

export type Flow = {
  name: string;
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  stages: Stage[];
  conditions: Condition[];
  applicants?: string[];
  favorite: boolean;
  archived: boolean;
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
  email = "email",
  number = "number"
}

export type Option = {
  description: string
} & Partial<Basic>;

export type Component = {
  name: string;
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

export type Interview = {
  name: string;
  interviewLengthInMins: number;
  breakLengthInMins: number;
} & Basic;

export type Question = {
  name: string;
  description: string;
  type: QUESTION_TYPES;
  options?: ({ description: string; isCorrect: boolean; } & Partial<Basic>)[];
  testCases?: ({ input: string; output: string; points: number } & Partial<Basic>)[],
  points?: number;
  categoryID: string;
} & Basic;

export type Category = {
  name: string;
} & Basic;

export type User = {
  name: string,
  email: string,
  company: { name: string, isLinked: boolean },
  //profileImage: Buffer,
  roles: ROLES[],
  availableTimes: TimeSlot[]
} & Basic;

export type Interviewer = {
  name: string
} & Basic;

export enum ROLES {
  USER = "user",
  ADMIN = "admin"
}

export interface TimeSlot {
  startTime: string,
  durationInMins: number
}