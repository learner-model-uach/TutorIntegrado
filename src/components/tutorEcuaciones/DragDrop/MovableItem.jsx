import React, { useState, useContext } from "react";
import styles from "./MovableItem.module.css";
import { useDrag } from "react-dnd";
import TeX from "@matejmazur/react-katex";
import { useEffect } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { BOX, COLUMN1, COLUMN2, DRAG_TEXT } from "../types";
import ExerciseContext from "../context/exercise/exerciseContext";
import { useAction } from "../../../utils/action";

const style = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
};

export const MovableItem = ({
  value,
  column,
  setItems,
  items,
  answer,
  type,
  content,
  isCorrect,
  nStep,
}) => {
  const [isCorrecto, setIsCorrect] = useState(true);
  const exerciseContext = useContext(ExerciseContext);
  const startAction = useAction({});

  useEffect(() => {
    setIsCorrect(!isCorrect);
  }, [isCorrect]);

  let newValue = "";
  if (type === DRAG_TEXT) {
    newValue = value.replace("\\text", "");
    newValue = newValue.replace(/^(.)|(.)$/g, "");
  }

  const changeItemColumn = (value, columnName) => {
    setItems((prevState) => {
      return prevState.map((e) => {
        return {
          ...e,
          column: e.value === value ? columnName : e.column,
        };
      });
    });
  };

  const findItem = () => {
    const itemAnswer = items.find((item) => item.column === COLUMN2);
    return itemAnswer;
  };

  const [{ isDragging }, drag] = useDrag({
    canDrag: () => isCorrecto,
    item: { value },
    type: BOX,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      let existsAnswer = findItem();

      if (existsAnswer) {
        if (dropResult && dropResult.name.title === COLUMN1) {
          changeItemColumn(item.value, COLUMN1);
          if (!answer) {
            startAction({
              verbName: "unchooseAnswer",
              stepID: nStep,
              contentID: content,
              extra: { answer: item.value },
            });
          }
        }
        if (dropResult && dropResult.name.title === COLUMN2) {
          changeItemColumn(existsAnswer.value, COLUMN1);
          changeItemColumn(item.value, COLUMN2);

          startAction({
            verbName: "unchooseAnswer",
            stepID: nStep,
            contentID: content,
            extra: { answer: existsAnswer.value },
          });

          startAction({
            verbName: "chooseAnswer",
            stepID: nStep,
            contentID: content,
            extra: { answer: item.value },
          });
        }
      } else {
        if (dropResult && dropResult.name.title === COLUMN2 && answer) {
          changeItemColumn(item.value, COLUMN2);
          startAction({
            verbName: "chooseAnswer",
            stepID: nStep,
            contentID: content,
            extra: { answer: item.value },
          });
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.2 : 1;

  const onDoubleClick = () => {
    let existsAnswer = findItem();
    if (!isCorrect) {
      if (existsAnswer) {
        if (column === COLUMN1) {
          changeItemColumn(existsAnswer.value, COLUMN1);
          changeItemColumn(value, COLUMN2);

          startAction({
            verbName: "unchooseAnswer",
            stepID: nStep,
            contentID: content,
            extra: { answer: existsAnswer.value },
          });

          startAction({
            verbName: "chooseAnswer",
            stepID: nStep,
            contentID: content,
            extra: { answer: value },
          });
        }
        if (column === COLUMN2) {
          changeItemColumn(value, COLUMN1);

          startAction({
            verbName: "unchooseAnswer",
            stepID: nStep,
            contentID: content,
            extra: { answer: value },
          });
        }
      } else {
        if (column === COLUMN1 && answer) {
          changeItemColumn(value, COLUMN2);
          startAction({
            verbName: "chooseAnswer",
            stepID: nStep,
            contentID: content,
            extra: { answer: value },
          });
        }
      }
    }
  };

  return (
    <Flex
      ref={drag}
      onDoubleClick={onDoubleClick}
      className={styles["movable-item"]}
      fontSize={{ base: "10px" }}
      style={{ textAlign: "center", opacity: opacity }}
    >
      {type == "drag-text" ? (
        <Text>{newValue}</Text>
      ) : (
        <TeX math={value} as="figcaption" />
      )}
    </Flex>
  );
};
