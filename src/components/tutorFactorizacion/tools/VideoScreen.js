import React from "react";
import { useDisclosure, Button, Dialog, AspectRatio } from "@chakra-ui/react";

export const VideoScreen = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button colorScheme="cyan" size="sm" variant="outline" onClick={onOpen}>
        ver Tutorial
      </Button>

      <Dialog.Root open={isOpen} onOpenChange={({ open }) => !open && onClose()}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Video tutorial</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <AspectRatio maxW="560px">
                <iframe
                  title="naruto"
                  src="https://www.youtube.com/embed/QhBnZ6NPOY0"
                  allowFullScreen
                />
              </AspectRatio>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};
