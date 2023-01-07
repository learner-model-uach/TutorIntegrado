export interface value{"name":string;"value":number;};
export interface hint{ "hintId": number; "hint": string ;};
export interface matchingError{"error": Array<string>;"hintId":number;"hint": string;};
export interface answer{ "answer":  Array<string>; "nextStep": string ;};

export interface Step{
    "stepId": string;
    "KCs":Array<string>;
    "expression": string;
    "stepTitle": string;
    "displayResult": Array<string>;
    "values":Array<value>;
    "hints": Array<hint>;
    "matchingError"?:Array<matchingError>;
    "answers": Array<answer>;
    "incorrectMsg": string;
    "correctMsg": string;
    "summary": string;
};

export interface ExType{
    "code": string;
    "meta": {};
    "title": string;
    "text": string;
    "type": string;
    "steps": Array<Step>;
};