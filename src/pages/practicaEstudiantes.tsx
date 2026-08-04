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
  Progress,
} from "@chakra-ui/react";
import { useState } from "react";
import { withAuth } from "../components/Auth";
import {
  FaGraduationCap,
  FaKeyboard,
  FaPencilAlt,
  FaArrowRight,
  FaCheckCircle,
  FaTrashAlt,
  FaSmile,
} from "react-icons/fa";
import { MathPixBoard } from "../components/whiteboard/MathPixBoard";
import MQStaticMathField from "../utils/MQStaticMathField";
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

export interface PracticeExercise {
  id: string;
  title: string;
  instruction: string;
  targetLatex: string;
  topic: string;
}

export const PRACTICE_EXERCISES: PracticeExercise[] = [
  {
    id: "prac-1",
    title: "Ejercicio 1 (P1): Expresión Lineal Simple",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "2x + 5",
    topic: "Álgebra Introductoria",
  },
  {
    id: "prac-2",
    title: "Ejercicio 2 (P2): Productos Notables",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "x^2 - 9",
    topic: "Productos Notables",
  },
  {
    id: "prac-3",
    title: "Ejercicio 3 (P3): Fracción Algebraica",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "\\frac{a + b}{2}",
    topic: "Fracciones Algebraicas",
  },
  {
    id: "prac-4",
    title: "Ejercicio 4 (P4): Expresión con Raíz",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "\\sqrt{x + 4}",
    topic: "Radicación",
  },
  {
    id: "prac-5",
    title: "Ejercicio 5 (P5): Expresión con Paréntesis",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "3(x - 1)",
    topic: "Multiplicación Algebraica",
  },
  {
    id: "prac-6",
    title: "Ejercicio 6 (P6): Expresión Mixta",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "\\frac{x}{2} + 1",
    topic: "Expresiones Mixtas",
  },
];

type InputMode = "teclado" | "pizarra";

