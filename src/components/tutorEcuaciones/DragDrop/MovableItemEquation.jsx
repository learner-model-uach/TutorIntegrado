import React, { useState } from "react";
import styles from "./MovableItem.module.css";
import { useDrag } from "react-dnd";
import TeX from "@matejmazur/react-katex";
import { useEffect } from "react";
import { BOX, COLUMN1, COLUMN2, COLUMN3 } from "../types";

const style = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
};

export const MovableItemEquation = ({
  value,
  setItems,
  column,
  answer,
  items,
  content,
  answerTwo,
  isCorrect,
}) => {
  const [isCorrecto, setIsCorrect] = useState(true);

  useEffect(() => {
    setIsCorrect(!isCorrect);
  }, [isCorrect]);
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

  const findItem = (column) => {
    const itemAnswer = items.find((item) => item.column === column);
    return itemAnswer;
  };

  const findItemValue = (value) => items.find((item) => item.value === value);

  const [{ isDragging }, drag] = useDrag({
    canDrag: () => isCorrecto,
    item: { value },
    type: BOX,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      let existsAnswerColumn2 = findItem(COLUMN2);
      let existsAnswerColumn3 = findItem(COLUMN3);
      if (existsAnswerColumn2) {
        if (dropResult && dropResult.name.title === COLUMN1) {
          changeItemColumn(item.value, COLUMN1);
        }

        if (dropResult && dropResult.name.title === COLUMN2) {
          let itemSelected = findItemValue(value);
          if (itemSelected.column === COLUMN3) {
            changeItemColumn(item.value, COLUMN2);
            changeItemColumn(existsAnswerColumn2.value, COLUMN3);
          } else {
            changeItemColumn(item.value, COLUMN2);
            changeItemColumn(existsAnswerColumn2.value, COLUMN1);
          }
        }
      }
      if (existsAnswerColumn3) {
        if (dropResult && dropResult.name.title === COLUMN1) {
          changeItemColumn(item.value, COLUMN1);
        }

        if (dropResult && dropResult.name.title === COLUMN3) {
          let itemSelected = findItemValue(value);
          if (itemSelected.column === COLUMN2) {
            changeItemColumn(existsAnswerColumn3.value, COLUMN2);
            changeItemColumn(item.value, COLUMN3);
          } else {
            changeItemColumn(existsAnswerColumn3.value, COLUMN1);
            changeItemColumn(item.value, COLUMN3);
          }
        }
      }
      if (dropResult && dropResult.name.title === COLUMN2 && answer) {
        changeItemColumn(item.value, COLUMN2);
      }
      if (dropResult && dropResult.name.title === COLUMN3 && answerTwo) {
        changeItemColumn(item.value, COLUMN3);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const onDoubleClick = () => {
    let existsAnswerColumn2 = findItem(COLUMN2);
    let existsAnswerColumn3 = findItem(COLUMN3);
    if (!isCorrect) {
      if (existsAnswerColumn2 || existsAnswerColumn3) {
        if (existsAnswerColumn2) {
          if (column === COLUMN2) {
            changeItemColumn(value, COLUMN1);
          }
          if (column === COLUMN1 && answerTwo) {
            changeItemColumn(value, COLUMN3);
          }
          if (column === COLUMN3) {
            changeItemColumn(value, COLUMN1);
          }
        }

        if (existsAnswerColumn3) {
          if (column === COLUMN2) {
            changeItemColumn(value, COLUMN1);
          }
          if (column === COLUMN1 && answer) {
            changeItemColumn(value, COLUMN2);
          }
          if (column === COLUMN3) {
            changeItemColumn(value, COLUMN1);
          }
        }
      } else {
        if (column === COLUMN1 && answer) {
          changeItemColumn(value, COLUMN2);
        } else {
          changeItemColumn(value, COLUMN3);
        }
      }
    }
  };

  const opacity = isDragging ? 0.2 : 1;

  return (
    <div
      ref={drag}
      onDoubleClick={onDoubleClick}
      className={styles["movable-item"]}
      style={{ style }}
    >
      <TeX
        math={value}
        as="figcaption"
        style={{ alignItems: "center", fontSize: "12px" }}
      />
    </div>
  );
};
