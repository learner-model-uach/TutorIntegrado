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
import { useUpdateModel } from "../../utils/updateModel";

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

export default withAuth(function Content() {
  const router = useRouter();
  const model = useUpdateModel();
  const json = JSON.parse(JSON.stringify(sessionState.currentContent.json));
  console.log(json);
  return (
    <>
      <div>
        {json && sessionState.topic == "RudAlg" ? (
          <DynamicTutorFac
            key="4"
            exercise={json}
            topic={sessionState.topic}
          ></DynamicTutorFac>
        ) : (
          <p>cargar otro tutor</p>
        )}
      </div>
      <Button
        onClick={() => {
          model({
            typeModel: "BKT",
            domainID: "1",
          });
        }}
      >
        Salir
      </Button>
    </>
  );
});
