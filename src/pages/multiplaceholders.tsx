import { Select, Box, Button, Input, Flex, Text, Stack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

//aaaa prueba

export default function newExercise() {
  const [cards, setCards] = useState([
    { type: 'enunciado', title: '', question: '', expression: '', summary: '', successMessage: '', placeholders: '', respuestas: '', isEditingExpression: false, isEditingPlaceholders: false }
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentCardIndex, setCurrentCardIndex] = useState(null);
  const [isEditingPlaceholders, setIsEditingPlaceholders] = useState(false); // Nuevo estado para distinguir qué campo se está editando

  const operations = [
    { label: '+', command: '+' },
    { label: '-', command: '-' },
    { label: '\\times', command: '\\times' },
    { label: '\\div', command: '\\div' },
    { label: '\\frac{□}{□}', command: '\\frac{}{}' },
    // Otros símbolos que desees agregar...
  ];

  const addCard = () => {
    setCards([...cards, { type: 'paso', title: '', question: '', expression: '', summary: '', successMessage: '', placeholders: '', respuestas: '', isEditingExpression: false, isEditingPlaceholders: false }]);
  };

  const handleCardContentChange = (index, field, newContent) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = newContent;
    setCards(updatedCards);
  };

  const handleFocus = (index, field) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = true;
    setCards(updatedCards);
  };

  const handleBlur = (index, field) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = false;
    setCards(updatedCards);
  };

  // Modificada para aceptar el parámetro 'editingPlaceholders'
  const handleOpenLatexModal = (index, editingPlaceholders = false) => {
    setCurrentCardIndex(index);
    setIsEditingPlaceholders(editingPlaceholders); // Cambia según si se está editando 'placeholders' o 'expression'
    onOpen();
  };

  const insertLatex = (command) => {
    if (currentCardIndex !== null) {
      const updatedCards = [...cards];
      
      if (isEditingPlaceholders) {
        const textBefore = updatedCards[currentCardIndex].placeholders || "";
        updatedCards[currentCardIndex].placeholders = textBefore + command;
      } else {
        const textBefore = updatedCards[currentCardIndex].expression || "";
        updatedCards[currentCardIndex].expression = textBefore + command;
      }

      setCards(updatedCards);
    }
  };

  const getCardColor = (type) => {
    switch (type) {
      case 'enunciado':
        return 'blue.200';
      case 'paso':
        return 'green.200';
      default:
        return 'gray.200';
    }
  };

  const getCardLabel = (type) => {
    switch (type) {
      case 'enunciado':
        return 'Enunciado';
      case 'paso':
        return 'Paso';
      default:
        return 'Desconocido';
    }
  };

  const saveData = () => {
    alert('Datos a guardar:\n' + 'Tarjetas: ' + JSON.stringify(cards));
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
              bg={getCardColor(card.type)}
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
                {getCardLabel(card.type) + " " + index}
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
                          onBlur={() => handleBlur(index, 'isEditingExpression')}
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
                        h="40px" // Ajusta la altura según sea necesario para que coincida con la otra caja
                        bg="white"
                        onClick={() => handleFocus(index, 'isEditingExpression')}
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
                      <Button size="xs" ml={2} onClick={() => handleOpenLatexModal(index, false)}>
                        ?
                      </Button>
                    </Box>

                    {/* Input de expresión con placeholders */}
                    <Box mb={4} p={4} bg="yellow.100" borderRadius="md" boxShadow="md">
                      <Text fontWeight="bold" mb={2}>
                        Multiple Placeholders
                      </Text>
                      <Flex align="center">
                        {/* Caja de "Expresión con placeholders" */}
                        {card.isEditingPlaceholders ? (
                          <Input
                            id={`latex-placeholder-input-${index}`}
                            value={card.placeholders}
                            onChange={(e) => handleCardContentChange(index, 'placeholders', e.target.value)}
                            onBlur={() => handleBlur(index, 'isEditingPlaceholders')}
                            placeholder="Expresión con placeholders"
                            autoFocus
                            bg="white"
                            w="50%" // Ajusta el ancho según tus necesidades
                          />
                        ) : (
                          <Box
                            p={2}
                            borderWidth="1px"
                            borderRadius="md"
                            w="50%" // Ajusta el ancho según tus necesidades
                            bg="white"
                            onClick={() => handleFocus(index, 'isEditingPlaceholders')}
                            cursor="pointer"
                            color={card.placeholders ? "black" : "gray.400"}
                          >
                            <MathJax dynamic inline>
                              {card.placeholders ? `\\(${card.placeholders}\\)` : 'Expresión con placeholders'}
                            </MathJax>
                          </Box>
                        )}

                        {/* Botón de ayuda "?" */}
                        <Button size="xs" ml={2} onClick={() => handleOpenLatexModal(index, true)}>
                          ?
                        </Button>

                        {/* Caja de "Respuestas separadas por coma" */}
                        <Input
                          placeholder="Respuestas separadas por coma"
                          value={card.respuestas}
                          onChange={(e) => handleCardContentChange(index, 'respuestas', e.target.value)}
                          bg="white"
                          w="50%" // Ajusta el ancho según tus necesidades
                          ml={2}  // Añade un margen a la izquierda para separarlo del botón "?"
                        />
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
                  </>
                )}
              </Box>
            </Flex>
          ))}

          <Stack spacing={4} direction="row" align="center">
            <Button onClick={addCard} alignSelf="center">
              Agregar tarjeta tipo paso
            </Button>
            <Button colorScheme="green" onClick={saveData} alignSelf="center">
              Guardar Cambios
            </Button>
          </Stack>
        </Flex>

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
                    value={isEditingPlaceholders
                      ? cards[currentCardIndex].placeholders
                      : cards[currentCardIndex].expression}
                    onChange={(e) => handleCardContentChange(
                      currentCardIndex,
                      isEditingPlaceholders ? 'placeholders' : 'expression',
                      e.target.value
                    )}
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
                      {`\\(${isEditingPlaceholders
                        ? cards[currentCardIndex].placeholders
                        : cards[currentCardIndex].expression}\\)`}
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
      </div>
    </MathJaxContext>
  );
}
