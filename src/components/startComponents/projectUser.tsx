import { Stack, Box } from "@chakra-ui/react";
import { FaBars, FaArrowLeft } from "react-icons/fa";

export const AssigndUser = () => {
  return (
    <Stack width="100%" padding="1em" alignItems="center">
      <Stack padding="2em">
        <Box
          bg="blue.200"
          p={4}
          borderRadius="md"
          textAlign="center"
          fontWeight="bold"
          marginBottom={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <FaBars size={20} color="gray" style={{ marginRight: "2px" }} />{" "}
          <FaArrowLeft style={{ marginRight: "4px" }} />
          Comienza escogiendo un tópico en el menú de la izquierda
        </Box>
      </Stack>
    </Stack>
  );
};
