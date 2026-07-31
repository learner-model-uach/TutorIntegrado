import {
  Box,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  Badge,
  Flex,
  Progress,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { withAuth, useAuth } from "../components/Auth";
import {
  FaGraduationCap,
  FaKeyboard,
  FaPencilAlt,
  FaCheck,
  FaExternalLinkAlt,
  FaArrowRight,
  FaCheckCircle,
  FaHistory,
  FaTrashAlt,
  FaLock,
  FaBrain,
  FaTachometerAlt,
  FaSmile,
} from "react-icons/fa";
import { MathPixBoard } from "../components/whiteboard/MathPixBoard";
import MQStaticMathField from "../utils/MQStaticMathField";
import { useAction } from "../utils/action";
import {
  EXPERIMENT_EXERCISES,
  getSeedFromUser,
  getSeedExerciseSequence,
  SEED_ASSIGNMENTS,
  InputMode,
} from "../utils/thesisSeeds";
import dynamic from "next/dynamic";

const EditableMathFieldComponent = dynamic(
  () =>
    import("react-mathquill").then(mod => {
      if (typeof window !== "undefined") {
        mod.addStyles();
      }
      return mod.EditableMathField;
    }),
  { ssr: false },
);

type Phase = "intro" | "survey" | "exercise" | "post_survey" | "finished";

// URLs por defecto de Google Forms para la encuesta inicial y de salida
const ENTRY_FORMS_URL =
  process.env.NEXT_PUBLIC_THESIS_ENTRY_FORMS_URL ||
  "https://docs.google.com/forms/d/e/1FAIpQLSf4SzzQiRMjpj0nQefb_KlhtWsbwQY-s5BgBleTMQUJSF-tOQ/viewform?usp=pp_url&entry.666946759=USUARIO_AQUI";
const EXIT_FORMS_URL =
  process.env.NEXT_PUBLIC_THESIS_EXIT_FORMS_URL ||
  "https://docs.google.com/forms/d/e/1FAIpQLSdu3rXVZ8vk4KbYHY8IUeqF0ejLGOdWVlxtRO8RXdGBE8qn1g/viewform?usp=pp_url&entry.1804015926=USUARIO_AQUI";

interface NasaTlxData {
  mentalDemand: number; // 1 a 10
  effort: number; // 1 a 10
  frustration: number; // 1 a 10
}

// Componente Deslizador (Slider 1 a 10) con arrastre universal fluido (Mouse + Tablet Touch)
function RatingScale({
  value,
  onChange,
  minLabel,
  maxLabel,
}: {
  value: number;
  onChange: (val: number) => void;
  minLabel: string;
  maxLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateValue = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = rect.width > 0 ? offsetX / rect.width : 0;
      const newValue = Math.max(1, Math.min(10, Math.round(1 + percentage * 9)));
      onChange(newValue);
    },
    [onChange],
  );

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    updateValue(clientX);

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const x =
        "touches" in e && e.touches.length > 0 ? e.touches[0].clientX : (e as MouseEvent).clientX;
      updateValue(x);
    };

    const handleEnd = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: true });
    window.addEventListener("touchend", handleEnd);
    window.addEventListener("touchcancel", handleEnd);
  };

  // Porcentaje visual del botón sobre la pista (0% a 100%)
  const fillPercent = ((value - 1) / 9) * 100;

  return (
    <VStack align="stretch" gap="2" w="full" py="2">
      {/* Pista e Indicador Deslizante */}
      <Box
        ref={trackRef}
        position="relative"
        w="full"
        h="44px"
        display="flex"
        alignItems="center"
        cursor="pointer"
        px="2"
        style={{ touchAction: "none", userSelect: "none" }}
        onMouseDown={e => {
          e.preventDefault();
          handleStart(e.clientX);
        }}
        onTouchStart={e => {
          if (e.touches.length > 0) {
            handleStart(e.touches[0].clientX);
          }
        }}
      >
        {/* Fondo de la Pista (Track) */}
        <Box
          w="full"
          h="14px"
          bg={{ base: "gray.200", _dark: "gray.700" }}
          borderRadius="full"
          position="relative"
          overflow="hidden"
        >
          {/* Relleno de Progreso */}
          <Box
            h="full"
            w={`${fillPercent}%`}
            bg="teal.500"
            borderRadius="full"
            transition={isDragging ? "none" : "width 0.15s ease-out"}
          />
        </Box>

        {/* Botón Deslizante Tactil Grande (Thumb 36px) */}
        <Box
          position="absolute"
          left={`calc(${fillPercent}% + ${8 - (fillPercent / 100) * 16}px)`}
          w="36px"
          h="36px"
          bg="teal.500"
          color="white"
          borderRadius="full"
          shadow="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
          transform="translateX(-50%)"
          transition={isDragging ? "none" : "left 0.15s ease-out"}
          border="3px solid white"
          _hover={{ transform: "translateX(-50%) scale(1.1)" }}
          _active={{ transform: "translateX(-50%) scale(1.15)" }}
          fontWeight="bold"
          fontSize="sm"
          userSelect="none"
        >
          {value}
        </Box>
      </Box>

      {/* Indicadores Visuales de Menos a Más */}
      <Flex justify="space-between" align="center" px="1">
        <HStack gap="1.5">
          <Badge colorPalette="gray" variant="subtle" size="sm">
            ◄ Menos
          </Badge>
          <Text fontSize="xs" fontWeight="bold" color="fg.muted">
            {minLabel}
          </Text>
        </HStack>

        <HStack gap="1.5">
          <Text fontSize="xs" fontWeight="bold" color="fg.muted">
            {maxLabel}
          </Text>
          <Badge colorPalette="teal" variant="solid" size="sm">
            Más ►
          </Badge>
        </HStack>
      </Flex>
    </VStack>
  );
}

