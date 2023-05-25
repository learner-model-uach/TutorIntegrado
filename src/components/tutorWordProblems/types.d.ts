export interface Exercise {
  code:              string;
  type:              string;
  title:             string;
  presentationImg:   string;
  learningObjetives: string;
  meta:              Meta;
  statement:         string;
  mathExpression:    string | undefined
  img:               string | undefined
  table:             Table | undefined
  questions:         Question[];
}

export interface Meta {
}

export interface Question {
  tip:      string;
  question: string;
  steps:    Step[];
}

export interface Step {
  stepId:            number;
  stepTitle:         string;
  componentToAnswer: string;
  kcs:               string[];
  hints:             Hint[];
}

export interface Hint {
  hintId: number;
  hint:   string;
}

export interface Table {
  header: string[];
  rows:   Row[];
}

export interface Row {
  row1: string[];
}
