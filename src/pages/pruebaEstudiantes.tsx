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
} from "react-icons/fa";
import { MathPixBoard } from "../components/whiteboard/MathPixBoard";
import MQStaticMathField from "../utils/MQStaticMathField";
import { useAction } from "../utils/action";
import {
  EXPERIMENT_EXERCISES,
  getSeedFromUser,
  SEED_ASSIGNMENTS,
  InputMode,
} from "../utils/thesisSeeds";
import { addStyles, EditableMathField } from "react-mathquill";

addStyles();

type Phase = "intro" | "survey" | "exercise" | "post_survey" | "finished";

// URLs por defecto de Google Forms para la encuesta inicial y de salida (configurables por env)
const ENTRY_FORMS_URL =
  process.env.NEXT_PUBLIC_THESIS_ENTRY_FORMS_URL || "https://forms.google.com/";
const EXIT_FORMS_URL = process.env.NEXT_PUBLIC_THESIS_EXIT_FORMS_URL || "https://forms.google.com/";

export default withAuth(function PruebaEstudiantes() {
  const { user, auth0User } = useAuth();
  const action = useAction();

  // Detección de cuenta y semilla asignada (semilla fija según la cuenta)
  const userIdentifier = auth0User?.nickname || user?.email || user?.name || "";
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

  // Clave única de almacenamiento local según el usuario
  const storageKey = `thesis_progress_${userIdentifier || "guest"}`;

  // Registro del tiempo de inicio del ejercicio activo
  const exerciseStartTimeRef = useRef<number>(Date.now());

  const seedConfig = SEED_ASSIGNMENTS[currentSeed] || SEED_ASSIGNMENTS[0];
  const currentExercise = EXPERIMENT_EXERCISES[currentExerciseIndex];
  const currentModeInfo = seedConfig.exerciseModes.find(m => m.exerciseId === currentExercise?.id);
  const currentMode: InputMode = currentModeInfo?.mode || "teclado";

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
  }, [currentSeed, storageKey]);

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
    if (phase === "exercise") {
      exerciseStartTimeRef.current = Date.now();
    }
  }, [phase, currentExerciseIndex]);

  // Función para reiniciar el experimento completamente de cero
  const handleResetProgress = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    setStudentLatex("");
    setSubmittedLatex({});
    setCurrentExerciseIndex(0);
    setPhase("intro");
    setHasClickedEntryForm(false);
    setIsEntrySurveyCompleted(false);
    setHasClickedExitForm(false);
    setIsExitSurveyCompleted(false);
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

  // Apertura de enlaces a Google Forms con habilitación del Checkbox
  const handleOpenEntryForm = () => {
    setHasClickedEntryForm(true);
    window.open(ENTRY_FORMS_URL, "_blank", "noopener,noreferrer");
    action({
      verbName: "thesisOpenEntryForm",
      extra: { seed: currentSeed, user: userIdentifier },
    });
  };

  const handleOpenExitForm = () => {
    setHasClickedExitForm(true);
    window.open(EXIT_FORMS_URL, "_blank", "noopener,noreferrer");
    action({
      verbName: "thesisOpenExitForm",
      extra: { seed: currentSeed, user: userIdentifier },
    });
  };

  // Transición al siguiente ejercicio o fase de Encuesta Final registrando la duración exacta
  const advanceToNextExercise = (finalLatex: string) => {
    if (!currentExercise) return;

    const endTime = Date.now();
    const startTime = exerciseStartTimeRef.current;
    const timeSpentMs = Math.max(0, endTime - startTime);
    const timeSpentSec = Number((timeSpentMs / 1000).toFixed(2));

    const updatedSubmitted = { ...submittedLatex, [currentExercise.id]: finalLatex };
    setSubmittedLatex(updatedSubmitted);

    // Registrar acción en API con métricas de tiempo del ejercicio
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

    // Limpiar entrada
    setStudentLatex("");

    // Avanzar al siguiente ejercicio o a la encuesta final de salida
    if (currentExerciseIndex < EXPERIMENT_EXERCISES.length - 1) {
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

      // Avanzar automáticamente tras capturar de la pizarra
      if (captured.trim()) {
        advanceToNextExercise(captured);
      }
    },
    [action, currentExercise?.id, currentSeed, userIdentifier],
  );

  return (
    <Container maxW="5xl" py="8">
      <VStack align="stretch" gap="6">
        {/* Banner Superior Principal (Compatible con Modo Claro y Oscuro) */}
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
                  automáticamente según tu cuenta asignada (Semilla #{currentSeed}).
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

              {/* Contenedor de Google Forms adaptado */}
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

              {/* Checkbox de Confirmación (Habilitado sólo al hacer clic en abrir el form) */}
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
                      <Icon as={FaLock} mr="1" /> Haz clic en "Abrir Encuesta" primero
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
        {phase === "exercise" && currentExercise && (
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
                  Ejercicio {currentExerciseIndex + 1} de {EXPERIMENT_EXERCISES.length}
                </Text>
                <Badge colorPalette={currentMode === "pizarra" ? "purple" : "blue"} variant="solid">
                  <Icon as={currentMode === "pizarra" ? FaPencilAlt : FaKeyboard} mr="1.5" />
                  {currentMode === "pizarra" ? "Modo: Pizarra Digital" : "Modo: Teclado Matemático"}
                </Badge>
              </Flex>
              <Progress.Root
                value={((currentExerciseIndex + 1) / EXPERIMENT_EXERCISES.length) * 100}
                colorPalette="teal"
              >
                <Progress.Track />
              </Progress.Root>
            </Card.Root>

            {/* Contenedor Único del Ejercicio y Componente de Entrada Solicitado */}
            <Card.Root
              bg="bg.secondary"
              borderRadius="2xl"
              p={{ base: 6, md: 8 }}
              border="1px solid"
              borderColor="border"
            >
              <VStack align="stretch" gap="6">
                {/* Título e Instrucción del Ejercicio */}
                <VStack align="center" textAlign="center" gap="1">
                  <Heading size="lg" color="heading">
                    {currentExercise.title}
                  </Heading>
                  <Text fontSize="sm" color="fg.muted">
                    {currentExercise.instruction}
                  </Text>
                </VStack>

                {/* Expresión Matemática a Copiar (Caja Destacada de Alto Contraste) */}
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

                {/* COMPONENTE MQ2 (MODO TECLADO): Muestra únicamente botones, input MathQuill e Enviar */}
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
                      {/* Fila 1 de Botones Matemáticos Mq2 */}
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

                      {/* Fila 2 de Botones Matemáticos Mq2 */}
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

                      {/* Campo MathQuill de Ingreso */}
                      <Box w="full" maxW="400px" my="2">
                        <EditableMathField
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

                      {/* Botón Enviar de Mq2 */}
                      <Button
                        size="lg"
                        colorPalette="teal"
                        px="8"
                        disabled={!studentLatex.trim()}
                        onClick={() => advanceToNextExercise(studentLatex)}
                      >
                        Enviar
                      </Button>
                    </VStack>
                  </Box>
                )}

                {/* COMPONENTE WHITEBOARD (MODO PIZARRA): Muestra únicamente el botón para abrir la pizarra manuscrita */}
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
                      <Icon as={FaLock} mr="1" /> Haz clic en "Abrir Encuesta Final" primero
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
                  Ejercicios resueltos: {EXPERIMENT_EXERCISES.length} | Cuenta:{" "}
                  {detected.accountName} | Encuestas: Entrada y Salida Completadas
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
