import { useEffect } from "react";
import { useAction } from "../../../utils/action";
import { sessionState } from "../../SessionState";

<<<<<<< HEAD
export const LoadContentAction = (exercise: { code: string | any; contentType: string | any }) => {
=======
export const LoadContentAction = (exercise: {
  code: string | any;
  type: string | any;
}) => {
>>>>>>> seleccion-contenido
  const action = useAction();
  useEffect(() => {
    action({
      verbName: "loadContent",
      contentID: exercise?.code,
      topicID: sessionState.topic,
    });
  }, []);

  return null;
};
