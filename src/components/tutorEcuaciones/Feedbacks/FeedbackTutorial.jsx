import React, { useEffect, useState } from "react";
import { Modal, Button, Text } from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";

export const FeedbackTutorial = ({ showFeedback }) => {
  const [showF, setShowF] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    setShowF(showFeedback);
  }, [showFeedback]);

  return (
    <Modal.Root 
      open={showF} 
      onOpenChange={({ open }) => setShowF(open)} 
      size="xl"
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header m="auto">
          Has completado correctamente el tutorial
        </Modal.Header>
        <Modal.CloseTrigger />

        <Modal.Body fontSize="20px" m="auto">
          <Text> Ahora iremos a resolver más ejercicios</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button colorPalette="red" mr={3} onClick={() => push(`/practice/`)}>
            Siguiente
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
