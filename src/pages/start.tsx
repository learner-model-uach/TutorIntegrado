import { Stack, Heading, Box, VStack, Text } from "@chakra-ui/react";
import { AssigndUser } from "../components/startComponents/projectUser";
import { NewUser } from "../components/startComponents/noProjectUser";

import { useAuth } from "./../components/Auth";

export default function Start() {
  const bgColor = "#2A4365";
  const { user } = useAuth();
  const proyecto = user?.projects?.some(x => x.code == "NivPreAlg");
  console.log(proyecto);

  return (
    <>
      <Stack width="100%" padding="1em" alignItems="center">
        <Stack alignItems="center">
          <Heading color={bgColor}>Bienvenid@ al Tutor Inteligente de Matemática</Heading>
        </Stack>
        <Text marginBottom={10}>
          Un tutor inteligente es un sistema que te ayuda a aprender y ejercitar tus habilidades de
          resolución de problemas, paso a paso. El Tutor Inteligente de Matemática te permitirá
          practicar resolviendo ejercicios de diversos tópicos que hemos identificado como
          importantes para prepararse para el curso de Álgebra para Ingeniería: factorización,
          fracciones, potencias y raíces, ecuaciones, entre otros.
        </Text>

        {proyecto ? <AssigndUser /> : <NewUser />}
      </Stack>

      <VStack justify="end" height="80%">
        <Box mt={4} p={4} bg="gray.200" textAlign="center">
          <Text>Más información sobre el proyecto:</Text>
          <Text>
            Esta plataforma <Text as="i">Tutor Inteligente de Matemática</Text> está siendo
            desarrollada y mantenida gracias el proyecto Fondecyt Iniciación 11220709, titulado
            &quot;Diseño motivacional de tutores cognitivos para apoyar el aprendizaje de
            matemáticas en los estudiantes de primer año de ingeniería&quot;. Para consultas o más
            información, contactarse con el Investigador Principal: Julio Daniel Guerra Hollstein
            jguerra@inf.uach.cl
          </Text>
        </Box>
      </VStack>
    </>
  );
}
