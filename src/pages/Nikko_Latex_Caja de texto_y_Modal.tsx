import { Select, Box, Button, Input, Flex, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react'; // Agregar Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure
import { useState } from 'react';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

export default function newExercise() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [cards, setCards] = useState([]); // Array para almacenar las tarjetas
  const [currentCardIndex, setCurrentCardIndex] = useState(null); // Índice de la tarjeta seleccionada
  const { isOpen, onOpen, onClose } = useDisclosure(); // Estado del modal

  const topics = {
    Factorización: ['Factorización por factor común', 'Factorización por agrupación', 'Diferencia de cuadrados'],
    ProductosNotables: ['Binomio al cuadrado', 'Trinomio cuadrado perfecto', 'Binomio conjugado'],
    Fracciones: ['Suma y resta de fracciones', 'Multiplicación y división de fracciones'],
    Raíces: ['Raíz cuadrada', 'Raíz cúbica', 'Raíces de índice n'],
  };

  const operations = [ //Operaciones del modal
    { label: '+', command: '+' }, { label: '-', command: '-' }, { label: '×', command: '\\times' },
    { label: '÷', command: '\\div' }, { label: '\\frac{□}{□}', command: '\\frac{}{}' }, { label: '=', command: '=' },
    { label: '≠', command: '\\neq' }, { label: '<', command: '<' }, { label: '>', command: '>' },
    { label: '≤', command: '\\leq' }, { label: '≥', command: '\\geq' }, { label: '±', command: '\\pm' },
    { label: '·', command: '\\cdot' }, { label: '\\sqrt{□}', command: '\\sqrt{}' }, { label: '□^n', command: '^{}' },
    { label: '□ₙ', command: '_{}' }, { label: '\\sum', command: '\\sum_{}^{}' }, { label: '\\int_{□}^{□}', command: '\\int_{}^{}' },
    { label: '∞', command: '\\infty' }, { label: 'π', command: '\\pi' }, { label: '\\sin', command: '\\sin' },
    { label: '\\cos', command: '\\cos' }, { label: '\\tan', command: '\\tan' }, { label: '\\log', command: '\\log' },
    { label: '\\ln', command: '\\ln' }, { label: '\\lim_{x \\to {□}}{□}', command: '\\lim_{x \\to {}}' }, { label: '()', command: '()' },
    { label: '[]', command: '\\left[ \\right]' }, { label: '{}', command: '\\left\\{ \\right\\}' }
  ];

  const addCard = () => { //agrega una nueva tarjeta al array
    setCards([...cards, { type: 'enunciado', text: '', latex: '', isEditing: false }]); //text: '' — El texto de la tarjeta está vacío inicialmente. latex: '' — El contenido en LaTeX de la tarjeta está vacío inicialmente. isEditing: false — Indica que la tarjeta no está en modo de edición inicialmente.
  };

  const updateCard = (index, updatedProps) => { //se encarga de actualizar una tarjeta específica en el array 
    setCards(cards.map((card, i) => (i === index ? { ...card, ...updatedProps } : card)));
  };

  const insertLatex = (command) => { // inserta un comando LaTeX en la tarjeta que está actualmente seleccionada para edición (currentCardIndex)
    if (currentCardIndex !== null) {
      const updatedLatex = cards[currentCardIndex].latex + command;
      updateCard(currentCardIndex, { latex: updatedLatex });
    }
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

  return (
    <MathJaxContext> {/*OJO*/}
      <Flex direction="column" align="center" justify="center" minH="100vh" p={4}>
        <Box mb={4} w="100%" maxW="600px">
          <Select
            width="100%"
            placeholder="Tópico"
            mb={2}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setSelectedSubtopic('');
            }}
          >
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

        {cards.map((card, index) => (
          <Flex key={index} mt={4} w="100%" maxW="800px" p={6} borderRadius="md" bg={getCardColor(card.type)} boxShadow="md" alignItems="center">
            <Text transform="rotate(-90deg)" mr={4} fontSize="lg" fontWeight="bold">{getCardLabel(card.type)}</Text>
            <Box flex="1">
              <Select
                mb={2} placeholder="Selecciona tipo"
                value={card.type}
                onChange={(e) => updateCard(index, { type: e.target.value })}
              >
                <option value="enunciado">Enunciado</option>
                <option value="paso">Paso</option>
                <option value="pista">Pista</option>
              </Select>

              <Input
                mb={2} placeholder={`Texto adicional en la tarjeta ${index + 1}`}
                value={card.text || ''}
                onChange={(e) => updateCard(index, { text: e.target.value })}
              />

              {/* CUADRO DE TEXTO PARA LATEX (INICIO)*/}
              <Box display="flex" alignItems="center">
                {card.isEditing ? (
                  <Input
                    id={`latex-input-${index}`} value={card.latex || ''}
                    onChange={(e) => updateCard(index, { latex: e.target.value })}
                    onBlur={() => updateCard(index, { isEditing: false })}
                    placeholder={`Contenido en LaTeX tarjeta ${index + 1}`} autoFocus
                  />
                ) : (
                  <Box p={2} borderWidth="1px" borderRadius="md" onClick={() => updateCard(index, { isEditing: true })} cursor="pointer" flex="1">
                    <MathJax hideUntilTypeset="first" dynamic>{`\\(${card.latex || 'Expresión'}\\)`}</MathJax>
                  </Box>
                )}
                <Button size="xs" ml={2} onClick={() => { setCurrentCardIndex(index); onOpen(); }}>?</Button>
              </Box>
              {/* CUADRO DE TEXTO PARA LATEX (FIN)*/}
            </Box>
          </Flex>
        ))}

        <Button mt={8} onClick={addCard}>Agregar tarjeta</Button>

        {/* Modal de ayuda con LaTeX (INICIO)*/}
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
                    value={cards[currentCardIndex].latex || ''}
                    onChange={(e) => updateCard(currentCardIndex, { latex: e.target.value })}
                    mb={3}
                  />
                  <Flex wrap="wrap" gap={2}>
                    {operations.map(({ label, command }, index) => (
                      <Button key={index} onClick={() => insertLatex(command)} size="sm">
                        <MathJax dynamic inline>{`\\(${label}\\)`}</MathJax>
                      </Button>
                    ))}
                  </Flex>
                  <Box mt={4} p={2} borderWidth="1px" borderRadius="md">
                    <MathJax hideUntilTypeset="first" dynamic>{`\\(${cards[currentCardIndex].latex}\\)`}</MathJax>
                  </Box>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>Cerrar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* Modal de ayuda con LaTeX (FIN)*/}
      </Flex>
    </MathJaxContext>
  );
}
