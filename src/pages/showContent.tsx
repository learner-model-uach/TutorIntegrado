import { withAuth } from "../components/Auth";
import { sessionState } from "../components/SessionState";
import dynamic from "next/dynamic";

const DynamicTutorFac = dynamic<{ exercise?: Object; topicId?: string }>(() =>
  import("../components/tutorFactorizacion/TutorFac").then(mod => mod.TutorFac),
);

const DynamicPlain = dynamic<{ topicId: string; steps: Object }>(() =>
  import("../components/lvltutor/Plain").then(mod => mod.Plain),
);

const DynamicTutorEcu = dynamic<{ id: string }>(() =>
  import("../components/tutorEcuaciones/Tutor").then(mod => mod.Tutor),
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
        ) : content && content?.json?.type == "lvltutor" ? (
          <DynamicPlain key="2" steps={content?.json} topicId={topic}></DynamicPlain>
        ) : content && ["ecc5s", "secl5s"].includes(content?.json?.type) ? (
          <DynamicTutorEcu key="3" id={content.id}></DynamicTutorEcu>
        ) : (
          <p>No existe el contenido que desea cargar</p>
        )}
      </div>
    </>
  );
});
