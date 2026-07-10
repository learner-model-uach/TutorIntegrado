import dynamic from "next/dynamic";
import { useSnapshot } from "valtio";

import { useAuth } from "../Auth";
import { gSelect } from "../GroupSelect";
import { isWrapper } from "../../utils/auth0Platform";
import type { ExType } from "./Tools/ExcerciseType";

const Lvltutor = dynamic(
  () => {
    return import("./Tools/Solver2");
  },
  { ssr: false },
);

const CAMERA_TAG = "hw-photo";

export const Plain = ({ topicId, steps }: { topicId: string; steps: ExType }) => {
  const { user } = useAuth();
  const canUseHwBoard = user?.tags?.includes("hw-board") ?? false;
  const groupSelection = useSnapshot(gSelect);
  const canUseCamera =
    isWrapper() &&
    ((user?.tags?.includes(CAMERA_TAG) ?? false) ||
      (groupSelection.group?.tags?.includes(CAMERA_TAG) ?? false));

  return (
    <>
      {steps?.type == "lvltutor" ? (
        <Lvltutor
          key={steps.code}
          topicId={topicId}
          steps={steps}
          canUseHwBoard={canUseHwBoard}
          canUseCamera={canUseCamera}
        />
      ) : (
        "potato"
      )}
    </>
  );
};

export default Plain;
