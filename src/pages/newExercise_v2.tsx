import { Select, Box, Button, Input, Flex, Text, Stack } from '@chakra-ui/react';
import { useState } from 'react';

export default function newExercise() {
  // Estado inicial: tarjeta de tipo "enunciado"
  const [cards, setCards] = useState([{ type: 'enunciado', content: '', subtasks: [] }]);

  const addCard = () => {
    // Agregar siempre una tarjeta de tipo "paso" con 3 inputs de alternativas por defecto
    setCards([...cards, { type: 'paso', content: '', alternatives: ['', '', ''] }]);
  };

  const handleCardContentChange = (index, newContent) => {
    const updatedCards = [...cards];
    updatedCards[index].content = newContent;
    setCards(updatedCards);
  };

  const handleAlternativeChange = (cardIndex, altIndex, newContent) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex].alternatives[altIndex] = newContent;
    setCards(updatedCards);
  };

  const addAlternative = (index) => {
    const updatedCards = [...cards];
    updatedCards[index].alternatives.push('');
    setCards(updatedCards);
  };

  const getCardColor = (type) => {
    switch (type) {
      case 'enunciado':
        return 'blue.200'; // Color para "Enunciado"
      case 'paso':
        return 'green.200'; // Color para "Paso"
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
      default:
        return 'Desconocido';
    }
  };

  const saveData = () => {
    alert('Datos a guardar:\n' + 'Tarjetas: ' + JSON.stringify(cards));
  };

  return (
    <>
      <div>
        <Flex direction="column" align="center" justify="center" minH="100vh" p={4}>
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
              direction="row"
              position="relative"
            >
              {/* Texto del tipo de tarjeta, rotado -90 grados y posicionado a la izquierda */}
              <Text
                position="absolute"
                left="-10px"  // Ajusta este valor para la distancia horizontal
                top="50%"     // Coloca el texto en el centro verticalmente
                transform="translateY(-50%) rotate(-90deg)"  // Centra el texto verticalmente y lo rota
                transformOrigin="left bottom"  // Mantiene la rotación desde la esquina inferior izquierda
                fontSize="lg"
                fontWeight="bold"
              >
                {getCardLabel(card.type) +" "+ index}
              </Text>

              <Box flex="1" w="100%">
                {/* Tarjeta de tipo "enunciado" */}
                {card.type === 'enunciado' ? (
                  <>
                    <Input
                      placeholder={`Contenido del enunciado`}
                      value={card.content}
                      onChange={(e) => handleCardContentChange(index, e.target.value)}
                      bg="white"
                    />
                  </>
                ) : (
                  <>
                    {/* Cuadro de texto dentro de la tarjeta tipo "paso" */}
                    <Input
                      placeholder={`Titulo del paso ${index}`}
                      value={card.content}
                      onChange={(e) => handleCardContentChange(index, e.target.value)}
                      bg="white"
                      mb={4}
                    />
                    <Input
                      placeholder={`Pregunta del paso`}
                      value={card.content}
                      onChange={(e) => handleCardContentChange(index, e.target.value)}
                      bg="white"
                      mb={4}
                    />
                    <Input
                      placeholder={`Expresion del paso`}
                      value={card.content}
                      onChange={(e) => handleCardContentChange(index, e.target.value)}
                      bg="white"
                      mb={4}
                    />

                    {/* Sub-tarjeta de "Alternativas" */}
                    <Box mb={4} p={4} bg="yellow.100" borderRadius="md" boxShadow="md">
                      <Text fontWeight="bold" mb={2}>
                        Alternativas
                      </Text>

                      {/* Inputs de texto para las alternativas */}
                      {card.alternatives.map((alt, altIndex) => (
                        <Input
                          key={altIndex}
                          mt={2}
                          placeholder={`Alternativa ${altIndex + 1}`}
                          value={alt}
                          onChange={(e) => handleAlternativeChange(index, altIndex, e.target.value)}
                          bg="white"
                        />
                      ))}

                      {/* Botón para agregar más inputs de alternativas */}
                      <Button mt={4} onClick={() => addAlternative(index)}>
                        Agregar alternativa
                      </Button>
                    </Box>
                    <Input
                      placeholder={`Summary del paso`}
                      value={card.content}
                      onChange={(e) => handleCardContentChange(index, e.target.value)}
                      bg="white"
                      mb={4}
                    />
                    <Input
                      placeholder={`Mensaje de paso correcto`}
                      value={card.content}
                      onChange={(e) => handleCardContentChange(index, e.target.value)}
                      bg="white"
                      mb={4}
                    />
                  </>
                )}
              </Box>
            </Flex>
          ))}

          {/* Botón para agregar una nueva tarjeta (solo tarjetas de tipo "paso") */}
          <Stack spacing={4} direction="row" align="center">
            <Button onClick={addCard} alignSelf="center">
              Agregar tarjeta tipo paso
            </Button>
            <Button colorScheme="green" onClick={saveData} alignSelf="center">
              Guardar Cambios
            </Button>
          </Stack>
        </Flex>
      </div>
    </>
  );
}
