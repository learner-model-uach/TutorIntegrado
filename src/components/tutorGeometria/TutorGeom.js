import dynamic from "next/dynamic";
import React from "react";

const TutorGeometria = dynamic(() => import("./tutorGeometria").then(mod => mod.GEO));

export const TutorGeom = ({ exercise, topicId }) => {
  return (
    <>
      <TutorGeometria exercise={exercise} topic={topicId} />
    </>
  );
};
