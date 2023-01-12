import { withAuth } from "../../components/Auth";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Button } from "@chakra-ui/react";
import { sessionState } from "../../components/SessionState";
//import FC from "../../components/tutorFactorizacion/factorComun/FactorComun";
import data1 from "../../components/tutorFactorizacion/factorComun/ejercicioFC.json";
import data2 from "../../components/tutorFactorizacion/factorComunCompuesto/ejerciciosFCC.json";
import data3 from "../../components/tutorFactorizacion/diferenciaCuadrados/ejerciciosDC.json";
import data4 from "../../components/tutorFactorizacion/diferenciaSumaCubos/ejerciciosDSC.json";
import data5 from "../../components/tutorFactorizacion/trinomiosCuadraticos/ejerciciosTC.json";
import data6 from "../../components/lvltutor/tutor/fracciones/fracciones1.json";
import ejercicioAP1 from "../../components/tutorGeometria/areaPerimetro/ejercicioAP1.json";
import AP1 from "../../components/tutorGeometria/areaPerimetro/areaPerimetro1";
import ejercicioTH from "../../components/tutorGeometria/teoremaThales/ejercicioTH.json";
import TH1 from "../../components/tutorGeometria/teoremaThales/teoremaThales1";
import ejercicioTP1 from "../../components/tutorGeometria/teoremaPitagoras/ejercicioTP1.json";
import TP1 from "../../components/tutorGeometria/teoremaPitagoras/teoremaPitagoras1";
import { useGQLQuery } from "rq-gql";
import { gql } from "../../graphql";
import { useRef } from "react";

  const DynamicTutorEcu = dynamic(() =>
    import("../../components/tutorEcuaciones/Tutor").then((mod) => mod.Tutor)
  );
  const DynamicTutorFac = dynamic(() =>
    import("../../components/tutorFactorizacion/TutorFac").then((mod) => mod.TutorFac)
  );
  const DynamicPlain = dynamic(() =>
    import("../../components/lvltutor/Plain").then((mod) => mod.Plain)
  );


export default withAuth(function Content() {
  const router = useRouter();

  
  const { data: dataFC} = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData0 {
			  contentByCode(code: "fc1"){
          json
        }
      }
    `)
  );

  const { data: dataDC } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData1 {
        contentByCode(code: "dc1"){
          json
        }
      }
    `)
  );

  const { data: dataFCC} = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData2 {
        contentByCode(code: "fcc1"){
          json
        }
      }
    `)
  );

  const { data: dataDSC} = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData3 {
        contentByCode(code: "dsc1"){
          json
        }
      }
    `)
  );

  const { data: dataFracc1} = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData4 {
        contentByCode(code: "fracc1"){
          json
        }
      }
    `)
  );

  const { data: dataFracc2} = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData5 {
        contentByCode(code: "fracc2"){
          json
        }
      }
    `)
  );

  const { data: dataTC } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData6 {
        contentByCode(code: "tc1"){
          json
        }
      }
    `)
  );

  const { data: dataPot1 } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData7 {
        contentByCode(code: "pot1"){
          json
        }
      }
    `)
  );

  const { data: dataPot2 } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData8 {
        contentByCode(code: "pot2"){
          json
        }
      }
    `)
  );

  const { data: dataPot3 } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData9 {
        contentByCode(code: "pot3"){
          json
        }
      }
    `)
  );

  const { data: dataPot4 } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData10 {
        contentByCode(code: "pot4"){
          json
        }
      }
    `)
  );

  return (
    <>
      <div>
        {router.query.type == 4 && dataFC ? (
          <DynamicTutorFac
            key = "4"
            exercise={dataFC?.contentByCode?.json}
            nextRouter="/"
          ></DynamicTutorFac>
          //<DynamicTutorFac exercise={data1[0]} nextRouter="/" />
        ) : 
        router.query.type == 5 && dataFCC? (
          <DynamicTutorFac
            key = "5"
            exercise={dataFCC?.contentByCode?.json}
            nextRouter="/"
          ></DynamicTutorFac>
        ) : router.query.type == 6 && dataDC ? (
          <DynamicTutorFac
            key = "6"
            exercise={dataDC?.contentByCode?.json}
            nextRouter="/"
          ></DynamicTutorFac>
        ) : router.query.type == 7 && dataDSC ? (
          <DynamicTutorFac
            key = "7"
            exercise={dataDSC?.contentByCode?.json}
            nextRouter="/"
          ></DynamicTutorFac>
        ) : router.query.type == 8 && dataTC ? (
          <DynamicTutorFac
            key = "8"
            exercise={dataTC?.contentByCode?.json}
            nextRouter="/"
          ></DynamicTutorFac>
        ) : router.query.type == 9 && dataFracc1 ? (
          <DynamicPlain
            key = "9"
            steps={dataFracc1?.contentByCode?.json}
            //topicId="fracc1"
          ></DynamicPlain>
        ) : router.query.type == 10 && dataFracc2 ? (
          <DynamicPlain
            key = "10"
            steps={dataFracc2?.contentByCode?.json}
            topicId="fracc2"
          ></DynamicPlain>
        ) : router.query.type == 11 ? (
          <DynamicTutorEcu id={0} />
        ) : router.query.type == 12 ? (
          <DynamicTutorEcu id={6} />
        ) : router.query.type == 13 ? (
          <DynamicPlain
            key = "13"
            steps={dataPot1?.contentByCode?.json}
            topicId="pot1"
          ></DynamicPlain>
        ) : router.query.type == 14 ? (
          <DynamicPlain
            key = "14"
            steps={dataPot2?.contentByCode?.json}
            topicId="pot2"
          ></DynamicPlain>
        ) : router.query.type == 15 ? (
          <DynamicPlain
            key = "15"
            steps={dataPot3?.contentByCode?.json}
            topicId="pot3"
          ></DynamicPlain>
        ) : router.query.type == 16 ? (
          <DynamicPlain
            key = "16"
            steps={dataPot4?.contentByCode?.json}
            topicId="pot4"
          ></DynamicPlain>
        ) : router.query.type == 17  ? (
          <AP1
          exercise = {ejercicioAP1}
          ></AP1>
        ) : router.query.type == 18  ? (
          <TH1
          exercise = {ejercicioTH}
          ></TH1>
        ) : router.query.type == 19 ? (
          <TP1
          exercise = {ejercicioTP1}
          ></TP1>
        ):null
        }
      </div>
      <Button
        onClick={() => router.push("/contentSelect?type=" + router.query.type)}
      >
        Salir
      </Button>
    </>
  );
});
