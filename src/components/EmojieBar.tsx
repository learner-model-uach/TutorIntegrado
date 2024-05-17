import React, { useState } from 'react';
import { Box, Button, VStack} from '@chakra-ui/react';
import { useAction } from "../utils/action";

export const EmojiBar = () => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const startAction = useAction();
  const emojis = ["😀", "😄", "😁", "😆", "😅", "😂"];

  const estilos = {
    contenedor: {
        display: 'flex',
        alignItems: 'center'
    }
  };

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
        startAction({
          verbName: "savedEmoji",
          // stepID: stepID + "",
          // contentID: exercise.code,
          // topicID: topicId,
        });
    // Aquí puedes hacer algo con el emoji seleccionado,
    // como enviarlo a una API o almacenarlo.
    console.log(`Emoji seleccionado: ${emoji}`);
  };

  return (
    <Box maxW="sm" p={1} boxShadow="sm" style={estilos.contenedor}>
      <VStack spacing={4} align="center">
        {emojis.map((emoji, index) => (
          <Button key={index} variant="ghost" onClick={() => handleEmojiClick(emoji)} fontSize="2xl" transition="transform 0.3s ease-in-out"
          _hover={{ transform: "scale(2.0)" }}>
            {emoji}
          </Button>
        ))}
      </VStack>
      {/* {selectedEmoji && <Text mt={4}>Has seleccionado: {selectedEmoji}</Text>} */}
    </Box>
  );
};