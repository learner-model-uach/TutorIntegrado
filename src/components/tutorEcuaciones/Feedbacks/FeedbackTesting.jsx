import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Stack,
  Text,
} from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";

import { useDisclosure } from "@chakra-ui/hooks";
export const FeedbackTesting = ({ showFeedback }) => {
  const [showF, setShowF] = useState(false);

  useEffect(() => {
    setShowF(showFeedback);
  }, [showFeedback]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Modal isOpen={showF} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader style={{ margin: "auto" }}>
            Felicidades has completado todos los ejercicios
          </ModalHeader>
          <ModalCloseButton onClick={() => setShowF(false)} />
          <ModalBody style={{ fontSize: "20px", margin: "auto" }}>
            <Text>
              {" "}
              Gracias por participar de esta prueba general de usabilidad.
            </Text>
            <Text>Tu feedback nos sera de gran ayuda.</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => setShowF(false)}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
