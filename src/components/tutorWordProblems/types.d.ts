export interface wpExercise {
  code: string;
  type: string;
  presentation?: Presentation;
  learningObjetives?: LearningObjetives;
  statement: string;
  mathExpression?: string;
  img?: string;
  table?: Table;
  text?: string;
  questions: Question[];
  kcs: Object[];
}

export interface LearningObjetives {
  title?: string;
  text?: string;
  listObj?: string[];
}

export interface Presentation {
  title?: string;
  urlImg?: string;
  description?: string;
}

export interface Question {
  questionId: number;
  question: string;
  quesExplanation?: string;
  steps: Step[];
  isBlocked: boolean;
}

export interface Step {
  stepId: number;
  stepTitle: string;
  stepExplanation?: {
    explanation: string;
    srcImg?: string;
  };
  componentToAnswer: ComponentToAnswer;
  kcs: string[];
  hints: Hint[];
  stepGuideText?: string;
  correctMsg?: string;
  isBlocked: boolean;
}

export interface Hint {
  hintId: number;
  hint: string;
  associatedAnswer?: number[];
  selectionPointHint?: selectionPointHint;
  linearFitHint?: linearFitHint;
}

export interface selectionPointHint {
  point1: number[];
  point2: number[];
}
export interface linearFitHint {}

export interface Table {
  header: Header[];
  rows: Row[];
  alignRows: textAlign;
  tableCaption: string;
}

export interface Header {
  align: string;
  value: string;
}

export interface Row {
  data: string[] | number[];
}
export type textAlign = "left" | "right" | "center" | "justify" | "end" | "start";

export interface ComponentToAnswer {
  nameComponent: string;
  meta: SelectionMeta | MathComponentMeta | GraphMeta;
}
export enum components {
  MLC = "mathComponent",
  SLC = "selectionComponent",
  GHPC = "graphComponent",
}

export interface SelectionMeta {
  answers: SelectionAnswer[];
  idCorrectAnswers: number;
}
interface SelectionAnswer {
  id: number;
  value: string;
}
export interface MathComponentMeta {
  //id: number
  readonly?: boolean;
  expression: string;
  answers: MathCompAnswer[];
  idCorrectAnswers: number[];
}

interface MathCompAnswer {
  id: number;
  placeholderId: string;
  value: string;
}
interface GraphMeta {
  component: graphComponents;
  metaComponent?: selectPointerMeta | linearFitMeta;
}

interface linearFitMeta {
  data: point[];
  graphSettings: settings;
  linearFunction: {
    m: {
      value?: number;
      slider?: slider;
    };
    b: {
      value?: number;
      slider?: slider;
    };
  };
  correctAnswer: {
    mCorrect?: number[];
    bCorrect?: number[];
  };
}

interface slider {
  startPoint: number[];
  endPoint: number[];
  min: number;
  max: number;
  initialValue: number;
  snapWidth: number;
  precision: number;
  name: string;
}

interface settings {
  originAxis?: boolean;
  bounding?: bounding;
  maxBounding?: bounding;
  newAxis?: axisSettings;
  activeZoom: boolean;
}
interface axisSettings {
  xAxis: Axis;
  yAxis: Axis;
}
interface Axis {
  point1: number[];
  point2: number[];
  tiksDistance: number;
  stickOffset: number[];
  stickFontSize: number;
  labelName: string;
  labelOffset: number[];
  labelFontSize: number;
}
interface bounding {
  X1: number;
  Y1: number;
  X2: number;
  Y2: number;
}
interface selectPointerMeta {
  data: point[];
  correctPoint: number[];
  graphSettings: settings;
}
interface point {
  coord: number[];
  name?: string;
  color?: string;
  isStatic?: boolean;
  face?: facePoint;
}
export enum facePoint {
  cross = "cross",
  circle = "circle",
  square = "square",
  plus = "plus",
}
export enum graphComponents {
  selectPoint = "selectPoint",
  linearFit = "linearFit",
}

export enum AlertStatus {
  success = "success",
  error = "error",
  warning = "warning",
  info = "info",
}
