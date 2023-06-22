
export interface Exercise {
  code:              string;
  type:              string;
  presentation:      Presentation;
  learningObjetives: LearningObjetives;
  meta:              Meta;
  statement:         string;
  mathExpression?:    string;
  img?:               string;
  table?:             Table;
  text?:              string;
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
  tip?:        string;
  steps:      Step[];
}

export interface Step {
  stepId:            number;
  stepTitle:         string;
  componentToAnswer: ComponentToAnswer;
  kcs:               string[];
  hints:             Hint[];
  explanation?:      string;
}

export interface Hint {
  hintId: number;
  hint:   string;
  associatedAnswer?: number[];
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
  meta:          SelectionMeta| MathComponentMeta | GraphMeta ;
}
export enum components{
  MLC = "mathComponent",
  SLC = 'selectionComponent',
  GHPC = "graphComponent"
}

export interface SelectionMeta {
  id:            number;
  answers:       SelectionAnswer[];
  correctAnswer: number;
  userSelectedAnswer?: number,
  isCorrectUserAnswer?: boolean
}
interface SelectionAnswer{
  id: number
  value: string
}
export interface MathComponentMeta{
  id: number
  type?: string
  expression: string
  answers: MathCompAnswer[]
  correctAnswer: number[]
}

interface MathCompAnswer{
  id: number
  value: string
}
interface GraphMeta{
  name: string
}



