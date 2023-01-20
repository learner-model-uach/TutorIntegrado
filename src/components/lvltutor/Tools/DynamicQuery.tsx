import { useGQLQuery } from "rq-gql";
import { gql } from "../../../graphql";
import { Button, Input,Text } from "@chakra-ui/react";
import { useEffect,useState,useRef } from "react";

const DynamicQuery=()=>{
    const [text,setText]=useState<string>("")
    const [submit,setSubmit]=useState(false);
    const sText=useRef<string>("");

    useEffect(()=>{
        if(submit){
            sText.current=text;
            setSubmit(false);
        }
    },[submit])

    const { data: dataPot4 } = useGQLQuery(gql(/* GraphQL */ `
    query potatoquery($code:String!){
      contentByCode(code: $code){
        json
      }
    }
    `),{code:sText.current});

    return(
        <>
            <Input onChange={(e)=>{setText(e.target.value)}}/>
            <Button onClick={()=>{setSubmit(true)}}>Consultar</Button>
            <Text>{JSON.stringify(dataPot4?.contentByCode?.json)}</Text>
        </>
    )
}
export default DynamicQuery;