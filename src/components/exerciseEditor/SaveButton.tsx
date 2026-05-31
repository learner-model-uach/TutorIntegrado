import { Button } from "@chakra-ui/react";

export const SaveButton = ({ onSave, label = "Guardar", saveColor = "blue", ...props }) => {
  return (
    <Button onClick={onSave} colorPalette={saveColor} mb={4} {...props}>
      {label}
    </Button>
  );
};