import { Box, IconButton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { ReactSketchCanvas } from "react-sketch-canvas";

const DrawingArea = () => {
  let sketchRef;

  const handleClear = () => {
    if (sketchRef) {
      sketchRef.clearCanvas();
    }
  };

  return (
    <Box position="relative" width="100%" minHeight="200px">
      <ReactSketchCanvas
        ref={(ref) => (sketchRef = ref)}
        strokeWidth={1}
        strokeColor="black"
      />
      <IconButton
        icon={<DeleteIcon />}
        aria-label="Clear"
        position="absolute"
        top="0"
        right="0"
        margin="2"
        onClick={handleClear}
      />
    </Box>
  );
};

export default DrawingArea;