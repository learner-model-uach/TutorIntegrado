import dynamic from "next/dynamic";
import { useAuth } from "../Auth";

import type { ExType } from "./Tools/ExcerciseType";

const Lvltutor = dynamic(
  () => {
    return import("./Tools/Solver2");
  },
  { ssr: false },
);

export const Plain = ({ topicId, steps }: { topicId: string; steps: ExType }) => {
  const { user } = useAuth();
  const canUseHwBoard = user?.tags?.includes("hw-board") ?? false;

  return (
    <>
      {steps?.type == "lvltutor" ? (
        <Lvltutor key={steps.code} topicId={topicId} steps={steps} canUseHwBoard={canUseHwBoard} />
      ) : (
        "potato"
      )}
    </>
  );
};

export default Plain;
