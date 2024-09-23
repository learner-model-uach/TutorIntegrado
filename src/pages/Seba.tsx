import { 
  Select, Box, Button, Input, Flex, Text, Stack, Modal, 
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, 
  ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';

export default function newExercise() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [exerciseName, setExerciseName] = useState('');
  const [exerciseCode, setExerciseCode] = useState('');
  const [exerciseTopic, setExerciseTopic] = useState('');

  const [tempExerciseName, setTempExerciseName] = useState('');
  const [tempExerciseCode, setTempExerciseCode] = useState('');
  const [tempExerciseTopic, setTempExerciseTopic] = useState('');

  const handleNewButtonClick = () => {
    setTempExerciseName(exerciseName);
    setTempExerciseCode(exerciseCode);
    setTempExerciseTopic(exerciseTopic);
    onOpen();
  };

  const handleSave = () => {
    setExerciseName(tempExerciseName);
    setExerciseCode(tempExerciseCode);
    setExerciseTopic(tempExerciseTopic);
    onClose();
  };

  return (
    <Box>
      <Button onClick={handleNewButtonClick}>Guardar</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width="80%" maxWidth="800px">
          <ModalHeader>Rellene los campos solicitados</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <Flex align="center">
                <Text width="200px">Nombre Del Ejercicio:</Text>
                <Input 
                  placeholder="Nombre Del Ejercicio" 
                  value={tempExerciseName} 
                  onChange={(e) => setTempExerciseName(e.target.value)} 
                />
              </Flex>
              <Flex align="center">
                <Text width="200px">Codigo Del Ejercicio:</Text>
                <Input 
                  placeholder="Codigo Del Ejercicio" 
                  value={tempExerciseCode} 
                  onChange={(e) => setTempExerciseCode(e.target.value)} 
                />
              </Flex>
              <Flex align="center">
                <Text width="200px">Topico del Ejercicio:</Text>
                <Select 
                  placeholder="Seleccione un Topico" 
                  value={tempExerciseTopic} 
                  onChange={(e) => setTempExerciseTopic(e.target.value)} 
                >
                  <option value="Factorización">Factorización</option>
                  <option value="Logica y Conjunto">Logica y Conjunto</option>
                  <option value="Productos Notables">Productos Notables</option>
              </Select>
              </Flex>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box mt={5}>
        <Text><strong>Nombre Del Ejercicio:</strong> {exerciseName}</Text>
        <Text><strong>Codigo Del Ejercicio:</strong> {exerciseCode}</Text>
        <Text><strong>Topico del Ejercicio:</strong> {exerciseTopic}</Text>
      </Box>
    </Box>
  );
}

