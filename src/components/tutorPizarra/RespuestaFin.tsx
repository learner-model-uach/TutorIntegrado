import React, { useState } from "react";
import { Button, Text, Flex, Image } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import TalkBubble from "./TalkBubble";
import { useAction } from "../../utils/action";

const Mathfield = dynamic(() => import("../LogicTutor/Tools/mathLive"), { ssr: false });

interface RespuestaFinProps {
  exerciseData: any;
  topicID: string; // ID del tema
}

const RespuestaFin: React.FC<RespuestaFinProps> = ({ exerciseData, topicID }) => {
  const [userInput, setUserInput] = useState("\\large$\\placeholder[a]{} \\qquad");
  const [feedback, setFeedback] = useState<string | null>(null);

  const lastStep = exerciseData.steps[exerciseData.steps.length - 1];
  const respuestaEsperada = `\\large\\placeholder[a]{${lastStep.answers[0].answer[0]}}\\qquad`;

  const [attempts, setAttempts] = useState(0);
  const [hintsShow] = useState(0);

  const allKCs = exerciseData.steps.flatMap((step: any) => step.KCs || []);
  const extras = { steps: {} };

  const action = useAction();

  const handleSubmit = () => {
    if (
      userInput === "\\large$\\placeholder[a]{} \\qquad" ||
      userInput === "\\large\\placeholder[a]{}\\qquad"
    ) {
      setFeedback("Por favor, ingresa una respuesta.");
      return;
    }

    const isCorrect = userInput === respuestaEsperada;

    if (isCorrect) {
      setFeedback("¡Respuesta correcta!");
      action({
        verbName: "completeContent",
        contentID: exerciseData.code,
        topicID,
        result: 1,
        extra: extras,
      });
      setTimeout(() => setUserInput("\\large\\placeholder[a]{}\\qquad"), 1000);
    } else {
      setFeedback("Respuesta incorrecta. Intenta nuevamente.");
    }

    action({
      verbName: "tryStep",
      stepID: "" + exerciseData.steps.stepId,
      contentID: exerciseData.code,
      topicID,
      result: isCorrect ? 1 : 0,
      kcsIDs: allKCs,
      extra: {
        response: [userInput],
        attemps: attempts, // (mantengo tu campo tal cual)
        hints: hintsShow,
      },
    });

    setAttempts(n => n + 1);
    setTimeout(() => setFeedback(""), 1000);
  };

  return (
    <Flex p={4} direction="column" align="center" gap={3} as="section">
      {/* Cabecera con avatar y globo */}
      <Flex align="center" alignSelf="flex-start" ml="25%">
        <Image src="/img/mateo.png" alt="Mateo" w="80px" h="80px" objectFit="contain" mt="-5%" />
        <TalkBubble>{"PASO Final: Ingrese la respuesta final del ejercicio."}</TalkBubble>
      </Flex>

      {/* Editor Matemático */}
      <Mathfield
        value={userInput}
        onChange={(newLatex: string) => setUserInput(newLatex)}
        readOnly={false}
      />

      {/* Botón de envío */}
      <Button bg="blue.500" color="white" _hover={{ bg: "blue.600" }} onClick={handleSubmit}>
        Enviar respuesta
      </Button>

      {/* Feedback */}
      {!!feedback && (
        <Text
          mt={2}
          color={feedback.includes("correcta!") ? "green.500" : "red.500"}
          textAlign="center"
        >
          {feedback}
        </Text>
      )}
    </Flex>
  );
};

export default RespuestaFin;
