<<<<<<< HEAD
import React, { useState, useRef } from "react";
=======
import React, { useState, useEffect, useRef } from "react";
>>>>>>> 234d240d4f3c36142b6b205b835af09cd354982a
import {
  Box,
  VStack,
  Button,
  Input,
<<<<<<< HEAD
=======
  Text,
>>>>>>> 234d240d4f3c36142b6b205b835af09cd354982a
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  Portal,
} from "@chakra-ui/react";
import { useAction } from "../utils/action";
import { sessionState } from "./SessionState";

export const EmojiBar = () => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [inputReason, setInputReason] = useState(""); // Estado para almacenar la razón del input
  const inputRef = useRef(null);
  const startAction = useAction({});
  const emojis = [
    { src: "/img/feliz.png", alt: "feliz" },
    { src: "/img/alivio.png", alt: "alivio" },
    { src: "/img/eureka2.png", alt: "eureka" },
    { src: "/img/sorpresa.png", alt: "sorpresa" },
    { src: "/img/neutral.png", alt: "neutral" },
    { src: "/img/pensativo.png", alt: "pensativo" },
    { src: "/img/aburrido.png", alt: "aburrimiento" },
    { src: "/img/angustia.png", alt: "angustia" },
    { src: "/img/enojado.png", alt: "enojo" },
  ];

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
    setSelectedEmoji(null); // Oculta el Popover
  };

  return (
    <Box maxW="sm" p={1} boxShadow="sm" position="relative" display="flex" alignItems="center">
      <VStack spacing={4} align="center">
        {emojis.map((emoji, index) => (
          <Popover key={index} closeOnBlur={false} placement="left" initialFocusRef={inputRef}>
            <PopoverTrigger>
              <Button
                variant="ghost"
                fontSize="2xl"
                transition="transform 0.3s ease-in-out"
                _hover={{ transform: "scale(1.3)" }}
                onClick={() => setSelectedEmoji(emoji)}
              >
                <img src={emoji.src} width="40" height="40" alt={emoji.alt} />
              </Button>
            </PopoverTrigger>
            {selectedEmoji && selectedEmoji.alt === emoji.alt && (
              <Portal>
                <PopoverContent>
                  <PopoverHeader>Cuéntale a Mateo por qué te sientes así</PopoverHeader>
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Box>
                      <Input
                        placeholder="Escribe tu feedback aquí..."
                        value={inputReason}
                        onChange={e => setInputReason(e.target.value)}
                        ref={inputRef}
                      />
                      <Button mt={4} colorScheme="blue" onClick={handleSend}>
                        Enviar
                      </Button>
                    </Box>
                  </PopoverBody>
                  <PopoverFooter></PopoverFooter>
                </PopoverContent>
              </Portal>
            )}
          </Popover>
        ))}
      </VStack>
    </Box>
  );
};
