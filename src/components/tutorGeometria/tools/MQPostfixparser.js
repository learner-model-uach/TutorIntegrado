const MQPostfixparser = MQinfixInput => {
  const precedense = {
    sin: 4,
    cos: 4,
    "^": 3,
    "\\um": 3,
    "\\sqrt": 3,
    "\\cdot": 2,
    "\\frac": 2,
    "+": 1,
    "-": 1,
  };

  //here we define the functions, but it can be expanded to other cases
  const reservedWords = {
    "\\sqrt": "sqrt",
    sin: "sin",
    cos: "cos",
  };

  const operator = {
    "^": "^",
    "*": "*",
    "/": "/",
    "+": "+",
    "-": "-",
    "\\cdot": "*",
    "\\frac": "/",
  };
  const replaceAt = (word, index, replacement) => {
    return word.substring(0, index) + replacement + word.substring(index + replacement.length);
  };

  const MQinfixToPostfix = a => {
    a = a.replace(/\\right\)/g, ")");
    a = a.replace(/\\left\(/g, "(");
    a = a.replace(/}/g, ")");
    a = a.replace(/{/g, "(");
    var l = a.length;
    var literal = "";
    var numeric = "";
    var cOp = "";
    var stack = [];
    var output = "";
    //^:start of string,+:1 or more times,*:0 or more times,$:end of string,flag i:case insensetive
    var alphabet = new RegExp(/^[a-zA-Z]$/);
    var number = new RegExp(/^[0-9.]$/);
    for (let i = 0; i < l; i++) {
      if (alphabet.test(a[i])) {
        literal = literal + a[i];
        if (i == l - 1) output = output + " " + literal;
      } else if (typeof reservedWords[literal] != "undefined") {
        //if the literal word formed is a function push into operator stack
        stack.push(literal);
        literal = "";
      } else if (a[i].localeCompare("\\") == 0) {
        if (literal.length > 0) output = output + " " + literal;
        literal = "\\";
      } else {
        //if the literal word is not a function add it to the output
        if (literal.length > 0 && typeof operator[literal] == "undefined") {
          output = output + " " + literal;
          literal = "";
        }
      }
      if (number.test(a[i])) {
        numeric = numeric + a[i];
        if (i == l - 1) output = output + " " + numeric;
      } else {
        if (numeric.length > 0) {
          output = output + " " + numeric;
          numeric = "";
        }
      }
      if (typeof operator[a[i]] != "undefined" || typeof operator[literal] != "undefined") {
        if (typeof operator[a[i]] != "undefined") cOp = operator[a[i]];
        else {
          cOp = literal;
          literal = "";
        }
        if ("-".localeCompare(cOp) == 0 && l - i > 1) {
          if (
            i == 0 ||
            (i > 0 &&
              (typeof operator[a[i - 1]] != "undefined" || "(".localeCompare(a[i - 1]) == 0))
          ) {
            cOp = "\\um";
          }
        }
        while (
          stack.length != 0 && //if the stack has an operator
          "(".localeCompare(stack[stack.length - 1]) != 0 && //if the top operator is not (
          (precedense[stack[stack.length - 1]] > precedense[cOp] || //if the top operator has greater precedense
            false) //reserved same precedence and a[i] is left asociative
        )
          output = output + " " + stack.pop();
        stack.push(cOp);
      } else if (a[i].localeCompare("(") == 0) {
        if (stack.length > 0) {
          if ("\\frac".localeCompare(stack[stack.length - 1]) == 0) stack.push("prefixmark1");
          if ("prefixmark2".localeCompare(stack[stack.length - 1]) == 0) stack.pop();
        }
        stack.push("(");
      } else if (a[i].localeCompare(")") == 0) {
        while ("(".localeCompare(stack[stack.length - 1]) != 0) {
          //if the top operator is not
          if (stack.length > 0) output = output + " " + stack.pop();
        }
        if (stack.length > 0 && "(".localeCompare(stack[stack.length - 1]) == 0) stack.pop();
        if (stack.length > 0 && typeof reservedWords[stack[stack.length - 1]] != "undefined")
          output = output + " " + stack.pop();
        if (stack.length > 0 && "prefixmark1".localeCompare(stack[stack.length - 1]) == 0) {
          stack.pop();
          stack.push("prefixmark2");
        }
      }
    }
    while (stack.length > 0) {
      if ("(".localeCompare(stack[stack.length - 1]) != 0) output = output + " " + stack.pop();
    }
    return output;
  };

  return MQinfixToPostfix(MQinfixInput);
};
export default MQPostfixparser;
