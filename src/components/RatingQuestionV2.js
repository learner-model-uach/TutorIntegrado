// /components/RatingQuestionV2.js
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { Button, Spacer, Spinner, Textarea } from "@chakra-ui/react";
import { sessionState } from "./SessionState";
import { useAction } from "../utils/action";
import { useUpdateModel } from "../utils/updateModel";
import { useAuth } from "./Auth";
import { useRouter } from "next/router";
import parameters from "./../components/contentSelectComponents/parameters.json";

const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9",
};

function RatingQuestionV2({ useAlternateRoute = false }) {
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(10).fill(0);
  const content = sessionState.currentContent.id;
  const topic = sessionState.topic;
  const selectionData = sessionState.selectionData;
  const callback = sessionState.callback;
  const callbackType = sessionState.callbackType;
  const ruta = sessionState.nextContentPath;

  const faces = ["😡", "😕", "😐", "😊", "😍"];
  const [faceValue, setFaceValue] = useState(0);
  const [faceHover, setFaceHover] = useState(undefined);

  const action = useAction();
  const { updateModel, mutation } = useUpdateModel();
  const router = useRouter();
  const { user } = useAuth();

  // Actualiza el modelo BKT después de un tiempo
  const [timeToUpdateModel, SetTimeToUpdateModel] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      SetTimeToUpdateModel(false);
      updateModel({
        typeModel: "BKT",
        domainID: "1",
      });
    }, 1800);
  }, []);

  // Manejo de estrellas
  const handleClick = value => setCurrentValue(value);
  const handleMouseOver = newHoverValue => setHoverValue(newHoverValue);
  const handleMouseLeave = () => setHoverValue(undefined);

  // Manejo de envío de rating
  const handleClick2 = () => {
    if (currentValue === 0 || faceValue === 0) return;
    // Registrar la acción
    action({
      verbName: "selectionRating",
      result: currentValue,
      contentID: content,
      topicID: topic,
      extra: { selectionData, content, topic, currentValue, faceValue },
    });

    // Ejecutar callback si está definido (continuidad de ejercicios)
    if (callbackType === "challenge" || callbackType === "tutor") {
      if (callback) callback({ currentValue, faceValue }); // pasa rating si quieres
    } else {
      router.push(ruta);
    }
  };

  return (
    <div style={styles.container}>
      <h2>¿Qué tan claro fue seguir los pasos del ejercicio?</h2>
      <div style={styles.stars}>
        <span style={{ fontSize: "0.6rem", marginRight: 7, marginTop: 6 }}>(Nada claro)</span>{" "}
        {/* Texto al inicio */}
        {stars.map((_, index) => (
          <FaStar
            key={index}
            size={24}
            onClick={() => handleClick(index + 1)}
            onMouseOver={() => handleMouseOver(index + 1)}
            onMouseLeave={handleMouseLeave}
            color={(hoverValue || currentValue) > index ? colors.orange : colors.grey}
            style={{ marginRight: 10, cursor: "pointer" }}
          />
        ))}
        <span style={{ fontSize: "0.6rem", marginTop: 6 }}>(Muy claro)</span> {/* Texto al final */}
      </div>
      {/* Caritas */}
      <h2 style={{ marginTop: "1%" }}>
        ¿Qué tan satisfecho te sientes con la interfaz durante el ejercicio?
      </h2>
      <div style={styles.faces}>
        {faces.map((face, index) => (
          <div
            key={index}
            onClick={() => setFaceValue(index + 1)}
            onMouseOver={() => setFaceHover(index + 1)}
            onMouseLeave={() => setFaceHover(undefined)}
            style={{
              fontSize: "1.75rem",
              cursor: "pointer",
              opacity: (faceHover || faceValue) === index + 1 ? 1 : 0.5,
              transition: "opacity 0.2s",
            }}
          >
            {face}
          </div>
        ))}
      </div>

      <Button
        style={styles.button}
        disabled={currentValue === 0 || faceValue === 0 || mutation.isLoading || timeToUpdateModel}
        onClick={handleClick2}
      >
        {!mutation.isLoading && !timeToUpdateModel ? (
          parameters.ratingQuestion.buttonMsg
        ) : (
          <>
            {parameters.ratingQuestion.buttonWaitMsg} &nbsp;&nbsp;
            <Spinner emptyColor="gray.200" color="blue.500" />
          </>
        )}
      </Button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
  stars: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    paddingBottom: 5,
  },
  faces: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  button: {
    border: "1px solid #a9a9a9",
    borderRadius: 5,
    width: 300,
    padding: 10,
    marginTop: 10,
  },
};

export default RatingQuestionV2;
