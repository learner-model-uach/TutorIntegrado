import React from "react";
import Pizarra from "../components/tutorPizarra/tutorPizarra";
import excer from "../components/tutorPizarra/jsons/fracc12.json";

export default function PizarraPlain() {
  // Reemplaza toda la vista por la Pizarra
  return (
    <div>
      <Pizarra exercise={excer} topicId="pot1" />
    </div>
  );
}
