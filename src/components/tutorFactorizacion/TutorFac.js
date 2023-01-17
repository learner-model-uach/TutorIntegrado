import { Button } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";

const DynamicTutorFC = dynamic(() => import("./factorComun/FactorComun").then(mod => mod.FC));
const DynamicTutorFCC = dynamic(() =>
  import("./factorComunCompuesto/FactorComunCompuesto").then(mod => mod.FCC),
);
const DynamicTutorDC = dynamic(() =>
  import("./diferenciaCuadrados/DiferenciaCuadrados").then(mod => mod.DC),
);
const DynamicTutorDSC = dynamic(() =>
  import("./diferenciaSumaCubos/DiferenciaSumaCubos").then(mod => mod.DSC),
);
const DynamicTutorTC = dynamic(() =>
  import("./trinomiosCuadraticos/TrinomiosCuadraticos").then(mod => mod.TC),
);

export const TutorFac = ({ exercise }) => {
  return (
    <>
      {exercise?.type == "fc1s" ? (
        <DynamicTutorFC exercise={exercise} nextRouter="/" />
      ) : exercise?.type == "fcc3s" ? (
        <DynamicTutorFCC exercise={exercise} nextRouter="/" />
      ) : exercise?.type == "fdc2s" ? (
        <DynamicTutorDC exercise={exercise} nextRouter="/" />
      ) : exercise?.type == "fdsc2" ? (
        <DynamicTutorDSC exercise={exercise} nextRouter="/" />
      ) : exercise?.type == "ftc5s" ? (
        <DynamicTutorTC exercise={exercise} nextRouter="/" />
      ) : (
        <p>error en exercise.contentType, exercise.contentType != FC,FCC,DC,DSC,TC </p>
      )}
    </>
  );

  //if TC => <DynamicTutorFacTC exercise={data[0]} nextRouter="/" />
};
