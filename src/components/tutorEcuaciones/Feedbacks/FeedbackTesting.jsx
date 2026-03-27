import React, { useEffect, useState } from "react";
import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react";

export const FeedbackTesting = ({ showFeedback }) => {
  const [showF, setShowF] = useState(false);

  useEffect(() => {
    setShowF(showFeedback);
  }, [showFeedback]);

  return (
    <Dialog.Root open={showF} onOpenChange={({ open }) => setShowF(open)} size="xl">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header m="auto">
              <Dialog.Title>Felicidades has completado todos los ejercicios</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body fontSize="20px" m="auto">
              <Text> Gracias por participar de esta prueba general de usabilidad.</Text>
              <Text>Tu feedback nos sera de gran ayuda.</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button colorPalette="red" mr={3} onClick={() => setShowF(false)}>
                Cerrar
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
