import { Box, Link } from "@chakra-ui/react";

export const NewUser = () => {
  return (
    <>
      <Box marginBottom={2} marginTop={10} p={4} bg="orange.400" textAlign="center">
        ¡Oops! Tu cuenta aún no ha sido habilitada. Solicítala completando este{" "}
        <Link
          color="blue.500"
          href="https://forms.gle/dJgg9H53fTxm56mHA"
          target="_blank"
          rel="noopener noreferrer"
        >
          formulario.{" "}
        </Link>
      </Box>
    </>
  );
};
