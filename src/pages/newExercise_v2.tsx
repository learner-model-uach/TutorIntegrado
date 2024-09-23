import { Select, Box, Button, Input, Flex, Text, Stack, Checkbox } from '@chakra-ui/react';
import { useState } from 'react';


export default function newExercise() {
  // Estado inicial: tarjeta de tipo "enunciado"
  const [cards, setCards] = useState([
    { type: 'enunciado', title: '', question: '', expression: '', summary: '',
      successMessage: '', alternatives: [{ text:'', correct: false},{ text: '', correct: false}] }])

  const addCard = () => {
    // Agregar siempre una tarjeta de tipo "paso" con 3 inputs de alternativas por defecto
    setCards([...cards, { type: 'paso', content: '', alternatives: [{ text:'', correct: false},{ text: '', correct: false}] }]);
  };


  const handleCardContentChange = (index, field,newContent) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = newContent;
    setCards(updatedCards);
  };

  const handleAlternativeChange = (cardIndex, altIndex, newContent) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex].alternatives = updatedCards[cardIndex].alternatives.map((alt, index) => ({
      ...alt,
      text: index === altIndex ? newContent : alt.text,
    }));
    setCards(updatedCards);
  };

  const addAlternative = (index) => {
    const updatedCards = [...cards];
    updatedCards[index].alternatives.push('');
    setCards(updatedCards);
  };

  const handleCorrectChange = (cardIndex, altIndex) => {
    const updatedCards = [...cards];
    updatedCards[cardIndex].alternatives = updatedCards[cardIndex].alternatives.map((alt, index) => ({
      ...alt,
      correct: index === altIndex
    }));
    setCards(updatedCards);
  };

  // Elimina una alternativa especifica de una tarjeta especifica. (Min 2 alternativas)
  const removeAlternative = (cardIndex, altIndex) => {
    const updatedCards = [...cards];
    if (updatedCards[cardIndex].alternatives.length > 2) {
      updatedCards[cardIndex].alternatives.splice(altIndex, 1);
      setCards(updatedCards);
    }
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
                      placeholder="Titulo del paso"
                      value={card.title}
                      onChange={(e) => handleCardContentChange(index,'title',e.target.value)}
                      bg="white"
                      mb={2}
                    />
                    <Input
                      placeholder={`Pregunta del paso`}
                      value={card.question}
                      onChange={(e) => handleCardContentChange(index, 'question',e.target.value)}
                      bg="white"
                      mb={2}
                    />
                    <Input
                      placeholder={`Expresion del paso`}
                      value={card.expression}
                      onChange={(e) => handleCardContentChange(index, 'expression',e.target.value)}
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
                        <Flex key={altIndex} align="center">
                          <Input
                            placeholder={`Alternativa ${altIndex + 1}`}
                            value={alt.text}
                            onChange={(e) => handleAlternativeChange(index, altIndex, e.target.value)}
                            bg="white"
                            mr={2}
                            mb={2}
                          />
                          <Checkbox
                            isChecked={alt.correct}
                            onChange={() => handleCorrectChange(index, altIndex)}
                            mr={2}
                          >
                            Correcta
                          </Checkbox>
                          {card.alternatives.length > 2 && (
                            <Button colorScheme="red" onClick={() => removeAlternative(index, altIndex)}>
                              Eliminar
                            </Button>
                          )}
                        </Flex>
                        ))}

                      {/* Botón para agregar más inputs de alternativas */}
                      <Button mt={4} onClick={() => addAlternative(index)}>
                        Agregar alternativa
                      </Button>
                    </Box>
                    <Input
                      placeholder={`Summary del paso`}
                      value={card.summary}
                      onChange={(e) => handleCardContentChange(index, 'summary',e.target.value)}
                      bg="white"
                      mb={4}
                    />
                    <Input
                      placeholder={`Mensaje de paso correcto`}
                      value={card.successMessage}
                      onChange={(e) => handleCardContentChange(index, 'successMessage',e.target.value)}
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
