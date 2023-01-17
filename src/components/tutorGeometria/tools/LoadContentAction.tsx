import { useEffect } from "react";
import { useAction } from "../../../utils/action";

export const LoadContentAction = (exercise: { code: string | any; type: string | any }) => {
  const action = useAction();
  useEffect(() => {
    action({
      verbName: "loadContent",
      contentID: exercise?.code,
      topicID: exercise?.type,
    });
  }, []);

  return null;
};
