import { memo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { BOX, ORDER_STEPS_CARD_COLOR } from "../types";
import { Icon, Flex } from "@chakra-ui/react";
import { RiDragMove2Fill } from "react-icons/ri";

const style = {
  border: "2px dashed gray",
  paddingTop: "1rem",
  marginTop: ".25rem",
  marginBottom: ".25rem",
  marginLeft: "1rem",
  marginRight: "1.5rem",
  cursor: "move",
  display: "flex",
  textAlign: "center",
};

export const CardsOrderSteps = memo(function Card({
  id,
  text,
  moveCard,
  findCard,
  color,
}) {
  const originalIndex = findCard(id).index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: BOX,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCard(droppedId, originalIndex);
        }
      },
    }),
    [id, originalIndex, moveCard]
  );
  const [, drop] = useDrop(
    () => ({
      accept: BOX,
      canDrop: () => false,
      hover({ id: draggedId }) {
        if (draggedId !== id) {
          const { index: overIndex } = findCard(id);
          moveCard(draggedId, overIndex);
        }
      },
    }),
    [findCard, moveCard]
  );
  const opacity = isDragging ? 0 : 1;
  return (
    <Flex
      width={{
        base: "100%",
      }}
      height={{
        base: "50px",
      }}
      ref={(node) => drag(drop(node))}
      style={{
        ...style,
        opacity,
        backgroundColor: color ? color : ORDER_STEPS_CARD_COLOR,
      }}
    >
      <Icon w={"2em"} style={{ paddingRight: "5px" }} as={RiDragMove2Fill} />
      {text}
    </Flex>
  );
});
