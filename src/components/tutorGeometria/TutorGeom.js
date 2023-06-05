import dynamic from "next/dynamic";
import React from "react";

const DynamicTutorAP1 = dynamic(() =>
  import("./areaPerimetro/areaPerimetro1").then(mod => mod.AP1),
);
const DynamicTutorAP2 = dynamic(() =>
  import("./areaPerimetro/areaPerimetro2").then(mod => mod.AP2),
);
const DynamicTutorTP1 = dynamic(() =>
  import("./teoremaPitagoras/teoremaPitagoras1").then(mod => mod.TP1),
);
const DynamicTutorTP2 = dynamic(() =>
  import("./teoremaPitagoras/teoremaPitagoras2").then(mod => mod.TP2),
);
const DynamicTutorTH1 = dynamic(() =>
  import("./teoremaThales/teoremaThales1").then(mod => mod.TH1),
);
const DynamicTutorTH2 = dynamic(() =>
  import("./teoremaThales/teoremaThales2").then(mod => mod.TH2),
);

export const TutorGeom = ({ exercise, topicId }) => {
  return (
    <>
      {exercise?.type == "areaperimetro1" ? (
        <DynamicTutorAP1 exercise={exercise} topic={topicId} />
      ) : exercise?.type == "areaperimetro2" ? (
        <DynamicTutorAP2 exercise={exercise} topic={topicId} />
      ) : exercise?.type == "pitagoras1" ? (
        <DynamicTutorTP1 exercise={exercise} topic={topicId} />
      ) : exercise?.type == "pitagoras2" ? (
        <DynamicTutorTP2 exercise={exercise} topic={topicId} />
      ) : exercise?.type == "thales1" ? (
        <DynamicTutorTH1 exercise={exercise} topic={topicId} />
      ) : exercise?.type == "thales2" ? (
        <DynamicTutorTH2 exercise={exercise} topic={topicId} />
      ) : (
        <p>Error, tipo de ejercicio no encontrado! </p>
      )}
    </>
  );
};
