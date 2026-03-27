import React, { useEffect, useState } from "react";
import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const FeedbackTutorial = ({ showFeedback }) => {
  const [showF, setShowF] = useState(false);
  const { push } = useRouter();

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
              <Dialog.Title>Has completado correctamente el tutorial</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body fontSize="20px" m="auto">
              <Text> Ahora iremos a resolver más ejercicios</Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button colorPalette="red" mr={3} onClick={() => push(`/practice/`)}>
                Siguiente
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
