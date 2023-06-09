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
  text:              string;
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
  questionId: number;
  question:   string;
  tip:        string;
  steps:      Step[];
}

export interface Step {
  stepId:            number;
  stepTitle:         string;
  componentToAnswer: ComponentToAnswer;
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

export interface ComponentToAnswer {
  nameComponent: string;
  meta:          SelectionMeta| MathLiveMeta | GraphMeta ;
}
export enum components{
  MLC = "mathlive",
  SLC = 'selection',
  GHPC = "graph"
}

export interface SelectionMeta {
  id:            number;
  answers:       string[];
  correctAnswer: number;
  userSelectedAnswer?: number,
  isCorrectUserAnswer?: boolean
}
interface MathLiveMeta{
  id: number
}
interface GraphMeta{
  name: string
}



