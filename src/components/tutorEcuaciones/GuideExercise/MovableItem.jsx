import React, { useState, useContext } from "react";
import styles from "./MovableItem.module.css";
import { useDrag } from "react-dnd";
import TeX from "@matejmazur/react-katex";
import { useEffect } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { BOX, COLUMN1, COLUMN2, DRAG_TEXT } from "../../../types";
import { useAction } from "../../../utils/action";

const style = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
};

export const MovableItem = ({
  answer,
  column, // can be COLUMN1 or COLUMN2 (panel below or panel above)
  content,
  isCorrect,
  items, // object with the values of the "answers" field from the json file and a "column" field with the column type (COLUMN1 or COLUMN2)
  nStep,
  setItems,
  type,
  value, // value is the value that is in the column (either COLUMN1 or COLUMN2)
}) => {
  const [isCorrecto, setIsCorrect] = useState(true);
  const startAction = useAction({});

  useEffect(() => {
    setIsCorrect(!isCorrect);
  }, [isCorrect]);

  let newValue = "";
  if (type === DRAG_TEXT) {
    newValue = value.replace("\\text", "");
    newValue = newValue.replace(/^(.)|(.)$/g, "");
  }

  // change the value of the column key with columnName
  // if the items element matches the passed value parameter
  const changeItemColumn = (value, columnName) => {
    setItems(prevState => {
      return prevState.map(e => {
        return {
          ...e,
          column: e.value === value ? columnName : e.column,
        };
      });
    });
  };

  // returns the answers that are in the panel above (by design it should
  // only have one answer)
  const findItem = () => {
    const itemAnswer = items.find(item => item.column === COLUMN2);
    return itemAnswer;
  };

  const [{ isDragging }, drag] = useDrag({
    canDrag: () => isCorrecto,
    item: { value },
    type: BOX,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult(); // gets the last card dropped
      let existsAnswer = findItem(); // response given by the user

      if (existsAnswer) {
        // The user took a card (either from the top panel or the bottom panel) and placed it in the bottom panel
        if (dropResult && dropResult.name.title === COLUMN1) {
          // the card was dropped in the panel below
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
        // The user took a card (either from the top panel or the bottom panel) and placed it on the top panel
        if (dropResult && dropResult.name.title === COLUMN2) {
          // the card was dropped in the panel above
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
    collect: monitor => ({
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

          // if the key column is COLUMN1 and if value is not in
          // COLUMN1 it must be in COLUMN2 and that state
          // is configured, otherwise its original state,
          // which is COLUMN1, is maintained
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
      {type == "drag-text" ? <Text>{newValue}</Text> : <TeX math={value} as="figcaption" />}
    </Flex>
  );
};
