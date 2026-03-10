import { Image, Link, Stack, Text, Box } from "@chakra-ui/react";
export const NewUser = () => {
  return (
    <Stack width="80%" paddingTop="2rem" alignItems="center">
      <Box
        position="relative"
        bg="speechBubble1"
        padding="4"
        rounded="2xl"
        margin="2"
        _after={{
          content: '""',
          position: "absolute",
          bottom: "-6px",
          left: "45%",
          width: "12px",
          height: "12px",
          bg: "speechBubble1",
          transform: "rotate(45deg)",
        }}
      >
        Comienza ingresando en el botón{" "}
        <Text fontWeight="semibold" display="inline">
          Login{" "}
        </Text>
        a la izquierda. Si no tienes cuenta de usuario, puedes solicitarla en este{" "}
        <Link
          color="blue.500"
          variant="underline"
          href="https://forms.gle/dJgg9H53fTxm56mHA"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text fontWeight="semibold" display="inline">
            formulario{" "}
          </Text>
        </Link>
        .
      </Box>
      <Image src="/img/Mateo-izq.svg" alt="Robot" width="150px" marginTop="10px" />
    </Stack>
  );
};
