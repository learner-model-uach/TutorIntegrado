import { useGQLQuery } from "rq-gql";
import { gql, PotatoqueryQuery } from "../../../graphql";
import { Button, Input,Text } from "@chakra-ui/react";
import { useEffect,useState,useRef } from "react";
import type {ExType} from "./ExcerciseType";

const ParsedQuery=({obj}:{obj:PotatoqueryQuery})=>{
    const [potatoQ,setPotatoQ] = useState<ExType | null>();
    useEffect(()=>{
        let value:Object| unknown=(obj?.contentByCode?.json)
        if(value){
            let a=value as ExType;
            setPotatoQ(a);
        }
    },[obj])
    return (potatoQ?<Text>{JSON.stringify(potatoQ.steps[0].answers[0])}</Text>:null)
}

const DynamicQuery=()=>{
    const [text,setText]=useState<string>("");
    const [submit,setSubmit]=useState(false);
    const sText=useRef<string>("");

    const { data: potato } = useGQLQuery(gql(/* GraphQL */ `
    query potatoquery($code:String!){
      contentByCode(code: $code){
        json
      }
    }
    `),{code:sText.current});

    useEffect(()=>{
        if(submit){
            sText.current=text;
            setSubmit(false);
        }
    },[submit])

    return(
        <>
            <Input onChange={(e)=>{setText(e.target.value)}}/>
            <Button onClick={()=>{setSubmit(true)}}>Consultar</Button>
            {potato?<ParsedQuery obj={potato}/>:null}
        </>
    )
}
export default DynamicQuery;