export default withAuth(function PracticaEstudiantes() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [activeMode, setActiveMode] = useState<InputMode>("teclado");
  const [isBoardOpen, setIsBoardOpen] = useState<boolean>(false);
  const [studentLatex, setStudentLatex] = useState<string>("");
  const [submittedLatex, setSubmittedLatex] = useState<Record<string, string>>({});
  const [ta, setTa] = useState<any>(null);

  const currentExercise = PRACTICE_EXERCISES[currentExerciseIndex];
  const isCompleted = Boolean(submittedLatex[currentExercise.id]);

  // Insertar símbolos en MathQuill idéntico a pruebaEstudiantes
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

  const handleNextExercise = () => {
    if (currentExerciseIndex < PRACTICE_EXERCISES.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setStudentLatex("");
    }
  };

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setStudentLatex("");
    }
  };

  const handleSaveAnswer = (latexVal?: string) => {
    const valToSave = latexVal !== undefined ? latexVal : studentLatex;
    setSubmittedLatex(prev => ({
      ...prev,
      [currentExercise.id]: valToSave,
    }));
  };

  const handleResetPractice = () => {
    setCurrentExerciseIndex(0);
    setStudentLatex("");
    setSubmittedLatex({});
    setActiveMode("teclado");
  };

  return (
    <Container maxW="container.md" py="8">
      <VStack align="stretch" gap="6">
        {/* ENCABEZADO IDÉNTICO A PRUEBA ESTUDIANTES */}
        <Box
          p={{ base: "6", md: "8" }}
          bgGradient="to-r"
          gradientFrom="indigo.600"
          gradientTo="purple.600"
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
                  Mateo Tutor - Práctica Libre
                </Badge>
              </HStack>
              <Heading size="xl" fontWeight="bold" color="white">
                Práctica Estudiantes
              </Heading>
              <Text fontSize="md" color="indigo.100">
                Espacio de entrenamiento para resolver dudas y familiarizarte con las herramientas antes de la prueba. Sin notas ni registros.
              </Text>
            </VStack>
          </Flex>
        </Box>

        {/* BARRA DE PROGRESO Y SELECTOR DE HERRAMIENTA IDÉNTICO A PRUEBA ESTUDIANTES */}
        <Card.Root
          p="4"
          bg="bg.secondary"
          borderRadius="xl"
          border="1px solid"
          borderColor="border"
        >
          <VStack align="stretch" gap="3">
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="bold" color="heading">
                Ejercicio de Práctica {currentExerciseIndex + 1} de {PRACTICE_EXERCISES.length}
              </Text>
              <HStack gap="2">
                <Button
                  size="xs"
                  variant={activeMode === "teclado" ? "solid" : "outline"}
                  colorPalette={activeMode === "teclado" ? "blue" : "gray"}
                  onClick={() => setActiveMode("teclado")}
                >
                  <Icon as={FaKeyboard} me="1" /> Teclado
                </Button>
                <Button
                  size="xs"
                  variant={activeMode === "pizarra" ? "solid" : "outline"}
                  colorPalette={activeMode === "pizarra" ? "purple" : "gray"}
                  onClick={() => setActiveMode("pizarra")}
                >
                  <Icon as={FaPencilAlt} me="1" /> Pizarra
                </Button>
              </HStack>
            </Flex>
            <Progress.Root
              value={((currentExerciseIndex + 1) / PRACTICE_EXERCISES.length) * 100}
              colorPalette="teal"
            >
              <Progress.Track />
            </Progress.Root>
          </VStack>
        </Card.Root>

        {/* CONTENEDOR DEL EJERCICIO IDÉNTICO A PRUEBA ESTUDIANTES */}
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

            {/* EXPRESIÓN MATEMÁTICA A COPIAR (IDÉNTICO ESTILO AL DE PRUEBA) */}
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

            {/* MODO TECLADO: BOTONES + CAMPO MATHQUILL + BOTÓN ENVIAR (IDÉNTICO A PRUEBA ESTUDIANTES) */}
            {activeMode === "teclado" && (
              <Box
                p="6"
                borderRadius="2xl"
                bg={{ base: "gray.50", _dark: "gray.900" }}
                border="1px solid"
                borderColor={{ base: "gray.200", _dark: "gray.700" }}
                mt="2"
              >
                <VStack align="center" gap="4">
                  {/* Fila 1 de Botones */}
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

                  {/* Fila 2 de Botones */}
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

                  {/* Campo MathQuill Editable Estilo Prueba */}
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

                  {/* Botón Enviar Respuesta */}
                  <Button
                    size="lg"
                    colorPalette="teal"
                    px="8"
                    disabled={!studentLatex.trim()}
                    onClick={() => handleSaveAnswer(studentLatex)}
                  >
                    Confirmar Respuesta
                  </Button>
                </VStack>
              </Box>
            )}

            {/* MODO PIZARRA: BOTÓN ABRIR PIZARRA (IDÉNTICO A PRUEBA ESTUDIANTES) */}
            {activeMode === "pizarra" && (
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
                    Para este ejercicio puedes probar la Pizarra Digital Manuscrita.
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Haz clic en el botón a continuación para abrir la pizarra, escribe la fórmula a mano y presiona Enviar.
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

            {/* RESPUESTA CONFIRMADA */}
            {isCompleted && (
              <Box
                p="4"
                borderRadius="xl"
                bg={{ base: "green.50", _dark: "green.950" }}
                border="1px solid"
                borderColor={{ base: "green.200", _dark: "green.800" }}
              >
                <HStack gap="2">
                  <Icon as={FaCheckCircle} color="green.500" boxSize="5" />
                  <Text fontSize="sm" fontWeight="bold" color="green.700" _dark={{ color: "green.300" }}>
                    Respuesta registrada en práctica:
                  </Text>
                  <Text fontSize="md" fontFamily="mono" color="heading" ml="2">
                    {submittedLatex[currentExercise.id]}
                  </Text>
                </HStack>
              </Box>
            )}
          </VStack>

          {/* NAVEGACIÓN DE BOTONES INFERIORES */}
          <Flex justify="space-between" align="center" mt="8" pt="4" borderTop="1px solid" borderColor="border">
            <Button
              variant="outline"
              size="md"
              onClick={handlePrevExercise}
              disabled={currentExerciseIndex === 0}
            >
              Anterior
            </Button>

            <HStack gap="3">
              <Button variant="ghost" size="sm" colorPalette="gray" onClick={handleResetPractice}>
                <Icon as={FaTrashAlt} mr="1" /> Reiniciar Práctica
              </Button>

              {currentExerciseIndex < PRACTICE_EXERCISES.length - 1 ? (
                <Button size="md" colorPalette="blue" onClick={handleNextExercise}>
                  Siguiente Ejercicio <Icon as={FaArrowRight} ml="2" />
                </Button>
              ) : (
                <Badge colorPalette="green" size="lg" variant="solid" px="4" py="2" borderRadius="full">
                  <Icon as={FaSmile} mr="2" /> ¡Práctica Completada!
                </Badge>
              )}
            </HStack>
          </Flex>
        </Card.Root>

        {/* MODAL DE PIZARRA DIGITAL MATHPIX */}
        <MathPixBoard
          isOpen={isBoardOpen}
          onClose={() => setIsBoardOpen(false)}
          stepTitle={currentExercise.title}
          stepExpression={currentExercise.targetLatex}
          onCapture={response => {
            const capturedLatex = response.latex || response.text || "";
            setStudentLatex(capturedLatex);
            handleSaveAnswer(capturedLatex);
            setIsBoardOpen(false);
          }}
        />
      </VStack>
    </Container>
  );
});
