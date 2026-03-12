import { Stack, Box, Image } from "@chakra-ui/react";
import { FaBars, FaArrowLeft } from "react-icons/fa";

export const AssigndUser = () => {
  return (
    <Stack width="100%" padding="1em" alignItems="center">
      <Stack padding="2em">
        <Box
          display="flex"
          alignItems="center"
          position="relative"
          bg="speechBubble2"
          padding="4"
          rounded="2xl"
          _after={{
            content: '""',
            position: "absolute",
            bottom: "-6px",
            left: "45%",
            width: "12px",
            height: "12px",
            bg: "speechBubble2",
            transform: "rotate(45deg)",
          }}
        >
          <FaBars size={20} color="gray" style={{ marginRight: "2px" }} />{" "}
          <FaArrowLeft style={{ marginRight: "4px" }} />
          Comienza escogiendo un tópico en el menú de la izquierda
        </Box>
      </Stack>
      <Image src="/img/Mateo-izq.svg" alt="Robot" width="150px" />
    </Stack>
  );
};
