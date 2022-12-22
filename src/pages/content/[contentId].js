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
import { useGQLQuery } from "rq-gql";
import { gql } from "../../graphql";
import { useRef } from "react";

export default withAuth(function Content() {
  const router = useRouter();

  const DynamicTutorEcu = dynamic(() =>
    import("../../components/tutorEcuaciones/Tutor").then((mod) => mod.Tutor)
  );
  const DynamicTutorFac = dynamic(() =>
    import("../../components/tutorFactorizacion/TutorFac").then(
      (mod) => mod.TutorFac
    )
  );
  const DynamicPlain = dynamic(() =>
    import("../../components/lvltutor/Plain").then((mod) => mod.Plain)
  );

  const { data: dataFC, isLoading } = useGQLQuery(
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
        project(code: "NivPreAlg") {
          content(pagination: { first: 25 }, filters: { topics: 6 }) {
            nodes {
              json
            }
          }
        }
      }
    `)
  );

  const { data: dataFCC } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData2 {
        project(code: "NivPreAlg") {
          content(pagination: { first: 25 }, filters: { topics: 5 }) {
            nodes {
              json
            }
          }
        }
      }
    `)
  );

  const { data: dataDSC } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData3 {
        project(code: "NivPreAlg") {
          content(pagination: { first: 25 }, filters: { topics: 7 }) {
            nodes {
              json
            }
          }
        }
      }
    `)
  );

  const { data: dataFracc1 } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData4 {
        project(code: "NivPreAlg") {
          content(pagination: { first: 25 }, filters: { topics: 17 }) {
            nodes {
              json
            }
          }
        }
      }
    `)
  );

  const { data: dataFracc2 } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData5 {
        project(code: "NivPreAlg") {
          content(pagination: { first: 25 }, filters: { topics: 18 }) {
            nodes {
              json
            }
          }
        }
      }
    `)
  );

  const { data: dataTC } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData6 {
        project(code: "NivPreAlg") {
          content(pagination: { first: 25 }, filters: { topics: 8 }) {
            nodes {
              json
            }
          }
        }
      }
    `)
  );

  const { data: dataPot1 } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData7 {
        project(code: "NivPreAlg") {
          content(pagination: { first: 25 }, filters: { topics: 20 }) {
            nodes {
              json
            }
          }
        }
      }
    `)
  );

  const { data: dataPot2 } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData8 {
        project(code: "NivPreAlg") {
          content(pagination: { first: 25 }, filters: { topics: 21 }) {
            nodes {
              json
            }
          }
        }
      }
    `)
  );

  const { data: dataPot3 } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData9 {
        project(code: "NivPreAlg") {
          content(pagination: { first: 25 }, filters: { topics: 22 }) {
            nodes {
              json
            }
          }
        }
      }
    `)
  );

  const { data: dataPot4 } = useGQLQuery(
    gql(/* GraphQL */ `
      query ProjectData10 {
        project(code: "NivPreAlg") {
          content(pagination: { first: 25 }, filters: { topics: 23 }) {
            nodes {
              json
            }
          }
        }
      }
    `)
  );

  console.log(router.pathname);
  return (
    <>
      <div>
        {router.query.type == 4 && !isLoading ? (
          <DynamicTutorFac
            exercise={dataFC?.contentByCode?.json}
            nextRouter="/"
          ></DynamicTutorFac>
        ) : //<DynamicTutorFac exercise={data1[0]} nextRouter="/" />
        router.query.type == 5 && !isLoading ? (
          <DynamicTutorFac
            exercise={dataFCC?.project?.content?.nodes[0]?.json}
            nextRouter="/"
          ></DynamicTutorFac>
        ) : router.query.type == 6 ? (
          <DynamicTutorFac
            exercise={dataDC?.project?.content?.nodes[0]?.json}
            nextRouter="/"
          ></DynamicTutorFac>
        ) : router.query.type == 7 ? (
          <DynamicTutorFac
            exercise={dataDSC?.project?.content?.nodes[0]?.json}
            nextRouter="/"
          ></DynamicTutorFac>
        ) : router.query.type == 8 ? (
          <DynamicTutorFac
            exercise={dataTC?.project?.content?.nodes[0]?.json}
            nextRouter="/"
          ></DynamicTutorFac>
        ) : router.query.type == 9 ? (
          <DynamicPlain
            steps={dataFracc1?.project?.content?.nodes[0].json}
            topicId="fracc1"
          ></DynamicPlain>
        ) : router.query.type == 10 ? (
          <DynamicPlain
            steps={dataFracc2?.project?.content?.nodes[0].json}
            topicId="fracc2"
          ></DynamicPlain>
        ) : router.query.type == 11 ? (
          <DynamicTutorEcu id={0} />
        ) : router.query.type == 12 ? (
          <DynamicTutorEcu id={6} />
        ) : router.query.type == 13 ? (
          <DynamicPlain
            steps={dataPot1?.project?.content?.nodes[0].json}
            topicId="pot1"
          ></DynamicPlain>
        ) : router.query.type == 14 ? (
          <DynamicPlain
            steps={dataPot2?.project?.content?.nodes[0].json}
            topicId="pot2"
          ></DynamicPlain>
        ) : router.query.type == 15 ? (
          <DynamicPlain
            steps={dataPot3?.project?.content?.nodes[0].json}
            topicId="pot3"
          ></DynamicPlain>
        ) : router.query.type == 16 ? (
          <DynamicPlain
            steps={dataPot4?.project?.content?.nodes[0].json}
            topicId="pot4"
          ></DynamicPlain>
        ) : router.query.type == 17 ? (
          "Triángulos"
        ) : router.query.type == 18 ? (
          "Teorema de Thales"
        ) : (
          router.query.type == 19 && "Teorema de Pitágoras"
        )}
      </div>
      <Button
        onClick={() => router.push("/contentSelect?type=" + router.query.type)}
      >
        Salir
      </Button>
    </>
  );
});
