import React, { useState, useEffect, useRef } from "react";
import { Box, Button, VStack, Input, Text } from "@chakra-ui/react";
import { useAction } from "../utils/action";
import { sessionState } from "./SessionState";

export const EmojiBar = () => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [inputReason, setInputReason] = useState(""); // Estado para almacenar la razón del input
  const [showInput, setShowInput] = useState(false);
  const [nubePosition, setNubePosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef();
  const startAction = useAction({});
  const emojis = [
    { src: "/img/feliz.png", alt: "feliz" },
    { src: "/img/alivio.png", alt: "alivio" },
    { src: "/img/cool.png", alt: "cool" },
    { src: "/img/eureka2.png", alt: "eureka" },
    { src: "/img/sorpresa.png", alt: "sorpresa" },
    { src: "/img/neutral.png", alt: "neutral" },
    { src: "/img/pensativo.png", alt: "pensativo" },
    { src: "/img/aburrido.png", alt: "aburrimiento" },
    { src: "/img/angustia.png", alt: "angustia" },
  ];

  const estilos = {
    contenedor: {
      display: "flex",
      alignItems: "center",
    },
    nube: {
      position: "absolute",
      padding: "20px",
      backgroundColor: "#f1f1f1",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      zIndex: 1,
      textAlign: "center",
      transition: "top 0.3s ease-in-out, left 0.3s ease-in-out",
    },
    input: {
      marginTop: "10px",
    },
    button: {
      marginTop: "10px",
      backgroundColor: "#3182ce",
      color: "white",
    },
  };

  const handleEmojiClick = (emoji, event) => {
    setSelectedEmoji(emoji);
    setShowInput(true);
    const rect = event.target.getBoundingClientRect();
    setNubePosition({ top: rect.top + window.scrollY - 50, left: rect.left - 2140 });
  };

  const handleSend = () => {
    startAction({
      verbName: "reportEmoji",
      contentID: sessionState.currentContent.id,
      topicID: sessionState.topic,
      extra: {
        emoji: selectedEmoji.alt,
        reason: inputReason,
        page: window.location.pathname, // Asumiendo que quieres capturar la URL actual
      },
    });
    setInputReason("");
    setShowInput(false);
  };

  const handleClickOutside = event => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowInput(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <Box maxW="sm" p={1} boxShadow="sm" position="relative" style={estilos.contenedor}>
      <VStack spacing={4} align="center">
        {emojis.map((emoji, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={event => handleEmojiClick(emoji, event)}
            fontSize="2xl"
            transition="transform 0.3s ease-in-out"
            _hover={{ transform: "scale(1.3)" }}
          >
            <img src={emoji.src} width="40" height="40" />
          </Button>
        ))}
      </VStack>
      {showInput && (
        <Box
          style={{ ...estilos.nube, top: nubePosition.top, left: nubePosition.left }}
          ref={inputRef}
        >
          <Text>Cuéntale a Mateo por qué te sientes así</Text>
          <Input
            placeholder="Escribe tu feedback aquí..."
            style={estilos.input}
            value={inputReason}
            onChange={e => setInputReason(e.target.value)}
          />
          <Button style={estilos.button} onClick={handleSend}>
            Enviar
          </Button>
        </Box>
      )}
    </Box>
  );
};
