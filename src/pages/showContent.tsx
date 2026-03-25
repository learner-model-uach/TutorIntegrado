import { withAuth } from "../components/Auth";
import { sessionState } from "../components/SessionState";
import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { Tutor } from "../components/tutorEcuaciones/Tutor";
import type Plain from "../components/lvltutor/Plain";
import type { ExType } from "../components/lvltutor/Tools/ExcerciseType";
import { Text, Box } from "@chakra-ui/react";
import Info from "../utils/Info";
import type { ExLog } from "../components/LogicTutor/Tools/ExcerciseType2";
const DynamicTutorFac = dynamic<{ exercise?: Object; topicId?: string }>(
  () => import("../components/tutorFactorizacion/TutorFac").then(mod => mod.TutorFac),
  { ssr: false },
);

const DynamicPlain = dynamic<ComponentProps<typeof Plain>>(
  () => import("../components/lvltutor/Plain").then(mod => mod.Plain),
  { ssr: false },
);

const DynamicTutorEcu = dynamic<ComponentProps<typeof Tutor>>(
  () => import("../components/tutorEcuaciones/Tutor").then(mod => mod.Tutor),
  { ssr: false },
);

const DynamicTutorGeom = dynamic<{ exercise?: Object; topicId?: string }>(
  () => import("../components/tutorGeometria/TutorGeom").then(mod => mod.TutorGeom),
  { ssr: false },
);

const DynamicTutorWP = dynamic<{ exercise?: Object; topicId?: string }>(
  () =>
    import("../components/tutorWordProblems/TutorWordProblem").then(mod => mod.TutorWordProblem),
  { ssr: false },
);

const DynamicTutorLogic = dynamic<{ exc?: ExLog; topicId?: string }>(
  () => import("../components/LogicTutor/DynamicTutorLogic"),
  { ssr: false },
);

const ShowContentPage = withAuth(function ShowContent() {
  const content = sessionState.currentContent;
  const topic = sessionState.topic;
  const code = content?.code ?? "";
  const contentJson = content?.json;
  const contentType = contentJson?.type;

  
  return (
    <>
      <Box
        position="absolute"
        top="0"
        right="0"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={4}
      >
        <Text fontSize="sm" color="gray.500">
          {code}
        </Text>
        <Info />
      </Box>

      <div>
        {content &&
        ["ftc5s", "fc1s", "fdc2s", "fdsc2", "fcc3s"].includes(contentType) ? (
          <DynamicTutorFac key="1" exercise={contentJson} topicId={topic} />
        ) : contentType == "lvltutor" && contentJson ? (
          <DynamicPlain key="2" steps={contentJson as ExType} topicId={topic} />
        ) : content && ["ecc5s", "secl5s", "ecl2s", "mo"].includes(contentType) ? (
          <DynamicTutorEcu key="3" exercise={contentJson} topicId={topic} />
        ) : content &&
          [
            "areaperimetro1",
            "areaperimetro2",
            "pitagoras1",
            "pitagoras2",
            "thales1",
            "thales2",
          ].includes(contentType) ? (
          <DynamicTutorGeom key="4" exercise={contentJson} topicId={topic} />
        ) : contentType == "wordProblem" ? (
          <DynamicTutorWP key="5" exercise={contentJson} topicId={topic} />
        ) : contentType == "lvltutor2" ? (
          <DynamicTutorLogic key="6" exc={contentJson as ExLog} topicId={topic} />
        ) : (
          <Text>No existe el contenido que desea cargar</Text>
        )}
      </div>
    </>
  );
});

export default dynamic(() => Promise.resolve(ShowContentPage), {
  ssr: false,
});
