import { Button } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";

<<<<<<< HEAD
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

export const TutorFac = ({ exercise, topicId: string }) => {
  return (
    <>
      {exercise?.type == "fc1s" ? (
        <DynamicTutorFC exercise={exercise} nextRouter="/" />
=======
const DynamicTutorFC = dynamic(() =>
  import("./factorComun/FactorComun").then((mod) => mod.FC)
);
const DynamicTutorFCC = dynamic(() =>
  import("./factorComunCompuesto/FactorComunCompuesto").then((mod) => mod.FCC)
);
const DynamicTutorDC = dynamic(() =>
  import("./diferenciaCuadrados/DiferenciaCuadrados").then((mod) => mod.DC)
);
const DynamicTutorDSC = dynamic(() =>
  import("./diferenciaSumaCubos/DiferenciaSumaCubos").then((mod) => mod.DSC)
);
const DynamicTutorTC = dynamic(() =>
  import("./trinomiosCuadraticos/TrinomiosCuadraticos").then((mod) => mod.TC)
);

export const TutorFac = ({ exercise, topic }) => {
  return (
    <>
      {exercise?.type == "fc1s" ? (
        <DynamicTutorFC exercise={exercise} topic={topic} />
>>>>>>> seleccion-contenido
      ) : exercise?.type == "fcc3s" ? (
        <DynamicTutorFCC exercise={exercise} topic={topic} />
      ) : exercise?.type == "fdc2s" ? (
        <DynamicTutorDC exercise={exercise} topic={topic} />
      ) : exercise?.type == "fdsc2" ? (
        <DynamicTutorDSC exercise={exercise} topic={topic} />
      ) : exercise?.type == "ftc5s" ? (
        <DynamicTutorTC exercise={exercise} topic={topic} />
      ) : (
<<<<<<< HEAD
        <p>error en exercise.contentType, exercise.contentType != FC,FCC,DC,DSC,TC </p>
=======
        <p>error en exercise.type, exercise.type != FC,FCC,DC,DSC,TC </p>
>>>>>>> seleccion-contenido
      )}
    </>
  );
};
