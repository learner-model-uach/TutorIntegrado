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

export const TutorFac = ({ exercise, topicId }) => {
  return (
    <>
      {exercise?.type == "fc1s" ? (
        <DynamicTutorFC exercise={exercise} topic={topicId} />
      ) : exercise?.type == "fcc3s" ? (
        <DynamicTutorFCC exercise={exercise} topic={topicId} />
      ) : exercise?.type == "fdc2s" ? (
        <DynamicTutorDC exercise={exercise} topic={topicId} />
      ) : exercise?.type == "fdsc2" ? (
        <DynamicTutorDSC exercise={exercise} topic={topicId} />
      ) : exercise?.type == "ftc5s" ? (
        <DynamicTutorTC exercise={exercise} topic={topicId} />
      ) : (
        <p>error en exercise.type, exercise.type != FC,FCC,DC,DSC,TC </p>
      )}
    </>
  );
};
