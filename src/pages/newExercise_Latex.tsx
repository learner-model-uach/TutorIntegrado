import {
    Select, Box, Button, Input, Flex, Text, Modal, ModalOverlay, ModalContent,
    ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { MathJaxContext, MathJax } from 'better-react-mathjax';
  
  export default function newExercise() {
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedSubtopic, setSelectedSubtopic] = useState('');
    const [cards, setCards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(null); // Índice de la tarjeta actual que usa el modal
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    const topics = {
      Factorización: ['Factorización por factor común', 'Factorización por agrupación', 'Diferencia de cuadrados'],
      ProductosNotables: ['Binomio al cuadrado', 'Trinomio cuadrado perfecto', 'Binomio conjugado'],
      Fracciones: ['Suma y resta de fracciones', 'Multiplicación y división de fracciones'],
      Raíces: ['Raíz cuadrada', 'Raíz cúbica', 'Raíces de índice n'],
    };
  
    const operations = [
      { label: '\\frac{}{}', command: '\\frac{}{}' },
      { label: '\\sqrt{}', command: '\\sqrt{}' },
      { label: 'x^n', command: '^{}' },
      { label: 'x_n', command: '_{}' },
      { label: '\\sum_{}^{}', command: '\\sum_{}^{}' }
    ];
  
    const addCard = () => {
      setCards([...cards, { type: 'enunciado', text: '', latex: '' }]); // Añadimos un campo text y latex por tarjeta
    };
  
    const handleCardTypeChange = (index, newType) => {
      const updatedCards = [...cards];
      updatedCards[index].type = newType;
      setCards(updatedCards);
    };
  
    const getCardColor = (type) => {
      switch (type) {
        case 'enunciado':
          return 'blue.200';
        case 'paso':
          return 'green.200';
        case 'pista':
          return 'yellow.200';
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
        case 'pista':
          return 'Pista';
        default:
          return 'Desconocido';
      }
    };
  
    // Función para abrir el modal y configurar la tarjeta actual
    const handleOpenLatexModal = (index) => {
      setCurrentCardIndex(index); // Guardar el índice de la tarjeta que está editando
      onOpen(); // Abrir el modal
    };
  
    // Función para insertar comandos LaTeX en la tarjeta actual
    const insertLatex = (command) => {
      if (currentCardIndex !== null) {
        const updatedCards = [...cards];
        updatedCards[currentCardIndex].latex += command;
        setCards(updatedCards);
      }
    };
  
    return (
      <MathJaxContext>
        <div>
          <Flex direction="column" align="center" justify="center" minH="100vh" p={4}>
            <Box mb={4} w="100%" maxW="600px">
              <Select
                width="100%"
                placeholder="Tópico"
                mb={2}
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                  setSelectedSubtopic('');
                }}>
                {Object.keys(topics).map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </Select>
              {selectedTopic && (
                <Select
                  width="100%"
                  placeholder="Subtópico"
                  value={selectedSubtopic}
                  onChange={(e) => setSelectedSubtopic(e.target.value)}
                >
                  {topics[selectedTopic].map(subtopic => (
                    <option key={subtopic} value={subtopic}>{subtopic}</option>
                  ))}
                </Select>
              )}
            </Box>
  
            {/* Renderiza las tarjetas */}
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
              >
                <Text
                  transform="rotate(-90deg)"
                  width="fit-content"
                  mr={4}
                  fontSize="lg"
                  fontWeight="bold"
                >
                  {getCardLabel(card.type)}
                </Text>
  
                <Box flex="1" position="relative">
                  <Select
                    mb={2}
                    placeholder="Selecciona tipo"
                    value={card.type}
                    onChange={(e) => handleCardTypeChange(index, e.target.value)}
                  >
                    <option value="enunciado">Enunciado</option>
                    <option value="paso">Paso</option>
                    <option value="pista">Pista</option>
                  </Select>
  
                  {/* Input adicional entre el selector y LaTeX */}
                  <Input
                    placeholder={`Texto adicional en la tarjeta ${index + 1}`}
                    value={card.text || ''}
                    onChange={(e) => {
                      const updatedCards = [...cards];
                      updatedCards[index].text = e.target.value;
                      setCards(updatedCards);
                    }}
                    mb={2}
                  />
  
                  {/* Input para escribir LaTeX */}
                  <Box position="relative">
                    <Input
                      placeholder={`Contenido de la tarjeta ${index + 1} en LaTeX`}
                      value={card.latex || ''}
                      onChange={(e) => {
                        const updatedCards = [...cards];
                        updatedCards[index].latex = e.target.value;
                        setCards(updatedCards);
                      }}
                      pr="50px" // Espacio para el botón en el input
                    />
                    {/* Botón para abrir el modal de ayuda con LaTeX dentro de la caja de texto */}
                    <Button
                      position="absolute"
                      right="5px"
                      top="5px"
                      size="xs"
                      onClick={() => handleOpenLatexModal(index)}
                    >
                      ?
                    </Button>
                  </Box>
  
                </Box>
              </Flex>
            ))}
  
            <Button mt={8} onClick={addCard} alignSelf="center">
              Agregar tarjeta
            </Button>
  
            {/* Modal para ayudar con LaTeX */}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Ayuda con LaTeX</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {currentCardIndex !== null && (
                    <>
                      <Input
                        value={cards[currentCardIndex].latex || ''}
                        onChange={(e) => {
                          const updatedCards = [...cards];
                          updatedCards[currentCardIndex].latex = e.target.value;
                          setCards(updatedCards);
                        }}
                      />
  
                      <Flex mt={4} wrap="wrap" gap={2}>
                        {operations.map((operation, index) => (
                          <Button key={index} onClick={() => insertLatex(operation.command)}>
                            <MathJax dynamic inline>{`\\(${operation.label}\\)`}</MathJax>
                          </Button>
                        ))}
                      </Flex>
  
                      {/* Vista previa en el modal */}
                      <Box mt={4} p={2} borderWidth="1px" borderRadius="md">
                        <Text fontWeight="bold">Vista previa:</Text>
                        <MathJax hideUntilTypeset={"first"} dynamic>{`\\(${cards[currentCardIndex].latex}\\)`}</MathJax>
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
          </Flex>
        </div>
      </MathJaxContext>
    );
  }
  