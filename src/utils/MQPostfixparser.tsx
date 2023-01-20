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
        'sqrt':'sqrt',
        'sin':'sin',
        'cos':'cos'
    }

    const operator = {
        '^':'^',
        '*':'*',
        '/':'/',
        '+':'+',
        '-':'-'
    }
    const replaceAt = (word:String,min:number, max:number,replacement:String) => {
        let fv=word.substring(0, min) + replacement + word.substring(max);
        return fv;
    }

    //method to add multiplications where regular notation assumes so,
    //example 1 : aa => a*a, example 2 : 3a => 3*a, example 3: (a)(a)=> (a)*(a), example 4: a(a)=> a*(a)
    const lazymath = (word:String)=>{
        let a=word;
        let l=a.length;
        let literal='';
        let alphabet = new RegExp(/^[a-zA-Z]$/);
        let number = new RegExp(/^[0-9.]$/);
        let replacePositions=[];
        for (let i=0; i<l; i++){
            let value=a[i];
            let lvalue;
            let rvalue;
            if(i>0){
                lvalue=a[i-1];
            }
            if(i<(l-1)){
                rvalue=a[i+1];
            }
            if(!value)continue;
            if (alphabet.test(value)) {
                literal=literal+value;
                if(i==(l-1)) replacePositions.push({i:i+1,lit:literal})
                if((i-1)>-1) {if(lvalue!=undefined && number.test(lvalue)) replacePositions.push({i:i,lit:" "});};
                if((i+1)<l) {if(rvalue!=undefined && number.test(rvalue)) replacePositions.push({i:i+1,lit:" "});};
            } else if (typeof reservedWords[literal as keyof typeof reservedWords]!="undefined") {
                literal="";
            } else {
                if(literal.length>1) replacePositions.push({i:i,lit:literal})
                literal="";
            }
            if (value.localeCompare("(")==0) {
                if((i-1)>-1) {if(lvalue!=undefined && (number.test(lvalue)||alphabet.test(lvalue))) replacePositions.push({i:i,lit:" "});};
                
            }
            if (value.localeCompare(")")==0) {
                if((i+1)<l) {if(rvalue!=undefined && (number.test(rvalue)||alphabet.test(rvalue))) replacePositions.push({i:i+1,lit:" "});};
            }
        }
        let acc=0;
        for (let i=0; i<replacePositions.length;i++) {      
            let lit=replacePositions[i]?.lit;
            let repPos=replacePositions[i];
            if(lit?.localeCompare(" ")!=0 && lit!=undefined){
                let llit=lit.length;
                let litAr=lit.split("");
                lit=litAr[0]!;
                for(let j=1; j<litAr.length;j++)lit=lit+"*"+litAr[j];
                if(repPos!=undefined)a=replaceAt(a,repPos.i-llit+acc,repPos.i+acc,lit);
                acc=acc+litAr.length-1;
            } else {
                if(repPos!=undefined)a=replaceAt(a,repPos.i+acc,repPos.i+acc,"*");
                acc=acc+1;
            }
            
        }
        return a;
    }

    //method to transform a word with fraction on latex notation to infix notation with /
    const fracctoInfix= (a:String)=>{
        let word=a;
        let l=word.length;
        let literal="";
        let alphabet = new RegExp(/^[a-zA-Z]$/);
        let stack=[];
        let replacePositions=[];
        //stack 1:first mark, 2:second mark, 18: (, 19: )
        for (let i=0; i<l; i++){
            let value=word[i]
            if(!value)continue;
            if (alphabet.test(value)) {
                literal=literal+value;
            } else if ("\\".localeCompare(value)==0) {
                literal="\\";
            } else if (literal.localeCompare("\\frac")==0) {
                stack.push(1);
                literal="";
            } else if (typeof reservedWords[literal as keyof typeof reservedWords]!="undefined") {
                literal="";
            } else {
                literal="";
            }
            if (value.localeCompare("(")==0){
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
            if (value.localeCompare(")")==0){
                while(stack.length>0 && 18!=stack[stack.length-1])stack.pop();
                if (stack.length>0 && 18==stack[stack.length-1]) stack.pop();
            }
        }
        for (let i=0; i<replacePositions.length;i++) {
            let value=replacePositions[i];
            if(!value)continue;
            word=replaceAt(word,value+i,value+i+1,"/(");
        }
        word=word.replace(/\\frac/g,"");
        return word;
    }

    const MQinfixToPostfix = (word:String) => {
        let a=word;
        a=a.replace(/\\right\)/g,")");
        a=a.replace(/\\left\(/g,"(");
        a=a.replace(/}/g,")");
        a=a.replace(/{/g,"(");
        a=a.replace(/\\cdot/g,"*");
        a=a.replace(/\\sqrt/g,"sqrt");
        if(a.search("frac")!=-1) a=fracctoInfix(a);
        a=lazymath(a);
        a=a.replace(/\)\(/g,")*(");
        let l=a.length;
        let literal="";
        let numeric="";
        let cOp="";
        let stack:Array<string>=[];
        let output="";
        //^:start of string,+:1 or more times,*:0 or more times,$:end of string,flag i:case insensetive
        let alphabet = new RegExp(/^[a-zA-Z]$/);
        let number = new RegExp(/^[0-9.]$/);
        for (let i=0; i<l; i++){
            let value=a[i]
            if(!value)continue;
            if (alphabet.test(value)) {
                literal=literal+value;
                if(i==(l-1)) output=output+" "+literal;
            } else if (typeof reservedWords[literal as keyof typeof reservedWords]!="undefined") {
                //if the literal word formed is a function push into operator stack
                stack.push(literal);
                literal="";
            } else {
                //if the literal word is not a function add it to the output
                if (literal.length>0 && typeof operator[literal as keyof typeof operator]=="undefined"){
                    output=output+" "+literal;
                    literal="";
                }
                    
            }
            if (number.test(value)) {
                numeric=numeric+value;
                if(i==(l-1)) output=output+" "+numeric;
            } else {
                if (numeric.length>0){
                    output=output+" "+numeric;
                    numeric="";
                }
            }
            if (typeof operator[value as keyof typeof operator]!="undefined" || typeof operator[literal as keyof typeof operator]!="undefined"){
                if (typeof operator[value as keyof typeof operator]!="undefined") cOp=operator[value as keyof typeof operator];
                else {
                    cOp=literal;
                    literal="";
                }
                if ("-".localeCompare(cOp)==0 && l-i>1){ //detecting if "-" is an unary operator
                    let leftvalue=a[i-1];
                    if(i==0 || (leftvalue!=undefined
                        && (i>0 && (typeof operator[leftvalue as keyof typeof operator]!="undefined"
                            || "(".localeCompare(leftvalue)==0)
                        ))
                    ){
                        cOp="\\um"
                    }
                }
                let skip=true;
                while(stack.length>0 //if the stack has an operator
                    && skip
                    && ( //if the top operator has greater precedense
                        precedense[stack[stack.length-1] as keyof typeof precedense]>precedense[cOp as keyof typeof precedense]
                        ||
                        (//if they have same precedense
                            (precedense[stack[stack.length-1] as keyof typeof precedense]==precedense[cOp as keyof typeof precedense])
                        &&//if current operator is left associative
                            (typeof associativity[value as keyof typeof associativity]!="undefined"?(associativity[value as keyof typeof associativity]=='left'):false) 
                        )
                    )
                    ){
                        let leftvalue=stack[stack.length-1]
                        //if the top operator is not "("
                        if(leftvalue!=undefined && ("(".localeCompare(leftvalue)!=0))output=output+" "+stack.pop();
                        else skip=false
                    }
                stack.push(cOp);
            } else if (value.localeCompare("(")==0) {
                stack.push("(");
            }else if (value.localeCompare(")")==0) {
                let skip=true;
                while(stack.length>0 && skip)
                {
                    let leftvalue=stack[stack.length-1]
                    //if the top operator is not "(" 
                    if(leftvalue!=undefined && "(".localeCompare(leftvalue)!=0) output=output+" "+stack.pop();
                    else{skip=false}
                }
                let leftvalue=stack[stack.length-1]
                if (stack.length>0 && leftvalue!=undefined && "(".localeCompare(leftvalue)==0) stack.pop();
                if (stack.length>0 && typeof reservedWords[stack[stack.length-1] as keyof typeof reservedWords]!="undefined") output=output+" "+stack.pop();
            }
        }
        let skip=true;
        while(stack.length>0 && skip){
            let leftvalue=stack[stack.length-1]
            if(leftvalue!=undefined && "(".localeCompare(leftvalue)!=0) output=output+" "+stack.pop();
            else skip=false;
        }
        return output;
    }

    return MQinfixToPostfix(MQinfixInput);
}
export default MQPostfixparser;