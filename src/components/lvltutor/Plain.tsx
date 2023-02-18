import dynamic from "next/dynamic";

import type { ExType } from "./Tools/ExcerciseType";

const Lvltutor = dynamic(
  () => {
    return import("./Tools/Solver2");
  },
  { ssr: false },
);

export const Plain = ({
  topicId,
  steps,
  lastHint,
}: {
  topicId: string;
  steps: ExType;
  lastHint: boolean;
}) => {
  return (
    <>
      {steps?.type == "lvltutor" ? (
        <Lvltutor key={topicId} topicId={topicId} steps={steps} lastHint={lastHint} />
      ) : (
        "potato"
      )}
    </>
  );
};

export default Plain;
