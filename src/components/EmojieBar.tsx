import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, VStack, Input, Text } from '@chakra-ui/react';
import { useAction } from "../utils/action";
import localforage from "localforage";


export const EmojiBar = () => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [nubePosition, setNubePosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef();
  const startAction = useAction();
  const emojis = [
    { src: "/img/feliz.png"},
    { src: "/img/alivio.png"},
    { src: "/img/cool.png"},
    { src: "/img/eureka2.png"},
    { src: "/img/sorpresa.png"},
    { src: "/img/neutral.png"},
    { src: "/img/pensativo.png"},
    { src: "/img/aburrido.png"},
    { src: "/img/angustia.png"}
  ];

  const estilos = {
    contenedor: {
      display: 'flex',
      alignItems: 'center'
    },
    nube: {
      position: 'absolute',
      padding: '20px',
      backgroundColor: '#f1f1f1',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      zIndex: 1,
      textAlign: 'center',
      transition: 'top 0.3s ease-in-out, left 0.3s ease-in-out'
    },
    input: {
      marginTop: '10px'
    },
    button: {
      marginTop: '10px',
      backgroundColor: '#3182ce',
      color: 'white'
    }
  };

  const handleEmojiClick = (emoji, event) => {
    setSelectedEmoji(emoji);
    setShowInput(true);
    
    const rect = event.target.getBoundingClientRect();
    setNubePosition({ top: rect.top + window.scrollY - 50, left: rect.left - 2140 });
    // startAction({
    //   verbName: "reportEmoji",
    // });
    console.log(`Emoji seleccionado: ${emoji.alt}`);
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowInput(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <Box maxW="sm" p={1} boxShadow="sm" position="relative" style={estilos.contenedor}>
      <VStack spacing={4} align="center">
        {emojis.map((emoji, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={(event) => handleEmojiClick(emoji, event)}
            fontSize="2xl"
            transition="transform 0.3s ease-in-out"
            _hover={{ transform: "scale(1.3)" }}
          >
            <img src={emoji.src} width="40" height="40" />
          </Button>
        ))}
      </VStack>
      {showInput && (
        <Box style={{ ...estilos.nube, top: nubePosition.top, left: nubePosition.left }} ref={inputRef}>
          <Text>Cuéntale a Mateo por qué te sientes así</Text>
          <Input placeholder="Escribe tu feedback aquí..." style={estilos.input} />
          <Button style={estilos.button}>Enviar</Button>
        </Box>
      )}
    </Box>
  );
};