import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Highlight,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaArrowRight, FaBookOpen, FaHistory, FaPencilAlt } from "react-icons/fa";
import { useAuth } from "../Auth";
import { useProjectUserSummary } from "./useProjectUserSummary";

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactElement;
}) {
  return (
    <Box
      flex="1"
      minW={{ base: "100%", md: "180px" }}
      // bg="whiteAlpha.700"
      bg={{ base: "whiteAlpha.700", _dark: "gray.900" }}
      borderWidth="1px"
      borderColor="whiteAlpha.400"
      borderRadius="2xl"
      px={{ base: 4, md: 5 }}
      py={{ base: 4, md: 5 }}
      backdropFilter="blur(8px)"
    >
      <HStack gap="3" align="flex-start">
        <Box
          color="white"
          bg="tangerine.500"
          borderRadius="xl"
          p="3"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Box>
        <Box>
          <Text fontSize="sm" color="text_info" opacity={0.75}>
            {label}
          </Text>
          <Text color="heading" fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
            {value}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
}

export const AssigndUser = () => {
  const { user, project } = useAuth();
  const userName = user?.name?.trim().split(/\s+/)[0] || "usuario";
  const { recentActivityValue, lastExerciseValue } = useProjectUserSummary({
    projectId: project?.id,
    userId: user?.id,
    userEmail: user?.email,
    groups: user?.groups,
  });

  return (
    <Stack width="100%" px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
      <Box
        width="100%"
        borderRadius={{ base: "2xl", md: "3xl" }}
        overflow="hidden"
        bg={{ base: "gray.200", _dark: "indigo.950" }}
        shadow={"xs"}
      >
        <Stack
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 6, lg: 10 }}
          align={{ base: "stretch", lg: "center" }}
          px={{ base: 5, md: 8, lg: 10 }}
          py={{ base: 6, md: 8 }}
        >
          <Stack flex="1" gap="5">
            <HStack gap="4" align={{ base: "flex-start", md: "center" }}>
              <Avatar.Root size="2xl" variant="subtle">
                <Avatar.Fallback name={user?.name || ""} />
                <Avatar.Image src={user?.picture || ""} />
              </Avatar.Root>

              <Stack gap="1">
                <Text
                  color="tangerine.600"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                  fontSize="sm"
                >
                  Tu espacio de aprendizaje
                </Text>
                <Heading
                  color="heading"
                  fontWeight="bold"
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                  lineHeight={1.05}
                >
                  Hola, {userName}
                </Heading>
              </Stack>
            </HStack>

            <Text maxW="3xl" fontSize={{ base: "md", md: "lg" }} color="text_info">
              <Highlight
                query="Tutor Inteligente"
                styles={{ px: "0.5", color: "tangerine.600", fontWeight: "semibold" }}
              >
                Mateo es un Tutor Inteligente que te ayuda a aprender y ejercitar tus habilidades de
                resolución de problemas, paso a paso. Esta plataforma te permitirá practicar
                resolviendo ejercicios de diversos tópicos en el curso de Álgebra para Ingeniería.
              </Highlight>
            </Text>
            <Text maxW="3xl" fontSize={{ base: "md", md: "lg" }} color="text_info">
              <Highlight
                query="tópico"
                styles={{ px: "0.5", color: "tangerine.600", fontWeight: "semibold" }}
              >
                Comienza escogiendo un tópico en barra de navegación izquierda.
              </Highlight>
            </Text>

            <HStack flexWrap="wrap" gap="4" align="stretch">
              <InfoCard
                label="Actividad Reciente"
                value={recentActivityValue}
                icon={<FaHistory aria-hidden="true" />}
              />
              <InfoCard
                label="Último ejercicio realizado en"
                value={lastExerciseValue}
                icon={<FaBookOpen aria-hidden="true" />}
              />
              <InfoCard
                label="Ejercicios Completados"
                value={"-"}
                icon={<FaPencilAlt aria-hidden="true" />}
              />
            </HStack>
          </Stack>

          <Box
            w={{ base: "100%", lg: "360px" }}
            borderRadius="2xl"
            // bg="bg.secondary"
            bg={{ base: "whiteAlpha.700", _dark: "gray.900" }}
            // borderWidth="1px"
            // borderColor="gray.300"
            // boxShadow="lg"
            p={{ base: 5, md: 6 }}
          >
            <Stack gap="4">
              <Text fontSize="sm" fontWeight="bold" color="tangerine.600" textTransform="uppercase">
                Acceso rápido
              </Text>
              <Stack gap="3">
                <Button asChild bg="tangerine.500" color="white" borderRadius="2xl" size="lg">
                  <NextLink href="/challenge">
                    Ir a desafíos <FaArrowRight />
                  </NextLink>
                </Button>

                <Button
                  asChild
                  bg="tangerine.500"
                  color="white"
                  borderRadius="2xl"
                  size="lg"
                  variant="outline"
                >
                  <NextLink href="/challenge">
                    Ver Mi progreso
                    <FaArrowRight />
                  </NextLink>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  borderRadius="2xl"
                  size="lg"
                  colorPalette="orange"
                >
                  <NextLink href="/tutorial">Ver tutorial</NextLink>
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};
