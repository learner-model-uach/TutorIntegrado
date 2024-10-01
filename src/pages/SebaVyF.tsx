import { Select, Box, Button, Input, Flex, Text, Stack, Checkbox, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

export default function newExercise() {
  const [cards, setCards] = useState([
    { type: 'enunciado', title: '', question: '', expression: '', summary: '',
      successMessage: '', trueOption: false, falseOption: false, isEditingExpression: false }
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentCardIndex, setCurrentCardIndex] = useState(null);

  const operations = [
    { label: '+', command: '+' },
    { label: '-', command: '-' },
    { label: '\\times', command: '\\times' },
    { label: '\\div', command: '\\div' },
    { label: '\\frac{□}{□}', command: '\\frac{}{}' },
    // Otros símbolos que desees agregar...
  ];

  const addCard = () => {
    setCards([...cards, { type: 'paso', title: '', question: '', expression: '', summary: '', successMessage: '', trueOption: false, falseOption: false, isEditingExpression: false }]);
  };

  const handleCardContentChange = (index, field, newContent) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = newContent;
    setCards(updatedCards);
  };

  const handleOpenLatexModal = (index) => {
    setCurrentCardIndex(index);
    onOpen();
  };

  const insertLatex = (command) => {
    if (currentCardIndex !== null) {
      const updatedCards = [...cards];
      const textBefore = updatedCards[currentCardIndex].expression || '';
      updatedCards[currentCardIndex].expression = textBefore + command;
      setCards(updatedCards);
    }
  };

  const handleOptionChange = (index, option) => {
    const updatedCards = [...cards];
    if (option === 'trueOption') {
      updatedCards[index].trueOption = !updatedCards[index].trueOption;
      updatedCards[index].falseOption = false;
    } else if (option === 'falseOption') {
      updatedCards[index].falseOption = !updatedCards[index].falseOption;
      updatedCards[index].trueOption = false;
    }
    setCards(updatedCards);
  };

  const removeCard = (index) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards);
  };

  return (
    <MathJaxContext>
      <div>
        <Flex direction="column" align="center" justify="center" minH="100vh" p={4}>
          {cards.map((card, index) => (
            <Flex
              key={index}
              mt={4}
              w="100%"
              maxW="800px"
              p={6}
              borderRadius="md"
              bg={card.type === 'enunciado' ? 'blue.200' : 'green.200'}
              boxShadow="md"
              alignItems="center"
              direction="row"
              position="relative"
            >
              <Text
                position="absolute"
                left="-10px"
                top="50%"
                transform="translateY(-50%) rotate(-90deg)"
                transformOrigin="left bottom"
                fontSize="lg"
                fontWeight="bold"
              >
                {card.type === 'enunciado' ? 'Enunciado' : 'Paso'} {index}
              </Text>

              <Box flex="1" w="100%">
                {card.type === 'enunciado' ? (
                  <Input
                    placeholder={`Contenido del enunciado`}
                    value={card.content}
                    onChange={(e) => handleCardContentChange(index, 'content', e.target.value)}
                    bg="white"
                  />
                ) : (
                  <>
                    <Input
                      placeholder="Título del paso"
                      value={card.title}
                      onChange={(e) => handleCardContentChange(index, 'title', e.target.value)}
                      bg="white"
                      mb={2}
                    />
                    <Input
                      placeholder="Pregunta del paso"
                      value={card.question}
                      onChange={(e) => handleCardContentChange(index, 'question', e.target.value)}
                      bg="white"
                      mb={2}
                    />

                    {/* Input de expresión con LaTeX */}
                    <Box display="flex" alignItems="center" w="100%" mb={2}>
                      {card.isEditingExpression ? (
                        <Input
                          id={`latex-input-${index}`}
                          value={card.expression}
                          onChange={(e) => handleCardContentChange(index, 'expression', e.target.value)}
                          onBlur={() => handleCardContentChange(index, 'isEditingExpression', false)}
                          placeholder="Expresión del paso"
                          bg="white"
                          size="md"
                          autoFocus
                        />
                      ) : (
                        <Box
                          p={2}
                          borderWidth="1px"
                          borderRadius="md"
                          w="100%"
                          h="40px"
                          bg="white"
                          onClick={() => handleCardContentChange(index, 'isEditingExpression', true)}
                          cursor="pointer"
                          color={card.expression ? "black" : "gray.400"}
                        >
                          {card.expression ? (
                            <MathJax dynamic inline>
                              {`\\(${card.expression}\\)`}
                            </MathJax>
                          ) : (
                            <Text opacity={0.5}>Expresión del paso</Text>
                          )}
                        </Box>
                      )}
                      <Button size="xs" ml={2} onClick={() => handleOpenLatexModal(index)}>
                        ?
                      </Button>
                    </Box>

                    {/* Modal de ayuda con LaTeX */}
                    <Modal isOpen={isOpen} onClose={onClose} size="xl">
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Ayuda con LaTeX</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          {currentCardIndex !== null && (
                            <>
                              <Input
                                id={`latex-input-${currentCardIndex}`}
                                value={cards[currentCardIndex].expression}
                                onChange={(e) => handleCardContentChange(currentCardIndex, 'expression', e.target.value)}
                                mb={3}
                              />

                              <Flex wrap="wrap" gap={2}>
                                {operations.map((operation, idx) => (
                                  <Button key={idx} onClick={() => insertLatex(operation.command)} size="sm">
                                    <MathJax dynamic inline>{`\\(${operation.label}\\)`}</MathJax>
                                  </Button>
                                ))}
                              </Flex>

                              <Box mt={4} p={2} borderWidth="1px" borderRadius="md">
                                <MathJax dynamic inline>
                                  {`\\(${cards[currentCardIndex].expression}\\)`}
                                </MathJax>
                              </Box>
                            </>
                          )}
                        </ModalBody>

                        <ModalFooter>
                          <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Cerrar
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>

                    <Box mb={4} p={4} bg="yellow.100" borderRadius="md" boxShadow="md">
                      <Text fontWeight="bold">Verdadero y Falso</Text>
                      <Flex align="center" mb={4}>
                        <Button
                          colorScheme={card.trueOption ? 'green' : 'gray'}
                          onClick={() => handleOptionChange(index, 'trueOption')}
                          mr={2}
                        >
                          Verdadero
                        </Button>
                        <Button
                          colorScheme={card.falseOption ? 'red' : 'gray'}
                          onClick={() => handleOptionChange(index, 'falseOption')}
                        >
                          Falso
                        </Button>
                      </Flex>
                    </Box>

                    <Input
                      placeholder="Summary del paso"
                      value={card.summary}
                      onChange={(e) => handleCardContentChange(index, 'summary', e.target.value)}
                      bg="white"
                      mb={4}
                    />
                    <Input
                      placeholder="Mensaje de paso correcto"
                      value={card.successMessage}
                      onChange={(e) => handleCardContentChange(index, 'successMessage', e.target.value)}
                      bg="white"
                      mb={4}
                    />
                    <Button colorScheme="red" onClick={() => removeCard(index)}>
                      Eliminar paso
                    </Button>
                  </>
                )}
              </Box>
            </Flex>
          ))}

          <Stack spacing={4} direction="row" align="center">
            <Button onClick={addCard} alignSelf="center">
              Agregar tarjeta tipo paso
            </Button>
            <Button colorScheme="green" onClick={() => alert('Datos guardados!')}>
              Guardar Cambios
            </Button>
          </Stack>
        </Flex>
      </div>
    </MathJaxContext>
  );
}
