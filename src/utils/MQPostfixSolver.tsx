const MQPostfixSolver = (MQPostfixExpression:string,ValuesObject:object[]) => {
    const value = {"name":String,"value":Number};

    const valueReplace = (input:string,values:typeof value[]) => {
        let l = values.length;
        let output=input;
        for (let i=0;i<l;i++) {
            let value=values[i];
            if(!value)continue;
            output=output.replaceAll(" "+value.name," "+value.value);
        }
        return output;
    }

    const solveExpresion = (expression:String) => {
        let exp=expression.split(" ");
        let stack:number[]=[];
        let alphabet = new RegExp(/^[a-zA-Z]$/);
        let number = new RegExp(/^[0-9]+[.0-9]*$/);
        for (let i=0;i<exp.length;i++){
            let value=exp[i];
            if(!value)continue;
            if (value.length==1 && alphabet.test(value)){
                stack.push(1);
            } else if(number.test(value)){
                stack.push(parseFloat(value));
            } else {
                if(value.localeCompare("/")==0){
                    let a:number = stack.pop()!;
                    let b:number = stack.pop()!;
                    stack.push(b/a);
                } else if (value.localeCompare("*")==0) {
                    let a:number = stack.pop()!;
                    let b:number = stack.pop()!;
                    stack.push(b*a);
                } else if (value.localeCompare("sqrt")==0 ) {
                    let a:number = stack.pop()!;
                    stack.push(Math.sqrt(a));
                } else if (value.localeCompare("sin")==0 ) {
                    let a:number = stack.pop()!;
                    stack.push(Math.sin(a));                    
                } else if (value.localeCompare("cos")==0 ) {
                    let a:number = stack.pop()!;
                    stack.push(Math.cos(a));                    
                } else if (value.localeCompare("^")==0 ) {
                    let a:number = stack.pop()!;
                    let b:number = stack.pop()!;
                    stack.push(b**a);                    
                } else if (value.localeCompare("+")==0 ) {
                    let a:number = stack.pop()!;
                    let b:number = stack.pop()!;
                    stack.push(b+a);                    
                } else if (value.localeCompare("-")==0 ) {
                    let a:number= stack.pop()!;
                    let b:number = stack.pop()!;
                    stack.push(b-a);                    
                } else if (value.localeCompare("\\um")==0) {
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