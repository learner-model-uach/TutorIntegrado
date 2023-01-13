interface uniqueTokens {
    "token":string;
    "quatity":number;
}

const MQPostfixstrict = (ExpA:string,ExpB:string) => {

    function arrayBuilder(MQPostfixExpression:string){
        var exp=MQPostfixExpression.split(" ");

        var uTarray:Array<uniqueTokens>=new Array<uniqueTokens>();

        for(let i=0;i<exp.length;i++){
            if(uTarray){
                let belongs=false;
                for(let j;j<uTarray.length;j++){
                    if (uTarray[j].token.localeCompare(exp[i])==0){
                        uTarray[j].quatity=uTarray[j].quatity+1;
                        belongs=true;
                    }
                }
                if(!belongs)uTarray.push({"token":exp[0],"quatity":1});

            }else{
                uTarray.push({"token":exp[0],"quatity":1});
            }

        }

        return uTarray
    }

    function comparator (A:string,B:string) {
        let ea=arrayBuilder(A);
        let eb=arrayBuilder(B);
        let lea=ea.length;
        let leb=eb.length;
        let equal=true;
        if(lea==leb){
            for(let i=0;i<lea;i++){
                let belong=false;
                for(let j=0;j<leb;j++){
                    if(ea[i].token.localeCompare(eb[j].token,"en", { sensitivity: 'base' })==0 && ea[i].quatity==eb[j].quatity)belong=true;
                }
                if(!belong)equal=false;
            }
        }else{
            return false
        }
        return equal;
    }

    return comparator(ExpA,ExpB);
} 
export default MQPostfixstrict;