import React from 'react'
import { useDisclosure,
    Button, 
    Modal, 
    ModalOverlay, 
    ModalContent, ModalHeader, ModalCloseButton, 
    ModalBody, AspectRatio } from "@chakra-ui/react"

export const VideoScreen = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button colorScheme="cyan"
                size="sm"
                variant="outline"
                onClick={onOpen}>ver Tutorial</Button>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Video tutorial</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AspectRatio maxW="560px" >
                <iframe
                    title="naruto"
                    src="https://www.youtube.com/embed/QhBnZ6NPOY0"
                    allowFullScreen
                />
            </AspectRatio>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
