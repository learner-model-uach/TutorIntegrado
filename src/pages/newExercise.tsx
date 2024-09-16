import { Select, Box, Button, Input, Flex, Text, Stack } from '@chakra-ui/react';
import { useState } from 'react';

export default function newExercise() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
  const [cards, setCards] = useState([]); // Array para almacenar las tarjetas

  const topics = {
    Factorización: ['Factorización por factor común', 'Factorización por agrupación', 'Diferencia de cuadrados'],
    ProductosNotables: ['Binomio al cuadrado', 'Trinomio cuadrado perfecto', 'Binomio conjugado'],
    Fracciones: ['Suma y resta de fracciones', 'Multiplicación y división de fracciones'],
    Raíces: ['Raíz cuadrada', 'Raíz cúbica', 'Raíces de índice n'],
  };

  const addCard = () => {
    // Agrega una nueva tarjeta con un tipo por defecto
    setCards([...cards, { type: 'enunciado' }]);
  };

  const handleCardTypeChange = (index, newType) => {
    const updatedCards = [...cards];
    updatedCards[index].type = newType;
    setCards(updatedCards);
  };

  const getCardColor = (type) => {
    switch (type) {
      case 'enunciado':
        return 'blue.200'; // Color para "Enunciado"
      case 'paso':
        return 'green.200'; // Color para "Paso"
      case 'pista':
        return 'yellow.200'; // Color para "Pista"
      default:
        return 'gray.200'; // Color por defecto
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

  const saveData = () => {
    alert('Datos a guardar:\n' +
      'Tópico: ' + selectedTopic + '\n' +
      'Subtópico: ' + selectedSubtopic + '\n' +
      'Tarjetas: ' + JSON.stringify(cards));
  };

  return (
    <>
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
              {/* Texto del tipo de tarjeta, en vertical */}
              <Text
                transform="rotate(-90deg)"
                /*transformOrigin="left top"*/
                width="fit-content"
                mr={4}
                fontSize="lg"
                fontWeight="bold"
              >
                {getCardLabel(card.type)}
              </Text>

              <Box flex="1">
                {/* Select para definir el tipo de tarjeta */}
                <Select
                  bg="white"
                  mb={2}
                  placeholder="Selecciona tipo"
                  value={card.type}
                  onChange={(e) => handleCardTypeChange(index, e.target.value)}
                >
                  <option value="enunciado">Enunciado</option>
                  <option value="paso">Paso</option>
                  <option value="pista">Pista</option>
                </Select>

                {/* Cuadro de texto dentro de la tarjeta */}
                <Input
                  placeholder={`Contenido de la tarjeta ${index + 1}`} 
                  bg="white"
                />
              </Box>
            </Flex>
          ))}

          {/* Botón para agregar una nueva tarjeta */}
          <Stack spacing={4} direction="row" align="center">
          <Button onClick={addCard} alignSelf="center">
              Agregar tarjeta
            </Button>
            <Button colorScheme='green' onClick={saveData} alignSelf="center">
              Guardar Cambios
            </Button>
          </Stack>
        </Flex>
      </div>
    </>
  );
}
