const MQPostfixparser = (MQinfixInput:string) => {

    //precedence and associativity defined by a table in https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
    //obtained at 2022/11/21 16:15 GMT-3
    const precedense = {
        'sin':17,
        'cos':17,
        'sqrt':17,
        '\\um':14,
        '^':13,
        '*':12,
        '/':12,
        '+':11,
        '-':11
    }

    const associativity ={
        '^':'right',
        '*':'left',
        '/':'left',
        '+':'left',
        '-':'left'
    }

    //here we define the functions, but it can be expanded to other cases
    const reservedWords = {
        "sqrt":'sqrt',
        "sin":'sin',
        "cos":'cos'
    }

    const operator = {
        '^':'^',
        '*':'*',
        '/':'/',
        '+':'+',
        '-':'-'
    }
    const replaceAt = (word,min, max,replacement) => {
        let fv=word.substring(0, min) + replacement + word.substring(max);
        return fv;
    }

    //method to add multiplications where regular notation assumes so,
    //example 1 : aa => a*a, example 2 : 3a => 3*a, example 3: (a)(a)=> (a)*(a), example 4: a(a)=> a*(a)
    const lazymath = (word)=>{
        let a=word;
        let l=a.length;
        let literal="";
        var alphabet = new RegExp(/^[a-zA-Z]$/);
        var number = new RegExp(/^[0-9.]$/);
        let replacePositions=[];
        for (let i=0; i<l; i++){
            if (alphabet.test(a[i])) {
                literal=literal+a[i];
                if(i==(l-1)) replacePositions.push({i:i+1,lit:literal})
                if((i-1)>-1) {if(number.test(a[i-1])) replacePositions.push({i:i,lit:" "});};
                if((i+1)<l) {if(number.test(a[i+1])) replacePositions.push({i:i+1,lit:" "});};
            } else if (typeof reservedWords[literal]!="undefined") {
                literal="";
            } else {
                if(literal.length>1) replacePositions.push({i:i,lit:literal})
                literal="";
            }
            if (a[i].localeCompare("(")==0) {
                if((i-1)>-1) {if(number.test(a[i-1])||alphabet.test(a[i-1])) replacePositions.push({i:i,lit:" "});};
                
            }
            if (a[i].localeCompare(")")==0) {
                if((i+1)<l) {if(number.test(a[i+1])||alphabet.test(a[i+1])) replacePositions.push({i:i+1,lit:" "});};
            }
        }
        let acc=0;
        for (let i=0; i<replacePositions.length;i++) {
            let lit=replacePositions[i].lit;
            if(lit.localeCompare(" ")!=0){
                let llit=lit.length;
                let litAr=lit.split("");
                lit=litAr[0]
                for(let j=1; j<litAr.length;j++)lit=lit+"*"+litAr[j];
                a=replaceAt(a,replacePositions[i].i-llit+acc,replacePositions[i].i+acc,lit);
                acc=acc+litAr.length-1;
            } else {
                a=replaceAt(a,replacePositions[i].i+acc,replacePositions[i].i+acc,"*");
                acc=acc+1;
            }
        }
        return a;
    }

    //method to transform a word with fraction on latex notation to infix notation with /
    const fracctoInfix= (a)=>{
        let word=a;
        let l=word.length;
        let literal="";
        var alphabet = new RegExp(/^[a-zA-Z]$/);
        let stack=[];
        let replacePositions=[];
        //stack 1:first mark, 2:second mark, 18: (, 19: )
        for (let i=0; i<l; i++){
            if (alphabet.test(word[i])) {
                literal=literal+word[i];
            } else if ("\\".localeCompare(word[i])==0) {
                literal="\\";
            } else if (literal.localeCompare("\\frac")==0) {
                stack.push(1);
                literal="";
            } else if (typeof reservedWords[literal]!="undefined") {
                literal="";
            } else {
                literal="";
            }
            if (word[i].localeCompare("(")==0){
                if(stack[stack.length-1]==2){
                    stack.pop();
                    replacePositions.push(i);
                }
                if(stack[stack.length-1]==1){
                    stack.pop();
                    stack.push(2);
                }
                stack.push(18);
            }
            if (word[i].localeCompare(")")==0){
                while(18!=stack[stack.length-1]) if(stack.length>0) stack.pop();
                if (stack.length>0 && 18==stack[stack.length-1]) stack.pop();
            }
        }
        for (let i=0; i<replacePositions.length;i++) word=replaceAt(word,replacePositions[i]+i,replacePositions[i]+i+1,"/(");
        word=word.replace(/\\frac/g,"");
        return word;
    }

    const MQinfixToPostfix = (word:string) => {
        var a=word;
        a=a.replace(/\\right\)/g,")");
        a=a.replace(/\\left\(/g,"(");
        a=a.replace(/}/g,")");
        a=a.replace(/{/g,"(");
        a=a.replace(/\\cdot/g,"*");
        a=a.replace(/\\sqrt/g,"sqrt");
        if(a.search("frac")!=-1) a=fracctoInfix(a);
        a=lazymath(a);
        a=a.replace(/\)\(/g,")*(");
        var l=a.length;
        var literal="";
        var numeric="";
        var cOp="";
        var stack=[];
        var output="";
        //^:start of string,+:1 or more times,*:0 or more times,$:end of string,flag i:case insensetive
        var alphabet = new RegExp(/^[a-zA-Z]$/);
        var number = new RegExp(/^[0-9.]$/);
        for (let i=0; i<l; i++){
            if (alphabet.test(a[i])) {
                literal=literal+a[i];
                if(i==(l-1)) output=output+" "+literal;
            } else if (typeof reservedWords[literal]!="undefined") {
                //if the literal word formed is a function push into operator stack
                stack.push(literal);
                literal="";
            } else {
                //if the literal word is not a function add it to the output
                if (literal.length>0 && typeof operator[literal]=="undefined"){
                    output=output+" "+literal;
                    literal="";
                }
                    
            }
            if (number.test(a[i])) {
                numeric=numeric+a[i];
                if(i==(l-1)) output=output+" "+numeric;
            } else {
                if (numeric.length>0){
                    output=output+" "+numeric;
                    numeric="";
                }
            }
            if (typeof operator[a[i]]!="undefined" || typeof operator[literal]!="undefined"){
                if (typeof operator[a[i]]!="undefined") cOp=operator[a[i]];
                else {
                    cOp=literal;
                    literal="";
                }
                if ("-".localeCompare(cOp)==0 && l-i>1){ //detecting if "-" is an unary operator
                    if(i==0 || i>0 && (typeof operator[a[i-1]]!="undefined" || "(".localeCompare(a[i-1])==0)){
                        cOp="\\um"
                    } 
                }
                while(stack.length!=0 //if the stack has an operator
                    && "(".localeCompare(stack[stack.length-1])!=0 //if the top operator is not "("
                    && (
                        precedense[stack[stack.length-1]]>precedense[cOp] //if the top operator has greater precedense
                        ||
                        ((precedense[stack[stack.length-1]]==precedense[cOp]) //if they have same precedense
                        &&
                        (typeof associativity[a[i]]!="undefined"?(associativity[a[i]]=='left'):false) //if current operator is left associative
                        )
                    )
                    )output=output+" "+stack.pop();
                stack.push(cOp);
            } else if (a[i].localeCompare("(")==0) {
                stack.push("(");
            }else if (a[i].localeCompare(")")==0) {
                while("(".localeCompare(stack[stack.length-1])!=0) //if the top operator is not "(" 
                {
                    if(stack.length>0) output=output+" "+stack.pop();
                }
                if (stack.length>0 && "(".localeCompare(stack[stack.length-1])==0) stack.pop();
                if (stack.length>0 && typeof reservedWords[stack[stack.length-1]]!="undefined") output=output+" "+stack.pop();
            }
        }
        while(stack.length>0){
            if("(".localeCompare(stack[stack.length-1])!=0) output=output+" "+stack.pop();
        }
        return output;
    }

    return MQinfixToPostfix(MQinfixInput);
}
export default MQPostfixparser;