const MQPostfixSolver = (MQPostfixExpression:string,ValuesObject:object[]) => {
    const value = {"name":String,"value":Number};

    const valueReplace = (input:string,values:typeof value[]) => {
        let l = values.length;
        let output=input;
        for (let i=0;i<l;i++) output=output.replaceAll(" "+values[i]!.name," "+values[i]!.value);
        return output;
    }

    const solveExpresion = (expression:String) => {
        var exp=expression.split(" ");
        var stack:number[]=[];
        var alphabet = new RegExp(/^[a-zA-Z]$/);
        var number = new RegExp(/^[0-9]+[.0-9]*$/);
        for (let i=0;i<exp.length;i++){
            if (exp[i]!.length==1 && alphabet.test(exp[i]!)){
                stack.push(1);
            } else if(number.test(exp[i]!)){
                stack.push(parseFloat(exp[i]!));
            } else {
                if(exp[i]!.localeCompare("/")==0){
                    let a:number = stack.pop()!;
                    let b:number = stack.pop()!;
                    stack.push(b/a);
                } else if (exp[i]!.localeCompare("*")==0) {
                    let a:number = stack.pop()!;
                    let b:number = stack.pop()!;
                    stack.push(b*a);
                } else if (exp[i]!.localeCompare("sqrt")==0 ) {
                    let a:number = stack.pop()!;
                    stack.push(Math.sqrt(a));
                } else if (exp[i]!.localeCompare("sin")==0 ) {
                    let a:number = stack.pop()!;
                    stack.push(Math.sin(a));                    
                } else if (exp[i]!.localeCompare("cos")==0 ) {
                    let a:number = stack.pop()!;
                    stack.push(Math.cos(a));                    
                } else if (exp[i]!.localeCompare("^")==0 ) {
                    let a:number = stack.pop()!;
                    let b:number = stack.pop()!;
                    stack.push(b**a);                    
                } else if (exp[i]!.localeCompare("+")==0 ) {
                    let a:number = stack.pop()!;
                    let b:number = stack.pop()!;
                    stack.push(b+a);                    
                } else if (exp[i]!.localeCompare("-")==0 ) {
                    let a:number= stack.pop()!;
                    let b:number = stack.pop()!;
                    stack.push(b-a);                    
                } else if (exp[i]!.localeCompare("\\um")==0) {
                    let a:number= stack.pop()!;
                    stack.push(-a);
                }
            }
        }
        return stack[0];
    }

    const solve = (input:string,values:typeof value[]) => {
        let a=input;
        if(values!=undefined && values.length>0) a=valueReplace(a,values);
        return solveExpresion(a.substring(1));
    }

    return solve(MQPostfixExpression,ValuesObject as typeof value[]);
} 
export default MQPostfixSolver;