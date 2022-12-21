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
import { useRouter } from "next/router";

import { useDisclosure } from "@chakra-ui/hooks";
export const FeedbackTutorial = ({ showFeedback }) => {
  const [showF, setShowF] = useState(false);

  const { push } = useRouter();

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
            Has completado correctamente el tutorial
          </ModalHeader>
          <ModalCloseButton onClick={() => setShowF(false)} />
          <ModalBody style={{ fontSize: "20px", margin: "auto" }}>
            <Text> Ahora iremos a resolver más ejercicios</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => push(`/practice/`)}>
              Siguiente
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
