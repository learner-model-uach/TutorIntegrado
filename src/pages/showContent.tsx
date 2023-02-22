import { withAuth } from "../components/Auth";
import { sessionState } from "../components/SessionState";
import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { Tutor } from "../components/tutorEcuaciones/Tutor";
import type Plain from "../components/lvltutor/Plain";
import type { ExType } from "../components/lvltutor/Tools/ExcerciseType";

const DynamicTutorFac = dynamic<{ exercise?: Object; topicId?: string }>(() =>
  import("../components/tutorFactorizacion/TutorFac").then(mod => mod.TutorFac),
);

const DynamicPlain = dynamic<ComponentProps<typeof Plain>>(() =>
  import("../components/lvltutor/Plain").then(mod => mod.Plain),
);

const DynamicTutorEcu = dynamic<ComponentProps<typeof Tutor>>(() =>
  import("../components/tutorEcuaciones/Tutor").then(mod => mod.Tutor),
);

const DynamicAP1 = dynamic<{ exercise?: Object; topicId?: string }>(() =>
  import("../components/tutorGeometria/areaPerimetro/areaPerimetro1").then(mod => mod.AP1),
);

export default withAuth(function ShowContent() {
  const content = sessionState.currentContent;
  const topic = sessionState.topic;

  console.log(content);

  return (
    <>
      <div>
        {content && ["ftc5s", "fc1s", "fdc2s", "fdsc2", "fcc3s"].includes(content?.json?.type) ? (
          <DynamicTutorFac key="1" exercise={content.json} topicId={topic}></DynamicTutorFac>
        ) : content && content?.json?.type == "lvltutor" && !!content.json ? (
          <DynamicPlain key="2" steps={content.json as ExType} topicId={topic}></DynamicPlain>
        ) : content && ["ecc5s", "secl5s"].includes(content?.json?.type) ? (
          <DynamicTutorEcu key="3" exercise={content.json} topicId={topic}></DynamicTutorEcu>
        ) : content && content?.json?.type == "areaperimetro1" ? (
          <DynamicAP1 key="4" exercise={content.json} topicId={topic}></DynamicAP1>
        ) : (
          <p>No existe el contenido que desea cargar</p>
        )}
      </div>
    </>
  );
});
