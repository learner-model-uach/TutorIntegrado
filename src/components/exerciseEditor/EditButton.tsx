import { Button } from "@chakra-ui/react";

export const EditButton = ({
  isEditing,
  onClick,
  cancelText = "Cancelar edición",
  editText = "Editar",
  cancelColor = "red",
  editColor = "blue",
  ...props
}) => {
  return (
    <Button 
      onClick={onClick} 
      colorPalette={isEditing ? cancelColor : editColor} 
      mb={4} 
      {...props}
    >
      {isEditing ? cancelText : editText}
    </Button>
  );
};