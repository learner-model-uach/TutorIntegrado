import {
  Box,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { withAuth, useAuth } from "../components/Auth";
import {
  FaExternalLinkAlt,
  FaCheck,
  FaLock,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";
import { useAction } from "../utils/action";
import { getSeedFromUser } from "../utils/thesisSeeds";

const ENTRY_FORMS_URL =
  process.env.NEXT_PUBLIC_THESIS_ENTRY_FORMS_URL ||
  "https://docs.google.com/forms/d/e/1FAIpQLSf4SzzQiRMjpj0nQefb_KlhtWsbwQY-s5BgBleTMQUJSF-tOQ/viewform?usp=pp_url&entry.666946759=USUARIO_AQUI";

export default withAuth(function EncuestaInicial() {
  const { user, auth0User } = useAuth();
  const action = useAction();

  const userIdentifier = auth0User?.nickname || user?.email || user?.name || "";
  const detected = getSeedFromUser(userIdentifier);

  const [hasClickedForm, setHasClickedForm] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const storageKey = `thesis_entry_survey_${userIdentifier || "guest"}`;

  // Restaurar progreso previo de la encuesta inicial
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isCompleted) {
          setIsCompleted(true);
          setHasClickedForm(true);
        }
      }
    } catch {}
  }, [storageKey]);

  const handleOpenForm = () => {
    setHasClickedForm(true);
    const account = detected.accountName || userIdentifier || "invitado";
    let targetUrl = ENTRY_FORMS_URL;

    if (targetUrl.includes("USUARIO_AQUI")) {
      targetUrl = targetUrl.replace("USUARIO_AQUI", encodeURIComponent(account));
    } else if (targetUrl.includes("entry.666946759=")) {
      targetUrl = targetUrl.replace(
        /entry\.666946759=[^&]*/,
        `entry.666946759=${encodeURIComponent(account)}`,
      );
    } else {
      const sep = targetUrl.includes("?") ? "&" : "?";
      targetUrl += `${sep}entry.666946759=${encodeURIComponent(account)}`;
    }

    window.open(targetUrl, "_blank", "noopener,noreferrer");

    action({
      verbName: "thesisOpenEntryForm",
      extra: { seed: detected.seed, user: userIdentifier },
    });
  };

  const handleConfirmCompletion = () => {
    if (!hasClickedForm) return;
    const nextState = !isCompleted;
    setIsCompleted(nextState);

    if (nextState) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ isCompleted: true }));
      } catch {}

      action({
        verbName: "thesisSurveyCompleted",
        extra: { seed: detected.seed, user: userIdentifier },
      });
    } else {
      try {
        localStorage.removeItem(storageKey);
      } catch {}
    }
  };

  return (
    <Container maxW="container.md" py="8">
      <VStack align="stretch" gap="6">
        {/* Banner de Encabezado */}
        <Box
          p={{ base: "6", md: "8" }}
          bgGradient="to-r"
          gradientFrom="teal.600"
          gradientTo="indigo.600"
          borderRadius="2xl"
          shadow="lg"
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap="6"
          >
            <VStack align="start" flex="1">
              <HStack>
                <Icon as={FaClipboardList} boxSize={7} color="tangerine.300" />
                <Badge colorPalette="teal" variant="solid" px="3" py="1" borderRadius="full">
                  Investigación Mateo Tutor
                </Badge>
              </HStack>
              <Heading size="xl" fontWeight="bold" color="white">
                Encuesta Inicial
              </Heading>
              <Text fontSize="md" color="indigo.100">
                Formulario de entrada para recopilar la percepción inicial sobre el uso de tecnologías en matemáticas.
              </Text>
            </VStack>

            <Card.Root
              bg="whiteAlpha.200"
              borderColor="whiteAlpha.300"
              p="4"
              minW="220px"
              borderRadius="xl"
            >
              <VStack align="start" gap="1">
                <Text fontSize="xs" color="indigo.200" textTransform="uppercase" fontWeight="bold">
                  Usuario Detectado
                </Text>
                <Text fontSize="md" fontWeight="bold" color="white">
                  {detected.accountName || "invitado"}
                </Text>
              </VStack>
            </Card.Root>
          </Flex>
        </Box>

        {/* Tarjeta de la Encuesta */}
        <Card.Root
          bg="bg.secondary"
          borderRadius="2xl"
          p={{ base: 6, md: 8 }}
          border="1px solid"
          borderColor="border"
        >
          <VStack align="stretch" gap="6">
            <Heading size="lg" color="heading">
              Instrucciones
            </Heading>

            <Text color="text_info" fontSize="md">
              Por favor ingresa al enlace a continuación para responder la encuesta inicial en Google Forms. Tus respuestas son anónimas y nos ayudan a mejorar el aprendizaje.
            </Text>

            {/* Contenedor del Botón de Google Forms */}
            <Box
              p="6"
              borderRadius="xl"
              bg={{ base: "indigo.50", _dark: "gray.900" }}
              border="1px solid"
              borderColor={{ base: "indigo.200", _dark: "gray.700" }}
              textAlign="center"
            >
              <VStack gap="4">
                <Icon
                  as={FaExternalLinkAlt}
                  boxSize={8}
                  color={{ base: "teal.600", _dark: "teal.300" }}
                />
                <Heading size="sm" color="heading">
                  Encuesta de Entrada en Google Forms
                </Heading>
                <Text fontSize="sm" color="fg.muted">
                  Haz clic en el botón para abrir la encuesta en una nueva pestaña. Tu usuario ({detected.accountName}) se incluirá automáticamente.
                </Text>
                <Button colorPalette="teal" size="lg" onClick={handleOpenForm}>
                  Abrir Encuesta en Google Forms <Icon as={FaExternalLinkAlt} ml="2" />
                </Button>
              </VStack>
            </Box>

            {/* Checkbox de Confirmación */}
            <Box
              p="4"
              borderRadius="xl"
              bg={
                hasClickedForm
                  ? { base: "teal.50", _dark: "indigo.900" }
                  : { base: "gray.100", _dark: "gray.800" }
              }
              border="1px solid"
              borderColor={
                hasClickedForm
                  ? { base: "teal.200", _dark: "indigo.700" }
                  : { base: "gray.300", _dark: "gray.700" }
              }
              opacity={hasClickedForm ? 1 : 0.75}
              mt="2"
            >
              <HStack
                gap="3"
                align="center"
                cursor={hasClickedForm ? "pointer" : "not-allowed"}
                onClick={handleConfirmCompletion}
              >
                <Box
                  w="24px"
                  h="24px"
                  borderRadius="md"
                  border="2px solid"
                  borderColor={
                    hasClickedForm
                      ? { base: "teal.600", _dark: "teal.300" }
                      : { base: "gray.400", _dark: "gray.500" }
                  }
                  bg={isCompleted ? "teal.500" : "transparent"}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {isCompleted && <Icon as={FaCheck} color="white" boxSize="14px" />}
                </Box>
                <Text fontSize="md" fontWeight="semibold" color="heading">
                  Confirmo que he respondido la encuesta inicial en Google Forms
                </Text>
                {!hasClickedForm && (
                  <Badge colorPalette="amber" variant="subtle" ml="auto">
                    <Icon as={FaLock} mr="1" /> Haz clic en &quot;Abrir Encuesta&quot; primero
                  </Badge>
                )}
              </HStack>
            </Box>

            {isCompleted && (
              <Box
                p="4"
                borderRadius="xl"
                bg={{ base: "green.50", _dark: "green.950" }}
                border="1px solid"
                borderColor={{ base: "green.200", _dark: "green.800" }}
              >
                <HStack gap="3">
                  <Icon as={FaCheckCircle} color="green.500" boxSize="6" />
                  <Box>
                    <Text fontSize="md" fontWeight="bold" color="green.700" _dark={{ color: "green.300" }}>
                      ¡Encuesta Inicial Completada!
                    </Text>
                    <Text fontSize="xs" color="fg.muted">
                      Muchas gracias por completar la encuesta inicial. Puedes continuar utilizando los demás módulos de la plataforma.
                    </Text>
                  </Box>
                </HStack>
              </Box>
            )}
          </VStack>
        </Card.Root>
      </VStack>
    </Container>
  );
});
