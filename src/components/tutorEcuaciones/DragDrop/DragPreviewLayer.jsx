import React from "react";
import { useDragLayer } from "react-dnd";
import TeX from "@matejmazur/react-katex";
import { Text } from "@chakra-ui/react";
import { BOX, DRAG_TEXT } from "../types";
import styles from "./DragPreviewLayer.module.css";

const getItemStyles = currentOffset => {
  if (!currentOffset) {
    return { display: "none" };
  }

  const { x, y } = currentOffset;

  return {
    transform: `translate(${x}px, ${y}px)`,
  };
};

const cleanTextValue = value => value.replace("\\text", "").replace(/^(.)|(.)$/g, "");

export const DragPreviewLayer = () => {
  const { currentOffset, isDragging, item, itemType } = useDragLayer(monitor => ({
    currentOffset: monitor.getSourceClientOffset() ?? monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
  }));

  if (!isDragging || itemType !== BOX || !item?.value) {
    return null;
  }

  const isText = item.previewType === DRAG_TEXT;

  return (
    <div className={styles.layer}>
      <div className={styles.preview} style={getItemStyles(currentOffset)}>
        {isText ? (
          <Text>{cleanTextValue(item.value)}</Text>
        ) : (
          <TeX math={item.value} as="figcaption" />
        )}
      </div>
    </div>
  );
};
