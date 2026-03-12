import { Stack, Heading, Box, VStack, Text, Em, HStack } from "@chakra-ui/react";
import { AssigndUser } from "../components/startComponents/projectUser";
import { NewUser } from "../components/startComponents/noProjectUser";
import { FaEnvelope } from "react-icons/fa";
import { useAuth } from "./../components/Auth";

export default function Start() {
  // const bgColor = "#2A4365";
  const { user } = useAuth();
  const proyecto = user?.projects?.some(x => x.code == "NivPreAlg");
  console.log(proyecto);

  return (
    <>
      <Stack width="100%" padding="1em" alignItems="center">
        <Stack alignItems="center">
          <Heading size="4xl" color={"heading"} fontWeight="bold">
            Bienvenid@ al Tutor Inteligente de Matemáticas
          </Heading>
        </Stack>
        <Text textAlign="justify" marginBottom={10}>
          Un tutor inteligente es un sistema que te ayuda a aprender y ejercitar tus habilidades de
          resolución de problemas, paso a paso. El Tutor Inteligente de Matemática te permitirá
          practicar resolviendo ejercicios de diversos tópicos que hemos identificado como
          importantes para prepararse para el curso de Álgebra para Ingeniería: factorización,
          fracciones, potencias y raíces, ecuaciones, entre otros.
        </Text>

        {proyecto ? <AssigndUser /> : <NewUser />}
      </Stack>

      <VStack justify="end" height="80%">
        <Box mt={4} p={4} bg={"boxinfo"} rounded="xs">
          <Heading textAlign="center" size="md">
            Más información sobre el proyecto:
          </Heading>
          <Text textAlign={"justify"}>
            Esta plataforma Tutor Inteligente de Matemática está siendo desarrollada y mantenida
            gracias el proyecto Fondecyt Iniciación 11220709, titulado &quot;
            <Em>
              Diseño motivacional de tutores cognitivos para apoyar el aprendizaje de matemáticas en
              los estudiantes de primer año de ingeniería
            </Em>
            &quot;. Para consultas o más información, contactarse con el Investigador Principal:
            Julio Daniel Guerra Hollstein.
          </Text>

          <HStack justify="center">
            <Text textAlign="center">Contacto:</Text>

            <FaEnvelope />
            <Text> jguerra@inf.uach.cl </Text>
          </HStack>
        </Box>
      </VStack>
    </>
  );
}
