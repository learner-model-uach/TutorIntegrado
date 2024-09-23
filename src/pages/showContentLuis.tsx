import { withAuth } from "../components/Auth";
import { sessionState } from "../components/SessionState";
import { Text, Box } from "@chakra-ui/react";
import Info from "../utils/Info";

export default withAuth(function ShowContent() {
  const content = sessionState.currentContent;

  return (
    <>
      <Box textAlign="right">
        <Info />
      </Box>

      <div>
        {content && content.json ? (
          <Box as="pre" bg="gray.100" p={4} borderRadius="md">
            {JSON.stringify(content.json, null, 2)}
          </Box>
        ) : (
          <Text>No se encontró ningún contenido para mostrar</Text>
        )}
      </div>
    </>
  );
});
