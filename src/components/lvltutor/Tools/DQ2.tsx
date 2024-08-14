import { useGQLQuery } from "rq-gql";
import { gql, PotatoqueryQuery } from "../../../graphql";
import { Button, Input, Text } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import type { ExType } from "./ExcerciseType";
import { sessionState, sessionStateBD } from "../../SessionState";
//import { useAuth } from "../../Auth";
function Dq({ params, b, c }: { params: ExType; b: Array<string>; c: Array<Object> }) {
  useEffect(() => {
    //console.log(params.code);
    sessionState.currentContent.json = params;
    sessionState.currentContent.id = b[0];
    sessionState.currentContent.code = b[1];
    sessionState.currentContent.description = b[2];
    sessionState.currentContent.label = b[3];
    sessionState.currentContent.kcs = c;
    sessionStateBD.setItem(
      "currentContent",
      JSON.parse(JSON.stringify(sessionState.currentContent)),
    );
  }, [params, b, c]);

  return <Text>{JSON.stringify(params.code)}</Text>;
}

const ParsedQuery = ({ obj }: { obj: PotatoqueryQuery }) => {
  const [potatoQ, setPotatoQ] = useState<ExType | null>();
  const [pb, setPB] = useState<Array<string>>(null);
  const [pc, setPC] = useState<Array<Object>>(null);
  useEffect(() => {
    let value: Object | unknown = obj?.contentByCode?.json;
    let valueB: Array<string> = [
      obj?.contentByCode?.id,
      obj?.contentByCode?.code,
      obj?.contentByCode?.description,
      obj?.contentByCode?.label,
    ];
    let valueC: Array<Object> = [obj?.contentByCode?.kcs];
    if (value) {
      let a = value as ExType;
      setPotatoQ(a);
      setPB(valueB);
      setPC(valueC);
    }
  }, [obj]);
  return potatoQ ? <Dq params={potatoQ} b={pb} c={pc} /> : null;
};

const DQ2 = () => {
  const [text, setText] = useState<string>("");
  const [submit, setSubmit] = useState(false);
  const sText = useRef<string>("");
  //const { user } = useAuth();

  const { data: potato } = useGQLQuery(
    gql(/* GraphQL */ `
      query potatoquery($code: String!) {
        contentByCode(code: $code) {
          id
          code
          description
          label
          json
          kcs {
            code
          }
        }
      }
    `),
    { code: sText.current },
  );

  useEffect(() => {
    if (submit) {
      sText.current = text;
      setSubmit(false);
    }
  }, [submit]);

  return (
    <>
      <Input
        onChange={e => {
          setText(e.target.value);
        }}
        placeholder="Escribe el codigo del ejercicio"
      />
      <Button
        onClick={() => {
          setSubmit(true);
        }}
      >
        Cargar Ejercicio
      </Button>
      <br />
      <br />
      {potato ? <ParsedQuery obj={potato} /> : null}
    </>
  );
};
export default DQ2;