export default withAuth(function PruebaEstudiantes() {
  const { user } = useAuth();
  const action = useAction();

  // Detección de cuenta y semilla asignada (semilla fija según la cuenta)
  const userIdentifier = user?.nickname || user?.email || user?.name || "";
  const detected = getSeedFromUser(userIdentifier);
  const currentSeed = detected.seed;

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [isBoardOpen, setIsBoardOpen] = useState<boolean>(false);
  const [studentLatex, setStudentLatex] = useState<string>("");
  const [submittedLatex, setSubmittedLatex] = useState<Record<string, string>>({});
  const [ta, setTa] = useState<any>(null);
  const [isRestored, setIsRestored] = useState<boolean>(false);

  // Estados de verificación de clic en botones de formularios Google Forms
  const [hasClickedEntryForm, setHasClickedEntryForm] = useState<boolean>(false);
  const [isEntrySurveyCompleted, setIsEntrySurveyCompleted] = useState<boolean>(false);

  const [hasClickedExitForm, setHasClickedExitForm] = useState<boolean>(false);
  const [isExitSurveyCompleted, setIsExitSurveyCompleted] = useState<boolean>(false);

  // Estado para el modal de evaluación NASA-TLX por ejercicio
  const [isNasaTlxOpen, setIsNasaTlxOpen] = useState<boolean>(false);
  const [nasaMental, setNasaMental] = useState<number>(5);
  const [nasaEffort, setNasaEffort] = useState<number>(5);
  const [nasaFrustration, setNasaFrustration] = useState<number>(5);
  const [pendingExerciseTimeMs, setPendingExerciseTimeMs] = useState<number>(0);
  const [submittedNasaTlx, setSubmittedNasaTlx] = useState<Record<string, NasaTlxData>>({});

  // Clave única de almacenamiento local según el usuario
  const storageKey = `thesis_progress_${userIdentifier || "guest"}`;

  // Registro del tiempo de inicio del ejercicio activo
  const exerciseStartTimeRef = useRef<number>(Date.now());

  const seedSequence = getSeedExerciseSequence(currentSeed);
  const currentStep = seedSequence[currentExerciseIndex] || seedSequence[0];
  const currentExercise = currentStep.exercise;
  const currentMode: InputMode = currentStep.mode;

  // RESTAURAR PROGRESO DESDE LOCALSTORAGE AL CARGAR LA PÁGINA
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed && parsed.seed === currentSeed && parsed.phase && parsed.phase !== "finished") {
          setPhase(parsed.phase);
          setCurrentExerciseIndex(parsed.currentExerciseIndex || 0);
          setHasClickedEntryForm(Boolean(parsed.hasClickedEntryForm));
          setIsEntrySurveyCompleted(Boolean(parsed.isEntrySurveyCompleted));
          setHasClickedExitForm(Boolean(parsed.hasClickedExitForm));
          setIsExitSurveyCompleted(Boolean(parsed.isExitSurveyCompleted));
          setSubmittedLatex(parsed.submittedLatex || {});
          setSubmittedNasaTlx(parsed.submittedNasaTlx || {});
          setIsRestored(true);

          action({
            verbName: "thesisRestoreSession",
            extra: {
              seed: currentSeed,
              restoredPhase: parsed.phase,
              restoredIndex: parsed.currentExerciseIndex,
              user: userIdentifier,
            },
          });
        }
      }
    } catch (e) {
      console.warn("No se pudo restaurar el progreso previo:", e);
    }
  }, [action, currentSeed, storageKey, userIdentifier]);

  // GUARDAR AUTOMÁTICAMENTE EL PROGRESO EN LOCALSTORAGE TRAS CADA CAMBIO
  useEffect(() => {
    if (typeof window === "undefined" || phase === "finished") return;

    try {
      const stateToSave = {
        phase,
        currentExerciseIndex,
        hasClickedEntryForm,
        isEntrySurveyCompleted,
        hasClickedExitForm,
        isExitSurveyCompleted,
        submittedLatex,
        submittedNasaTlx,
        seed: currentSeed,
        timestamp: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn("No se pudo guardar el progreso en localStorage:", e);
    }
  }, [
    phase,
    currentExerciseIndex,
    hasClickedEntryForm,
    isEntrySurveyCompleted,
    hasClickedExitForm,
    isExitSurveyCompleted,
    submittedLatex,
    submittedNasaTlx,
    currentSeed,
    storageKey,
  ]);

  // ADVERTENCIA DE SALIDA O CIERRE ACCIDENTAL DE PESTAÑA MIENTRAS RESUELVE EJERCICIOS
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (phase === "exercise") {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [phase]);

  // Reiniciar el cronómetro al cambiar de ejercicio o entrar a la fase de ejercicios
  useEffect(() => {
    if (phase === "exercise" && !isNasaTlxOpen) {
      exerciseStartTimeRef.current = Date.now();
    }
  }, [phase, currentExerciseIndex, isNasaTlxOpen]);

  // Función para reiniciar el experimento completamente de cero
  const handleResetProgress = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    setStudentLatex("");
    setSubmittedLatex({});
    setSubmittedNasaTlx({});
    setCurrentExerciseIndex(0);
    setPhase("intro");
    setHasClickedEntryForm(false);
    setIsEntrySurveyCompleted(false);
    setHasClickedExitForm(false);
    setIsExitSurveyCompleted(false);
    setIsNasaTlxOpen(false);
    setIsRestored(false);
  };

  // Insertar símbolos en MathQuill
  const handleMQTool = (command: string) => {
    if (ta) {
      if (command === "clear") {
        setStudentLatex("");
        ta.latex("");
      } else {
        ta.cmd(command);
      }
    } else {
      if (command === "clear") {
        setStudentLatex("");
      } else {
        setStudentLatex(prev => prev + command);
      }
    }
  };

  // Apertura de enlaces a Google Forms con rellenado automático de usuario y habilitación del Checkbox
  const handleOpenEntryForm = () => {
    setHasClickedEntryForm(true);
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
      extra: { seed: currentSeed, user: userIdentifier, account, formUrl: targetUrl },
    });
  };

  const handleOpenExitForm = () => {
    setHasClickedExitForm(true);
    const account = detected.accountName || userIdentifier || "invitado";
    let targetUrl = EXIT_FORMS_URL;

    if (targetUrl.includes("USUARIO_AQUI")) {
      targetUrl = targetUrl.replace("USUARIO_AQUI", encodeURIComponent(account));
    } else if (targetUrl.includes("entry.1804015926=")) {
      targetUrl = targetUrl.replace(
        /entry\.1804015926=[^&]*/,
        `entry.1804015926=${encodeURIComponent(account)}`,
      );
    } else {
      const sep = targetUrl.includes("?") ? "&" : "?";
      targetUrl += `${sep}entry.1804015926=${encodeURIComponent(account)}`;
    }

    window.open(targetUrl, "_blank", "noopener,noreferrer");
    action({
      verbName: "thesisOpenExitForm",
      extra: { seed: currentSeed, user: userIdentifier, account, formUrl: targetUrl },
    });
  };

  // Registrar respuesta del ejercicio y desplegar la evaluación NASA-TLX
  const advanceToNasaTlx = useCallback(
    (finalLatex: string) => {
      if (!currentExercise) return;

      const endTime = Date.now();
      const startTime = exerciseStartTimeRef.current;
      const timeSpentMs = Math.max(0, endTime - startTime);
      const timeSpentSec = Number((timeSpentMs / 1000).toFixed(2));

      setPendingExerciseTimeMs(timeSpentMs);

      const updatedSubmitted = { ...submittedLatex, [currentExercise.id]: finalLatex };
      setSubmittedLatex(updatedSubmitted);

      // Registrar acción de envío del ejercicio
      action({
        verbName: "thesisSubmitExercise",
        extra: {
          exerciseId: currentExercise.id,
          seed: currentSeed,
          mode: currentMode,
          inputLatex: finalLatex,
          targetLatex: currentExercise.targetLatex,
          user: userIdentifier,
          timeSpentMs,
          timeSpentSec,
          startTime,
          endTime,
        },
      });

      // Limpiar entrada y abrir el modal NASA-TLX
      setStudentLatex("");
      setNasaMental(5);
      setNasaEffort(5);
      setNasaFrustration(5);
      setIsNasaTlxOpen(true);
    },
    [action, currentExercise, currentMode, currentSeed, submittedLatex, userIdentifier],
  );

  // Guardar respuestas de NASA-TLX y avanzar al siguiente ejercicio o fase post_survey
  const handleConfirmNasaTlx = () => {
    if (!currentExercise) return;

    const nasaData: NasaTlxData = {
      mentalDemand: nasaMental,
      effort: nasaEffort,
      frustration: nasaFrustration,
    };

    setSubmittedNasaTlx(prev => ({ ...prev, [currentExercise.id]: nasaData }));

    // Registrar evaluación NASA-TLX en la API
    action({
      verbName: "thesisSubmitNasaTlx",
      extra: {
        exerciseId: currentExercise.id,
        seed: currentSeed,
        mode: currentMode,
        user: userIdentifier,
        nasaTlx: nasaData,
        exerciseTimeSpentMs: pendingExerciseTimeMs,
      },
    });

    setIsNasaTlxOpen(false);

    // Avanzar al siguiente ejercicio o a la encuesta final de salida
    if (currentExerciseIndex < seedSequence.length - 1) {
      const nextIdx = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIdx);
      exerciseStartTimeRef.current = Date.now();
    } else {
      setPhase("post_survey");
      action({
        verbName: "thesisFinishExercises",
        extra: {
          seed: currentSeed,
          user: userIdentifier,
        },
      });
    }
  };

  // Captura de respuesta desde Pizarra Digital
  const handleCapturePizarra = useCallback(
    (response: { expressions: string[]; text?: string }) => {
      const captured = response.expressions?.[0] || response.text || "";
      setStudentLatex(captured);

      const endTime = Date.now();
      const startTime = exerciseStartTimeRef.current;
      const timeSpentMs = Math.max(0, endTime - startTime);
      const timeSpentSec = Number((timeSpentMs / 1000).toFixed(2));

      action({
        verbName: "thesisPizarraCapture",
        extra: {
          exerciseId: currentExercise?.id,
          seed: currentSeed,
          capturedLatex: captured,
          user: userIdentifier,
          timeSpentMs,
          timeSpentSec,
        },
      });

      // Abrir evaluación NASA-TLX tras capturar de la pizarra
      if (captured.trim()) {
        advanceToNasaTlx(captured);
      }
    },
    [action, advanceToNasaTlx, currentExercise?.id, currentSeed, userIdentifier],
  );

  return (
    <Container maxW="5xl" py="8">
      <VStack align="stretch" gap="6">
        {/* Banner Superior Principal */}
        <Box
          bg={{ base: "indigo.800", _dark: "indigo.950" }}
          color="white"
          p={{ base: 6, md: 8 }}
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
                <Icon as={FaGraduationCap} boxSize={7} color="tangerine.300" />
                <Badge colorPalette="teal" variant="solid" px="3" py="1" borderRadius="full">
                  Prueba Mateo Tutor - Investigación
                </Badge>
              </HStack>
              <Heading size="xl" fontWeight="bold" color="white">
                Prueba Estudiantes
              </Heading>
              <Text fontSize="md" color="indigo.100">
                Bienvenido/a a la evaluación de investigación. Por favor sigue las instrucciones
                indicadas.
              </Text>
            </VStack>

            {/* Ficha de Información del Estudiante y Semilla */}
            <Card.Root
              bg="whiteAlpha.200"
              borderColor="whiteAlpha.300"
              p="4"
              minW="240px"
              borderRadius="xl"
            >
              <VStack align="start" gap="1">
                <Text fontSize="xs" color="indigo.200" textTransform="uppercase" fontWeight="bold">
                  Cuenta de Prueba
                </Text>
                <Text fontSize="md" fontWeight="bold" color="white">
                  {detected.accountName}
                </Text>
                <HStack mt="1">
                  <Badge colorPalette="tangerine" variant="solid" fontSize="sm" px="2.5" py="0.5">
                    Semilla #{currentSeed}
                  </Badge>
                </HStack>
              </VStack>
            </Card.Root>
          </Flex>
        </Box>

        {/* Notificación de Recuperación de Sesión */}
        {isRestored && phase !== "finished" && (
          <Box
            p="3"
            borderRadius="xl"
            bg={{ base: "blue.50", _dark: "indigo.900" }}
            border="1px solid"
            borderColor={{ base: "blue.200", _dark: "indigo.700" }}
          >
            <Flex justify="space-between" align="center">
              <HStack gap="2">
                <Icon as={FaHistory} color="blue.500" />
                <Text fontSize="sm" color="heading" fontWeight="medium">
                  Se ha reanudado automáticamente tu sesión previa en{" "}
                  <strong>
                    {phase === "survey"
                      ? "Paso 1 (Encuesta Entrada)"
                      : phase === "post_survey"
                        ? "Paso 3 (Encuesta Salida)"
                        : `Ejercicio ${currentExerciseIndex + 1}`}
                  </strong>
                  .
                </Text>
              </HStack>
              <Button size="xs" variant="ghost" colorPalette="red" onClick={handleResetProgress}>
                <Icon as={FaTrashAlt} mr="1" /> Reiniciar desde Cero
              </Button>
            </Flex>
          </Box>
        )}

        {/* FASE 1: PANTALLA PRINCIPAL (INTRODUCCIÓN Y EXPLICACIÓN) */}
        {phase === "intro" && (
          <Card.Root
            bg="bg.secondary"
            borderRadius="2xl"
            p={{ base: 6, md: 8 }}
            border="1px solid"
            borderColor="border"
          >
            <VStack align="stretch" gap="6">
              <Heading size="lg" color="heading">
                Instrucciones de la Prueba
              </Heading>

              <VStack align="start" gap="4" color="text_info" fontSize="md">
                <Text>
                  En esta sesión vas a participar en una prueba experimental para Mateo Tutor.
                  Resolverás una serie de ejercicios matemáticos sencillos de transcripción en donde
                  tendrás que copiar las expresiones presentadas.
                </Text>

                <Text fontWeight="bold" color="heading">
                  ¿Cómo funciona?
                </Text>

                <VStack align="start" gap="3" pl="2" w="full">
                  <Box
                    p="3"
                    borderRadius="xl"
                    bg={{ base: "slate.100", _dark: "indigo.900" }}
                    w="full"
                  >
                    <HStack>
                      <Icon as={FaKeyboard} color="stealblue.400" boxSize="5" />
                      <Text color="heading" fontSize="sm">
                        <strong>1. Ejercicios con Teclado Matemático:</strong> Ingresarás la
                        respuesta utilizando el teclado virtual en pantalla.
                      </Text>
                    </HStack>
                  </Box>

                  <Box
                    p="3"
                    borderRadius="xl"
                    bg={{ base: "slate.100", _dark: "indigo.900" }}
                    w="full"
                  >
                    <HStack>
                      <Icon as={FaPencilAlt} color="purple.400" boxSize="5" />
                      <Text color="heading" fontSize="sm">
                        <strong>2. Ejercicios con Pizarra Digital:</strong> Abrirás la pizarra
                        manuscrita y escribirás tu respuesta a mano.
                      </Text>
                    </HStack>
                  </Box>
                </VStack>

                <Text fontSize="sm" color="fg.muted">
                  El orden de los ejercicios y la herramienta a utilizar han sido predefinidos
                  automáticamente según tu cuenta asignada (Semilla #{currentSeed}). Al finalizar
                  cada ejercicio, responderás brevemente 3 preguntas de carga de trabajo (NASA-TLX).
                </Text>
              </VStack>

              <Box pt="4" textAlign="right">
                <Button
                  size="lg"
                  colorPalette="blue"
                  onClick={() => {
                    setPhase("survey");
                    action({
                      verbName: "thesisStartIntro",
                      extra: { seed: currentSeed, user: userIdentifier },
                    });
                  }}
                >
                  Iniciar Prueba <Icon as={FaArrowRight} ml="2" />
                </Button>
              </Box>
            </VStack>
          </Card.Root>
        )}

        {/* FASE 2: VERIFICACIÓN DE ENCUESTA INICIAL GOOGLE FORMS */}
        {phase === "survey" && (
          <Card.Root
            bg="bg.secondary"
            borderRadius="2xl"
            p={{ base: 6, md: 8 }}
            border="1px solid"
            borderColor="border"
          >
            <VStack align="stretch" gap="6">
              <Heading size="lg" color="heading">
                Paso 1: Encuesta Inicial
              </Heading>

              <Text color="text_info" fontSize="md">
                Antes de comenzar a resolver los ejercicios, por favor ingresa al enlace a
                continuación y responde la encuesta inicial.
              </Text>

              {/* Contenedor de Google Forms */}
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
                    Haz clic en el botón para abrir la encuesta en una nueva pestaña y respóndela
                    completamente.
                  </Text>
                  <Button colorPalette="teal" size="md" onClick={handleOpenEntryForm}>
                    Abrir Encuesta en Google Forms <Icon as={FaExternalLinkAlt} ml="2" />
                  </Button>
                </VStack>
              </Box>

              {/* Checkbox de Confirmación */}
              <Box
                p="4"
                borderRadius="xl"
                bg={
                  hasClickedEntryForm
                    ? { base: "teal.50", _dark: "indigo.900" }
                    : { base: "gray.100", _dark: "gray.800" }
                }
                border="1px solid"
                borderColor={
                  hasClickedEntryForm
                    ? { base: "teal.200", _dark: "indigo.700" }
                    : { base: "gray.300", _dark: "gray.700" }
                }
                opacity={hasClickedEntryForm ? 1 : 0.75}
                mt="2"
              >
                <HStack
                  gap="3"
                  align="center"
                  cursor={hasClickedEntryForm ? "pointer" : "not-allowed"}
                  onClick={() => {
                    if (hasClickedEntryForm) {
                      setIsEntrySurveyCompleted(!isEntrySurveyCompleted);
                    }
                  }}
                >
                  <Box
                    w="24px"
                    h="24px"
                    borderRadius="md"
                    border="2px solid"
                    borderColor={
                      hasClickedEntryForm
                        ? { base: "teal.600", _dark: "teal.300" }
                        : { base: "gray.400", _dark: "gray.500" }
                    }
                    bg={isEntrySurveyCompleted ? "teal.500" : "transparent"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {isEntrySurveyCompleted && <Icon as={FaCheck} color="white" boxSize="14px" />}
                  </Box>
                  <Text fontSize="md" fontWeight="semibold" color="heading">
                    Confirmo que he respondido la encuesta inicial en Google Forms
                  </Text>
                  {!hasClickedEntryForm && (
                    <Badge colorPalette="amber" variant="subtle" ml="auto">
                      <Icon as={FaLock} mr="1" /> Haz clic en &quot;Abrir Encuesta&quot; primero
                    </Badge>
                  )}
                </HStack>
              </Box>

              {/* Botón para comenzar ejercicios */}
              <Flex justify="space-between" pt="4" align="center">
                <Button variant="outline" onClick={() => setPhase("intro")}>
                  Atrás
                </Button>
                <Button
                  size="lg"
                  colorPalette="blue"
                  disabled={!isEntrySurveyCompleted}
                  onClick={() => {
                    setPhase("exercise");
                    action({
                      verbName: "thesisSurveyCompleted",
                      extra: { seed: currentSeed, user: userIdentifier },
                    });
                  }}
                >
                  Comenzar Ejercicios <Icon as={FaArrowRight} ml="2" />
                </Button>
              </Flex>
            </VStack>
          </Card.Root>
        )}

        {/* FASE 3: RESOLUCIÓN DE EJERCICIOS (UNO A UNO) */}
        {phase === "exercise" && currentExercise && !isNasaTlxOpen && (
          <VStack align="stretch" gap="6">
            {/* Barra de Progreso del Ejercicio Actual */}
            <Card.Root
              p="4"
              bg="bg.secondary"
              borderRadius="xl"
              border="1px solid"
              borderColor="border"
            >
              <Flex justify="space-between" align="center" mb="2">
                <Text fontSize="sm" fontWeight="bold" color="heading">
                  Ejercicio {currentExerciseIndex + 1} de {seedSequence.length}
                </Text>
                <Badge colorPalette={currentMode === "pizarra" ? "purple" : "blue"} variant="solid">
                  <Icon as={currentMode === "pizarra" ? FaPencilAlt : FaKeyboard} mr="1.5" />
                  {currentMode === "pizarra" ? "Modo: Pizarra Digital" : "Modo: Teclado Matemático"}
                </Badge>
              </Flex>
              <Progress.Root
                value={((currentExerciseIndex + 1) / seedSequence.length) * 100}
                colorPalette="teal"
              >
                <Progress.Track />
              </Progress.Root>
            </Card.Root>

            {/* Contenedor Único del Ejercicio */}
            <Card.Root
              bg="bg.secondary"
              borderRadius="2xl"
              p={{ base: 6, md: 8 }}
              border="1px solid"
              borderColor="border"
            >
              <VStack align="stretch" gap="6">
                {/* Título e Instrucción */}
                <VStack align="center" textAlign="center" gap="1">
                  <Heading size="lg" color="heading">
                    {currentExercise.title}
                  </Heading>
                  <Text fontSize="sm" color="fg.muted">
                    {currentExercise.instruction}
                  </Text>
                </VStack>

                {/* Expresión Matemática a Copiar */}
                <Box
                  p="6"
                  borderRadius="2xl"
                  bg={{ base: "indigo.900", _dark: "indigo.950" }}
                  color="white"
                  textAlign="center"
                  borderWidth="2px"
                  borderColor={{ base: "indigo.700", _dark: "indigo.600" }}
                  shadow="md"
                  className="thesis-target-math-box"
                >
                  <style>{`
                    .thesis-target-math-box .mq-root-block,
                    .thesis-target-math-box .mq-math-mode,
                    .thesis-target-math-box span {
                      color: #ffffff !important;
                    }
                  `}</style>
                  <Box fontSize="2xl" my="2">
                    <MQStaticMathField exp={currentExercise.targetLatex} currentExpIndex={true} />
                  </Box>
                </Box>

                {/* MODO TECLADO: Botones + Campo MathQuill + Botón Enviar */}
                {currentMode === "teclado" && (
                  <Box
                    p="6"
                    borderRadius="2xl"
                    bg={{ base: "gray.50", _dark: "gray.900" }}
                    border="1px solid"
                    borderColor={{ base: "gray.200", _dark: "gray.700" }}
                    mt="2"
                  >
                    <VStack align="center" gap="4">
                      {/* Botones de Teclado Mq2 */}
                      <HStack gap="3" flexWrap="wrap" justify="center">
                        <Button
                          colorPalette="teal"
                          size="md"
                          onMouseDown={e => {
                            e.preventDefault();
                            handleMQTool("(");
                          }}
                        >
                          (
                        </Button>
                        <Button
                          colorPalette="teal"
                          size="md"
                          onMouseDown={e => {
                            e.preventDefault();
                            handleMQTool(")");
                          }}
                        >
                          )
                        </Button>
                        <Button
                          colorPalette="teal"
                          size="md"
                          onMouseDown={e => {
                            e.preventDefault();
                            handleMQTool("^");
                          }}
                        >
                          ^
                        </Button>
                        <Button
                          colorPalette="teal"
                          size="md"
                          onMouseDown={e => {
                            e.preventDefault();
                            handleMQTool("\\sqrt");
                          }}
                        >
                          √
                        </Button>
                      </HStack>

                      <HStack gap="3" flexWrap="wrap" justify="center">
                        <Button
                          colorPalette="teal"
                          size="md"
                          onMouseDown={e => {
                            e.preventDefault();
                            handleMQTool("+");
                          }}
                        >
                          +
                        </Button>
                        <Button
                          colorPalette="teal"
                          size="md"
                          onMouseDown={e => {
                            e.preventDefault();
                            handleMQTool("-");
                          }}
                        >
                          -
                        </Button>
                        <Button
                          colorPalette="teal"
                          size="md"
                          onMouseDown={e => {
                            e.preventDefault();
                            handleMQTool("*");
                          }}
                        >
                          *
                        </Button>
                        <Button
                          colorPalette="teal"
                          size="md"
                          onMouseDown={e => {
                            e.preventDefault();
                            handleMQTool("\\frac");
                          }}
                        >
                          /
                        </Button>
                        <Button
                          colorPalette="red"
                          variant="outline"
                          size="md"
                          onMouseDown={e => {
                            e.preventDefault();
                            handleMQTool("clear");
                          }}
                        >
                          C
                        </Button>
                      </HStack>

                      {/* Campo MathQuill */}
                      <Box w="full" maxW="400px" my="2">
                        <EditableMathFieldComponent
                          latex={studentLatex}
                          style={{
                            width: "100%",
                            minHeight: "60px",
                            padding: "12px",
                            fontSize: "1.3rem",
                            borderRadius: "12px",
                            border: "3px solid #3182ce",
                            backgroundColor: "#fff",
                            color: "#000",
                          }}
                          onChange={mathField => {
                            setStudentLatex(mathField.latex());
                          }}
                          mathquillDidMount={mathfield => {
                            setTa(mathfield);
                          }}
                        />
                      </Box>

                      {/* Botón Enviar */}
                      <Button
                        size="lg"
                        colorPalette="teal"
                        px="8"
                        disabled={!studentLatex.trim()}
                        onClick={() => advanceToNasaTlx(studentLatex)}
                      >
                        Enviar
                      </Button>
                    </VStack>
                  </Box>
                )}

                {/* MODO PIZARRA: Botón Abrir Pizarra */}
                {currentMode === "pizarra" && (
                  <Box
                    p="8"
                    borderRadius="2xl"
                    bg={{ base: "purple.50", _dark: "gray.900" }}
                    border="1px solid"
                    borderColor={{ base: "purple.200", _dark: "gray.700" }}
                    mt="2"
                    textAlign="center"
                  >
                    <VStack gap="5">
                      <Icon as={FaPencilAlt} boxSize={10} color="purple.500" />
                      <Text fontSize="md" color="heading" fontWeight="bold">
                        Para este ejercicio debes usar la Pizarra Digital Manuscrita.
                      </Text>
                      <Text fontSize="sm" color="fg.muted">
                        Haz clic en el botón a continuación para abrir la pizarra, escribe la
                        fórmula a mano y presiona Enviar.
                      </Text>

                      <Button
                        size="xl"
                        colorPalette="purple"
                        px="10"
                        py="6"
                        fontSize="lg"
                        onClick={() => setIsBoardOpen(true)}
                      >
                        <Icon as={FaPencilAlt} mr="3" />
                        Abrir Pizarra Digital
                      </Button>
                    </VStack>
                  </Box>
                )}
              </VStack>
            </Card.Root>
          </VStack>
        )}

        {/* COMPONENTE INTERACTIVO NASA-TLX (CUESTIONARIO TRAS CADA EJERCICIO) */}
        {phase === "exercise" && isNasaTlxOpen && currentExercise && (
          <Card.Root
            bg="bg.secondary"
            borderRadius="2xl"
            p={{ base: 6, md: 8 }}
            border="2px solid"
            borderColor="teal.500"
            shadow="xl"
          >
            <VStack align="stretch" gap="6">
              <VStack align="center" textAlign="center" gap="1">
                <Badge colorPalette="teal" size="lg" px="3" py="1">
                  Evaluación de Carga de Trabajo (NASA-TLX)
                </Badge>
                <Heading size="lg" color="heading" mt="2">
                  ¿Cómo percibiste el Ejercicio {currentExerciseIndex + 1}?
                </Heading>
                <Text fontSize="sm" color="fg.muted">
                  Por favor responde sinceramente estas 3 preguntas evaluando la herramienta usada (
                  {currentMode === "pizarra" ? "Pizarra Digital" : "Teclado Matemático"}).
                </Text>
              </VStack>

              {/* Pregunta 1: Exigencia Mental */}
              <Box
                p="5"
                borderRadius="xl"
                bg={{ base: "indigo.50", _dark: "gray.900" }}
                border="1px solid"
                borderColor={{ base: "indigo.200", _dark: "gray.700" }}
              >
                <VStack align="start" gap="3">
                  <HStack>
                    <Icon as={FaBrain} color="indigo.500" boxSize="5" />
                    <Text fontWeight="bold" color="heading" fontSize="md">
                      1. Exigencia Mental y Dificultad
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="text_info">
                    ¿Cuánta actividad mental fue necesaria para copiar esta expresión (pensar,
                    decidir, buscar símbolos)? ¿Fue fácil o difícil?
                  </Text>
                  <RatingScale
                    value={nasaMental}
                    onChange={setNasaMental}
                    minLabel="Muy fácil / Mínima"
                    maxLabel="Muy difícil / Máxima"
                  />
                </VStack>
              </Box>

              {/* Pregunta 2: Esfuerzo Requerido */}
              <Box
                p="5"
                borderRadius="xl"
                bg={{ base: "purple.50", _dark: "gray.900" }}
                border="1px solid"
                borderColor={{ base: "purple.200", _dark: "gray.700" }}
              >
                <VStack align="start" gap="3">
                  <HStack>
                    <Icon as={FaTachometerAlt} color="purple.500" boxSize="5" />
                    <Text fontWeight="bold" color="heading" fontSize="md">
                      2. Esfuerzo Requerido
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="text_info">
                    ¿Qué tanto tuviste que trabajar (mental y físicamente) para lograr ingresar
                    correctamente la fórmula?
                  </Text>
                  <RatingScale
                    value={nasaEffort}
                    onChange={setNasaEffort}
                    minLabel="Mínimo esfuerzo"
                    maxLabel="Esfuerzo extremo"
                  />
                </VStack>
              </Box>

              {/* Pregunta 3: Frustración y Estrés */}
              <Box
                p="5"
                borderRadius="xl"
                bg={{ base: "teal.50", _dark: "gray.900" }}
                border="1px solid"
                borderColor={{ base: "teal.200", _dark: "gray.700" }}
              >
                <VStack align="start" gap="3">
                  <HStack>
                    <Icon as={FaSmile} color="teal.500" boxSize="5" />
                    <Text fontWeight="bold" color="heading" fontSize="md">
                      3. Nivel de Frustración y Estado Emocional
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="text_info">
                    ¿Qué tan estresado, molesto o inseguro vs seguro, contento y relajado te
                    sentiste durante la tarea?
                  </Text>
                  <RatingScale
                    value={nasaFrustration}
                    onChange={setNasaFrustration}
                    minLabel="1: Seguro, contento y relajado"
                    maxLabel="10: Estresado, molesto e inseguro"
                  />
                </VStack>
              </Box>

              {/* Botón de Confirmación NASA-TLX */}
              <Flex justify="flex-end" pt="2">
                <Button size="lg" colorPalette="teal" px="8" onClick={handleConfirmNasaTlx}>
                  Guardar y Continuar al Siguiente Ejercicio <Icon as={FaArrowRight} ml="2" />
                </Button>
              </Flex>
            </VStack>
          </Card.Root>
        )}

        {/* FASE 4: ENCUESTA FINAL GOOGLE FORMS (POST-SURVEY) */}
        {phase === "post_survey" && (
          <Card.Root
            bg="bg.secondary"
            borderRadius="2xl"
            p={{ base: 6, md: 8 }}
            border="1px solid"
            borderColor="border"
          >
            <VStack align="stretch" gap="6">
              <Heading size="lg" color="heading">
                Paso 3: Encuesta Final de Salida
              </Heading>

              <Text color="text_info" fontSize="md">
                ¡Has completado todos los ejercicios! Para finalizar tu participación en la
                investigación, por favor responde la siguiente encuesta de salida.
              </Text>

              {/* Contenedor de Google Forms Salida */}
              <Box
                p="6"
                borderRadius="xl"
                bg={{ base: "purple.50", _dark: "gray.900" }}
                border="1px solid"
                borderColor={{ base: "purple.200", _dark: "gray.700" }}
                textAlign="center"
              >
                <VStack gap="4">
                  <Icon
                    as={FaExternalLinkAlt}
                    boxSize={8}
                    color={{ base: "purple.600", _dark: "purple.300" }}
                  />
                  <Heading size="sm" color="heading">
                    Encuesta de Salida en Google Forms
                  </Heading>
                  <Text fontSize="sm" color="fg.muted">
                    Haz clic en el botón para abrir la encuesta final en una nueva pestaña y
                    respóndela completamente.
                  </Text>
                  <Button colorPalette="purple" size="md" onClick={handleOpenExitForm}>
                    Abrir Encuesta Final en Google Forms <Icon as={FaExternalLinkAlt} ml="2" />
                  </Button>
                </VStack>
              </Box>

              {/* Checkbox de Confirmación Encuesta Salida */}
              <Box
                p="4"
                borderRadius="xl"
                bg={
                  hasClickedExitForm
                    ? { base: "purple.50", _dark: "indigo.900" }
                    : { base: "gray.100", _dark: "gray.800" }
                }
                border="1px solid"
                borderColor={
                  hasClickedExitForm
                    ? { base: "purple.200", _dark: "indigo.700" }
                    : { base: "gray.300", _dark: "gray.700" }
                }
                opacity={hasClickedExitForm ? 1 : 0.75}
                mt="2"
              >
                <HStack
                  gap="3"
                  align="center"
                  cursor={hasClickedExitForm ? "pointer" : "not-allowed"}
                  onClick={() => {
                    if (hasClickedExitForm) {
                      setIsExitSurveyCompleted(!isExitSurveyCompleted);
                    }
                  }}
                >
                  <Box
                    w="24px"
                    h="24px"
                    borderRadius="md"
                    border="2px solid"
                    borderColor={
                      hasClickedExitForm
                        ? { base: "purple.600", _dark: "purple.300" }
                        : { base: "gray.400", _dark: "gray.500" }
                    }
                    bg={isExitSurveyCompleted ? "purple.500" : "transparent"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {isExitSurveyCompleted && <Icon as={FaCheck} color="white" boxSize="14px" />}
                  </Box>
                  <Text fontSize="md" fontWeight="semibold" color="heading">
                    Confirmo que he respondido la encuesta final en Google Forms
                  </Text>
                  {!hasClickedExitForm && (
                    <Badge colorPalette="amber" variant="subtle" ml="auto">
                      <Icon as={FaLock} mr="1" /> Haz clic en &quot;Abrir Encuesta Final&quot;
                      primero
                    </Badge>
                  )}
                </HStack>
              </Box>

              {/* Botón para concluir */}
              <Flex justify="flex-end" pt="4" align="center">
                <Button
                  size="lg"
                  colorPalette="green"
                  disabled={!isExitSurveyCompleted}
                  onClick={() => {
                    setPhase("finished");
                    try {
                      localStorage.removeItem(storageKey);
                    } catch {}
                    action({
                      verbName: "thesisCompleteExperiment",
                      extra: { seed: currentSeed, user: userIdentifier },
                    });
                  }}
                >
                  Finalizar Prueba <Icon as={FaCheckCircle} ml="2" />
                </Button>
              </Flex>
            </VStack>
          </Card.Root>
        )}

        {/* FASE 5: PANTALLA FINAL (PRUEBA COMPLETADA) */}
        {phase === "finished" && (
          <Card.Root
            bg="bg.secondary"
            borderRadius="2xl"
            p={{ base: 8, md: 12 }}
            border="1px solid"
            borderColor="border"
            textAlign="center"
          >
            <VStack gap="6" justify="center">
              <Icon as={FaCheckCircle} boxSize={16} color="green.400" />

              <Heading size="2xl" color="heading">
                ¡Prueba Completada!
              </Heading>

              <Text fontSize="lg" color="text_info" maxW="2xl">
                Muchas gracias por tu participación en esta investigación. Has completado
                exitosamente todos los ejercicios y encuestas para la{" "}
                <strong>Semilla #{currentSeed}</strong>.
              </Text>

              <Box
                p="4"
                borderRadius="xl"
                bg={{ base: "indigo.50", _dark: "indigo.900" }}
                border="1px solid"
                borderColor={{ base: "indigo.200", _dark: "indigo.700" }}
                maxW="md"
                w="full"
              >
                <Text fontSize="sm" fontWeight="bold" color="heading">
                  Resumen de Participación:
                </Text>
                <Text fontSize="xs" color="fg.muted" mt="1">
                  Ejercicios resueltos: {seedSequence.length} | Cuenta: {detected.accountName} |
                  Encuestas NASA-TLX: Completadas
                </Text>
              </Box>

              <Button colorPalette="blue" size="lg" mt="4" onClick={handleResetProgress}>
                Volver al Inicio
              </Button>
            </VStack>
          </Card.Root>
        )}
      </VStack>

      {/* Modal Pizarra Digital (MathPixBoard) */}
      <MathPixBoard
        isOpen={isBoardOpen}
        onClose={() => setIsBoardOpen(false)}
        onCapture={handleCapturePizarra}
        stepTitle={currentExercise?.title}
        stepExpression={currentExercise?.targetLatex}
      />
    </Container>
  );
});
