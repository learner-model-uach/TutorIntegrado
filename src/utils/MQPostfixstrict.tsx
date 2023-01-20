interface uniqueTokens {
    "token":string;
    "quatity":number;
}

const MQPostfixstrict = (ExpA:string,ExpB:string) => {

    function arrayBuilder(MQPostfixExpression:string){
        let exp=MQPostfixExpression.split(" ");

        let uTarray:Array<uniqueTokens>=[];

        for(let i=0;i<exp.length;i++){
            let valueI=exp[i];
            if(!valueI)continue;
            if(uTarray.length>0){
                let belongs=false;
                for(let j=0;j<uTarray.length;j++){
                    let valueJ=uTarray[j];
                    if(!valueJ)continue;
                    if (valueJ.token.localeCompare(valueI)==0){
                        valueJ.quatity=valueJ.quatity+1;
                        belongs=true;
                    }
                }
                if(!belongs)uTarray.push({"token":valueI,"quatity":1});
            }else{
                uTarray.push({"token":valueI,"quatity":1});
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
                let valueA=ea[i];
                if(!valueA)continue;
                for(let j=0;j<leb;j++){
                    let valueB=eb[j];
                    if(!valueB)continue;
                    if(valueA.token.localeCompare(valueB.token,"en", { sensitivity: 'base' })==0 && valueA.quatity==valueB.quatity)belong=true;
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