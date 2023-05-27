import type { type } from "os";

export interface Exercise {
  code:              string;
  type:              string;
  presentation:      Presentation;
  learningObjetives: LearningObjetives;
  meta:              Meta;
  statement:         string;
  mathExpression:    string;
  img:               string;
  table:             Table;
  questions:         Question[];
}

export interface LearningObjetives {
  title:   string;
  text:    string;
  listObj: string[];
}

export interface Meta {
}

export interface Presentation {
  title:  string;
  urlImg: string;
}

export interface Question {
  question: string;
  tip:      string;
  steps:    Step[];
}

export interface Step {
  stepId:            number;
  stepTitle:         string;
  componentToAnswer: componentToAnswer;
  kcs:               string[];
  hints:             Hint[];
}

export interface Hint {
  hintId: number;
  hint:   string;
}

export interface Table {
  header: Header[];
  rows:   Row[];
  tableCaption: string;
}

export interface Header {
  align: string;
  value: string;
}

export interface Row {
  data: string[];
}

export type align = "right" | "left" | "center" | "justify" | "char"

enum componentToAnswer{
  ML = "mathlive",
  SL = 'selection',
  cp2 = "componente2"
}
