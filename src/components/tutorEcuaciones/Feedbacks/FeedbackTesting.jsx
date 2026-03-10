import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Text,
} from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";

export const FeedbackTesting = ({ showFeedback }) => {
  const [showF, setShowF] = useState(false);

  useEffect(() => {
    setShowF(showFeedback);
  }, [showFeedback]);

  return (
      <Modal.Root
        open={showF} 
        onOpenChange={({open}) => setShowF(open)} 
        size="xl"
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header m="auto">
            Felicidades has completado todos los ejercicios
          </Modal.Header>
          <Modal.CloseTrigger/>

          <Modal.Body fontSize="20px" m="auto">
            <Text> Gracias por participar de esta prueba general de usabilidad.</Text>
            <Text>Tu feedback nos sera de gran ayuda.</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button colorPalette="red" mr={3} onClick={() => setShowF(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
  );
};
