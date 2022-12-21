import React from "react";
import { useDrop } from "react-dnd";
import { BOX } from "../types";

export const ColumnDragPanel = ({ children, className, title }) => {
  const [, drop] = useDrop({
    accept: BOX,
    drop: () => ({ name: { title } }),
  });

  return (
    <div ref={drop} className={className} style={{ alignItems: "center" }}>
      {children}
    </div>
  );
};
