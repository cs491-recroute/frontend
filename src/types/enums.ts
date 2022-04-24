export enum OPERATIONS {
  eq = 'eq',
  ne = 'ne',
  gt = 'gt',
  lt = 'lt',
  gte = 'gte',
  lte = 'lte',
  includes = 'includes'
}

export enum STAGE_TYPE {
  FORM = 'FORM',
  TEST = 'TEST',
  INTERVIEW = 'INTERVIEW'
}

export enum QUESTION_TYPES {
  OPEN_ENDED = 'openEnded',
  MULTIPLE_CHOICE = 'multipleChoice',
  CODING = 'coding'
}

export const FORM_OPERATIONS = {
    STRING: ['eq', 'ne', 'includes'],
    NUMBER: ['eq', 'ne', 'gt', 'lt', 'gte', 'lte'],
    OPTION: ['eq', 'ne'],
    MULTIPLEOPTION: ['eq', 'ne', 'includes']
}

export const FORM_FIELDS  = {
    address: FORM_OPERATIONS.STRING,
    datePicker: FORM_OPERATIONS.STRING, //TODO: Change this based on data picker operations
    dropDown: FORM_OPERATIONS.OPTION,
    fullName: FORM_OPERATIONS.STRING,
    header: FORM_OPERATIONS.STRING,
    longText: FORM_OPERATIONS.STRING,
    multipleChoice: FORM_OPERATIONS.MULTIPLEOPTION,
    phone: FORM_OPERATIONS.STRING,
    shortText: FORM_OPERATIONS.STRING,
    singleChoice: FORM_OPERATIONS.OPTION,
    upload: FORM_OPERATIONS.STRING, //TODO: This will be removed because there is not any operation
    email: FORM_OPERATIONS.STRING,
    number: FORM_OPERATIONS.NUMBER
}
