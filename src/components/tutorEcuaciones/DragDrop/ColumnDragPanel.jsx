import React from "react";
import { useDrop } from "react-dnd";
import { BOX } from "../types";
import { Box, useColorModeValue } from "@chakra-ui/react";

export const ColumnDragPanel = ({ children, className, title }) => {
  const [, drop] = useDrop({
    accept: BOX,
    drop: () => ({ name: { title } }),
  });

  return (
    <Box ref={drop} className={className} style={{ alignItems: "center" }}>
      {children}
    </Box>
  );
};
