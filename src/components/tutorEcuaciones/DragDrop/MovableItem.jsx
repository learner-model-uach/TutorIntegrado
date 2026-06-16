import React, { useEffect, useRef, useState } from "react";
import styles from "./MovableItem.module.css";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import TeX from "@matejmazur/react-katex";
import { Flex, Text } from "@chakra-ui/react";
import { BOX, COLUMN1, COLUMN2, DRAG_TEXT } from "../types";
import { useAction } from "../../../utils/action";

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
  const startAction = useAction({});
  const elementRef = useRef(null);

  useEffect(() => {
    setIsCorrect(!isCorrect);
  }, [isCorrect]);

  let newValue = "";
  if (type === DRAG_TEXT) {
    newValue = value.replace("\\text", "");
    newValue = newValue.replace(/^(.)|(.)$/g, "");
  }

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

  const findItem = () => {
    const itemAnswer = items.find(item => item.column === COLUMN2);
    return itemAnswer;
  };

  const getPreviewSize = () => {
    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return undefined;

    return {
      height: rect.height,
      width: rect.width,
    };
  };

  const [{ isDragging }, drag, preview] = useDrag({
    canDrag: () => isCorrecto,
    item: () => ({ previewSize: getPreviewSize(), previewType: type, value }),
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
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const opacity = isDragging ? 0 : 1;

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

  const isAnswerSlotItem = column === COLUMN2;

  return (
    <Flex
      ref={node => {
        elementRef.current = node;
        drag(node);
      }}
      onDoubleClick={onDoubleClick}
      className={`${styles["movable-item"]} ${isAnswerSlotItem ? styles["answer-slot-item"] : ""}`}
      fontSize={{ base: "10px" }}
      style={{ textAlign: "center", opacity: opacity }}
    >
      {type == "drag-text" ? <Text>{newValue}</Text> : <TeX math={value} as="figcaption" />}
    </Flex>
  );
};
