import React from "react";
import type { ExLog } from "../components/LogicTutor/Tools/ExcerciseType2";

import Inter from "../components/LogicTutor/LogicaJson/Inter1.json";
import Inters from "../components/LogicTutor/LogicaJson/Intersection.json";
import Suc from "../components/LogicTutor/LogicaJson/Sucesion1.json";
import Table1 from "../components/LogicTutor/LogicaJson/Tabla1.json";
import Union1 from "../components/LogicTutor/LogicaJson/Union.json";
import Prop1 from "../components/LogicTutor/LogicaJson/Prop1.json";
import Conj1 from "../components/LogicTutor/LogicaJson/Conj1.json";

import "katex/dist/katex.min.css";
import { useRouter } from "next/router";
import DynamicTutorLogic from "../components/LogicTutor/DynamicTutorLogic";

function App() {
  let exc: ExLog; //
  const router = useRouter();
  const { pid } = router.query;
  //console.log(pid)
  if (pid === "Inter") {
    exc = Inter as ExLog;
  } else if (pid === "Inters") {
    exc = Inters as ExLog;
  } else if (pid === "Table1") {
    exc = Table1 as ExLog;
  } else if (pid === "Prop1") {
    exc = Prop1 as ExLog;
  } else if (pid === "Union1") {
    exc = Union1 as ExLog;
  } else if (pid === "Sucesion") {
    exc = Suc as ExLog;
  } else if (pid === "Conj1") {
    exc = Conj1 as ExLog;
  }

  return (
    <div>
      <DynamicTutorLogic exc={exc} topicId={"38"} />
    </div>
  );
}

export default App;
