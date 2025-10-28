// RecInferior.tsx — versión Chakra v1
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  RadioGroup,
  Radio,
  Text,
  Stack,
  Flex,
  Image,
  SimpleGrid,
  SlideFade, // ✅ v1: animación en lugar de Presence
} from "@chakra-ui/react";
import Latex from "react-latex-next";
import TalkBubble from "./TalkBubble";
import dynamic from "next/dynamic";
import { useAction } from "../../utils/action";
import Hint from "../../components/Hint";
import TypeText from "./TypeText";

const Mathfield = dynamic(() => import("../LogicTutor/Tools/mathLive"), { ssr: false });

interface RecInferiorProps {
  steps: any;
  stepTitle: string;
  codeExercise: string;
  topicID: string;
  stepLength: number;
  onAlternativeClick: (isCorrect: boolean) => void;
  onExerciseComplete: () => void;
}

// Función para mezclar el arreglo de alternativas
const shuffleArray = (array: any[]) => {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const RecInferior: React.FC<RecInferiorProps> = ({
  steps,
  stepLength,
  stepTitle,
  codeExercise,
  topicID,
  onAlternativeClick,
  onExerciseComplete,
}) => {
  const [alternativas, setAlternativas] = useState<any[]>([]);
  const [selectedAlt, setSelectedAlt] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [_, setLastHint] = useState(false);
  const [step, setStep] = useState(0);
  const action = useAction();
  const [showError, setShowError] = useState(false);
  const [, setHintUnlocked] = useState(false);

  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());
  let duration = 0;

  const [userInput, setUserInput] = useState<string>("\\large\\placeholder[a]{}\\quad");

  const arrayRef = useRef<Array<[number, number, number, number]>>([]);

  const [feedbackPermanent, setFeedbackPermanent] = useState<string | null>(null);

  const [bubbleMsg, setBubbleMsg] = useState<string | null>(null);
  const [bubbleStatus, setBubbleStatus] = useState<"idle" | "correct" | "incorrect">("idle");

  const hasMultipleChoice = steps.multipleChoice?.length > 0;
  const shouldShowHint = attempts >= 1;

  const [feedbackMsg, setfeedbackMsg] = useState<string>("");
  const [feedbackMsgExp, setFeedbackMsgExp] = useState<string | null>(null);

  const mateoIdle = "/img/mateo1.png";
  const mateoIncorrect = "/img/mateo2.png";
  const mateoCorrect = "/img/mateo3.png";
  const [imageMateo, setImageMateo] = useState<string>(mateoIdle);

  const [altsDisabled, setAltsDisabled] = useState<"auto" | "none">("auto");

  useEffect(() => {
    setStepStartTime(Date.now());
    setImageMateo(mateoIdle);

    if (hasMultipleChoice) {
      setAlternativas(shuffleArray(steps.multipleChoice));
    }
    setFeedback(null);
    setHintUnlocked(false);
    setUserInput("\\large\\placeholder[a]{}\\quad");
    setAttempts(0);
    setHints(0);
    setShowError(false);
    setBubbleMsg(null);
    setfeedbackMsg("");
    setSelectedAlt("");
    setAltsDisabled("auto");
  }, [steps]);

  const handleSubmit = () => {
    let isCorrect = false;

    if (hasMultipleChoice) {
      if (selectedAlt === null || selectedAlt === "") {
        setFeedback("Por favor, selecciona una respuesta.");
        return;
      }

      const altObj = alternativas.find(a => a.expression === selectedAlt);
      isCorrect = !!altObj?.correct;

      if (isCorrect) {
        setImageMateo(mateoCorrect);
        setBubbleStatus("correct");
        setBubbleMsg("¡Respuesta correcta!");
        setAltsDisabled("none");

        if (step === stepLength - 1) {
          setTimeout(() => {
            setBubbleStatus("idle");
            setBubbleMsg(null);
            setImageMateo(mateoIdle);
            setAltsDisabled("auto");
          }, 3000);
        } else {
          setTimeout(() => {
            setBubbleStatus("idle");
            setBubbleMsg(null);
            setImageMateo(mateoIdle);
            setAltsDisabled("auto");
          }, 2000);
        }

        if (step < stepLength - 1) {
          setStep(step + 1);
        }

        const endTime = Date.now();
        duration = (endTime - stepStartTime) / 1000;

        arrayRef.current.push([steps.stepId, attempts, hints, duration]);

        setShowError(false);
        setTimeout(() => setFeedback(""), 1000);
        setFeedbackPermanent(null);
        setTimeout(() => onAlternativeClick(true), 2000);
      } else {
        setAttempts(attempts + 1);
        setImageMateo(mateoIncorrect);
        setAltsDisabled("none");

        if (altObj?.feedbackMsg) {
          setfeedbackMsg("\n(" + altObj.feedbackMsg + ")");
          if (altObj.feedbackMsgExp) {
            setfeedbackMsg("\n(" + altObj.feedbackMsg);
            setFeedbackMsgExp(altObj.feedbackMsgExp);
          }
        } else if (steps.incorrectMsg) {
          setfeedbackMsg("\n(" + steps.incorrectMsg + ")");
        } else {
          setfeedbackMsg("\n(Inténtalo nuevamente)");
        }

        setBubbleStatus("incorrect");
        setBubbleMsg("¡Respuesta incorrecta!");
        setTimeout(() => {
          setBubbleStatus("idle");
          setBubbleMsg(null);
          setImageMateo(mateoIdle);
          setSelectedAlt("");
          setAltsDisabled("auto");
        }, 1750);

        setShowError(true);
        setHintUnlocked(true);
        onAlternativeClick(false);
      }

      action({
        verbName: "tryStep",
        stepID: "" + steps.stepId,
        contentID: codeExercise,
        topicID: topicID,
        result: isCorrect ? 1 : 0,
        kcsIDs: steps.KCs,
        extra: {
          response: [selectedAlt],
          attempts: attempts,
          hints: hints,
          tutor: ["PIZARRA"],
          duration: duration,
        },
      });
    } else {
      if (
        userInput == "\\large\\placeholder[a]{}\\quad" ||
        userInput == "\\large\\placeholder[a]{}\\qquad"
      ) {
        setFeedback("Por favor, ingresa una respuesta.");
        return;
      }

      const respuestaEsperada = `\\large\\placeholder[a]{${steps.answers[0].answer[0]}}\\quad`;
      isCorrect = userInput === respuestaEsperada;

      if (isCorrect) {
        setImageMateo(mateoCorrect);
        setBubbleStatus("correct");
        setBubbleMsg("¡Respuesta correcta!");
        setTimeout(() => {
          setBubbleStatus("idle");
          setBubbleMsg(null);
          setImageMateo(mateoIdle);
        }, 2000);

        if (step < stepLength - 1) {
          setStep(step + 1);
        }

        const endTime = Date.now();
        duration = (endTime - stepStartTime) / 1000;
        arrayRef.current.push([steps.stepId, attempts, hints, duration]);

        setShowError(false);
        setTimeout(() => onAlternativeClick(true), 1000);
        setTimeout(() => setUserInput("\\large\\placeholder[a]{}\\quad"), 1000);
      } else {
        setImageMateo(mateoIncorrect);
        setAttempts(attempts + 1);
        setShowError(true);

        setBubbleStatus("incorrect");
        setBubbleMsg("¡Respuesta incorrecta!");
        setTimeout(() => {
          setBubbleStatus("idle");
          setBubbleMsg(null);
          setImageMateo(mateoIdle);
        }, 1750);

        onAlternativeClick(false);
      }

      action({
        verbName: "tryStep",
        stepID: "" + steps.stepId,
        contentID: codeExercise,
        topicID: topicID,
        result: isCorrect ? 1 : 0,
        kcsIDs: steps.KCs,
        extra: {
          response: [userInput],
          attempts: attempts,
          hints: hints,
          tutor: ["PIZARRA"],
          duration: duration,
        },
      });
    }

    if (step === stepLength - 1 && isCorrect) {
      setTimeout(() => {
        onExerciseComplete();
      }, 1000);

      action({
        verbName: "completeContent",
        contentID: codeExercise,
        topicID: topicID,
        result: 1,
        extra: {
          contentID: codeExercise,
          tutor: ["PIZARRA"],
          arrayDATA: arrayRef.current,
        },
      });
    }
    setTimeout(() => setFeedback(""), 1000);
  };

  return (
    <Box
      bg="white"
      border="1px solid black"
      borderRadius="md"
      p={4}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Flex ml="1%">
        <Image
          src={imageMateo}
          alt="Mateo"
          w="100px"
          h="130px"
          objectFit="contain"
          mt="-15px"
          ml="5px"
        />
        <TalkBubble
          key={steps.stepId}
          textColor={
            bubbleStatus === "incorrect"
              ? "red.500"
              : bubbleStatus === "correct"
              ? "green.500"
              : undefined
          }
        >
          {bubbleMsg ? (
            <Text fontSize="1.2rem" fontWeight="bold">
              <TypeText text={bubbleMsg} speed={10} />
            </Text>
          ) : (
            <>
              <strong>{`PASO ${Number(steps.stepId) + 1}:`}</strong>{" "}
              <TypeText text={stepTitle + (feedbackMsg ?? "")} speed={15} />
              {feedbackMsgExp && (
                <>
                  <Latex>{` $${feedbackMsgExp}$`}</Latex>
                  <TypeText text=")" speed={15} />
                </>
              )}
            </>
          )}
        </TalkBubble>
      </Flex>

      {hasMultipleChoice ? (
        <RadioGroup name="alternativas" value={selectedAlt ?? ""} onChange={v => setSelectedAlt(v)}>
          <SlideFade
            in
            key={`${steps.stepId}-alts`}
            offsetY="6px"
            transition={{ enter: { duration: 0.25 }, exit: { duration: 0.2 } }}
          >
            <SimpleGrid
              columns={{ base: 2, md: 4 }}
              gap={2}
              px={"10%"}
              alignItems="stretch"
              pointerEvents={altsDisabled}
            >
              {alternativas.map((alt: any, index: number) => {
                const isSelected = selectedAlt === alt.expression;
                const statusColor =
                  bubbleStatus === "correct"
                    ? "green"
                    : bubbleStatus === "incorrect"
                    ? "red"
                    : "blue";

                return (
                  <Box
                    as="label"
                    key={index}
                    cursor="pointer"
                    onClick={() => setSelectedAlt(alt.expression)}
                  >
                    {/* Radio real (accesible), podemos ocultar su control visual */}
                    <Radio value={alt.expression} display="none" />

                    {/* Card clickeable con los mismos colores que en v3 */}
                    <Box
                      border="1px solid"
                      borderColor={isSelected ? `${statusColor}.700` : "blue.500"}
                      bg={
                        isSelected
                          ? `${statusColor}.${statusColor === "blue" ? 600 : 500}`
                          : "white"
                      }
                      color={isSelected ? "white" : "black"}
                      rounded="md"
                      px="3"
                      py="2"
                      w="100%"
                      minH="50%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      transition="background 120ms ease, color 120ms ease"
                      _hover={
                        isSelected
                          ? { bg: `${statusColor}.700`, borderColor: `${statusColor}.700` }
                          : { bg: "blue.100", borderColor: "blue.300" }
                      }
                    >
                      <Latex>{`$$${alt.expression}$$`}</Latex>
                    </Box>
                  </Box>
                );
              })}
            </SimpleGrid>
          </SlideFade>
        </RadioGroup>
      ) : (
        <Flex direction="column" align="center">
          <Mathfield value={userInput} onChange={v => setUserInput(v)} readOnly={false} />
        </Flex>
      )}

      <Flex mt={2} justify="center" align="center"></Flex>

      <Flex direction="column" align="center" mt={4}>
        <Stack gap={4} direction="row" justify="center">
          <Button bg="blue.500" color="white" _hover={{ bg: "blue.600" }} onClick={handleSubmit}>
            Enviar respuesta
          </Button>

          {shouldShowHint && (
            <Hint
              key={`hint-${steps.stepId}`}
              hints={steps.hints}
              contentId={codeExercise}
              topicId={topicID}
              stepId={steps.stepId}
              matchingError={steps.matchingError}
              response={[userInput]}
              error={showError}
              setError={setShowError}
              hintCount={hints}
              setHints={setHints}
              setLastHint={setLastHint}
            />
          )}
        </Stack>

        {(feedback || feedbackPermanent) && (
          <Text
            mt={2}
            color={feedback?.includes("correcta!") ? "green.500" : "red.500"}
            textAlign="center"
          >
            {feedback || feedbackPermanent}
          </Text>
        )}
      </Flex>

      <Box id="scroll-anchor" scrollMarginBottom="300px" />
    </Box>
  );
};

export default RecInferior;
