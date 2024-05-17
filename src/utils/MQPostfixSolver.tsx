import MQProxy from "../components/lvltutor/Tools/MQProxy";

interface value {
  name: String;
  value: Number;
}

interface values {
  values: Array<value>;
}

const valueReplace = (input: string, values: values) => {
  let l = values.values.length;
  let output = input;
  for (let i = 0; i < l; i++) {
    let value = values.values[i];
    if (!value) continue;
    output = output.replaceAll(" " + value.name, " " + value.value);
  }
  return output;
};

const solveExpresion = (expression: String) => {
  let exp = expression.split(" ");
  let stack: number[] = [];
  let alphabet = new RegExp(/^[a-zA-Z]$/);
  let number = new RegExp(/^[0-9]+[.0-9]*$/);
  for (let i = 0; i < exp.length; i++) {
    let value = exp[i];
    if (!value) continue;
    if (value.length == 1 && alphabet.test(value)) {
      stack.push(1);
    } else if (number.test(value)) {
      stack.push(parseFloat(value));
    } else {
      if (value.localeCompare("/") == 0) {
        let a: number = stack.pop()!;
        let b: number = stack.pop()!;
        stack.push(b / a);
      } else if (value.localeCompare("*") == 0) {
        let a: number = stack.pop()!;
        let b: number = stack.pop()!;
        stack.push(b * a);
      } else if (value.localeCompare("sqrt") == 0) {
        let a: number = stack.pop()!;
        stack.push(Math.sqrt(a));
      } else if (value.localeCompare("sin") == 0) {
        let a: number = stack.pop()!;
        stack.push(Math.sin(a));
      } else if (value.localeCompare("cos") == 0) {
        let a: number = stack.pop()!;
        stack.push(Math.cos(a));
      } else if (value.localeCompare("^") == 0) {
        let a: number = stack.pop()!;
        let b: number = stack.pop()!;
        stack.push(b ** a);
      } else if (value.localeCompare("+") == 0) {
        let a: number = stack.pop()!;
        let b: number = stack.pop()!;
        stack.push(b + a);
      } else if (value.localeCompare("-") == 0) {
        let a: number = stack.pop()!;
        let b: number = stack.pop()!;
        stack.push(b - a);
      } else if (value.localeCompare("\\um") == 0) {
        let a: number = stack.pop()!;
        stack.push(-a);
      } else if (value.localeCompare("√") == 0) {
        let a: number = stack.pop()!;
        let b: number = stack.pop()!;
        stack.push(Math.pow(a, 1 / b));
      }
    }
  }
  MQProxy.finishedEval = stack.length == 1 ? true : false;
  return stack[0];
};

const solve = (input: string, values: values | undefined) => {
  let a = input;

  if (values != undefined && values.values.length > 0) a = valueReplace(a, values as values);
  return solveExpresion(a.substring(1));
};

const MQPostfixSolver = (MQPostfixExpression: string, ValuesObject: values | undefined) => {
  return solve(MQPostfixExpression, ValuesObject);
};

export default MQPostfixSolver;
