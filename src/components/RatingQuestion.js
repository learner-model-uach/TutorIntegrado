import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { Button } from "@chakra-ui/react";
import { sessionState } from "./SessionState";
import Link from "next/link";
import { useAction } from "../utils/action";
import { useUpdateModel } from "../utils/updateModel";

const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9",
};

function RatingQuestion() {
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(5).fill(0);
  const ruta = sessionState.nextContentPath;
  const action = useAction();
  const content = sessionState.currentContent.id;
  const topic = sessionState.topic;
  const selectionData = sessionState.selectionData;

  const handleClick = value => {
    setCurrentValue(value);
  };

  const handleMouseOver = newHoverValue => {
    setHoverValue(newHoverValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  const { updateModel, mutation } = useUpdateModel();
  console.log(mutation.status);

  useEffect(() => {
    updateModel({
      typeModel: "BKT",
      domainID: "1",
    });
  }, []);

  const handleClick2 = () => {
    action({
      verbName: "selectionRating",
      result: currentValue,
      contentID: content,
      topicID: topic,
      extra: { selectionData },
    });
  };
  return (
    <div style={styles.container}>
      {selectionData.length > 1 ? (
        <h2>¿Cómo fue tu experiencia con este ejercicio escogido?</h2>
      ) : (
        <h2>¿Cómo fue tu experiencia con este ejercicio que el sistema eligio para ti?</h2>
      )}

      <div style={styles.stars}>
        {stars.map((_, index) => {
          return (
            <FaStar
              key={index}
              size={24}
              onClick={() => handleClick(index + 1)}
              onMouseOver={() => handleMouseOver(index + 1)}
              onMouseLeave={handleMouseLeave}
              color={(hoverValue || currentValue) > index ? colors.orange : colors.grey}
              style={{
                marginRight: 10,
                cursor: "pointer",
              }}
            />
          );
        })}
      </div>
      <Link href={ruta}>
        <Button
          style={styles.button}
          disabled={currentValue != 0 ? false : true}
          onClick={handleClick2}
        >
          Siguiente Ejercicio
        </Button>
      </Link>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  stars: {
    display: "flex",
    flexDirection: "row",
  },
  button: {
    border: "1px solid #a9a9a9",
    borderRadius: 5,
    width: 300,
    padding: 10,
  },
};

export default RatingQuestion;
