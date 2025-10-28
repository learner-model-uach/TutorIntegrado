// BotonCuadrado copy.tsx — versión Chakra v1
import React, { useEffect, useState } from "react";
import { Grid, Box, Flex, Image, Text, SlideFade } from "@chakra-ui/react";

import Superior from "./RecSuperior";
import Inferior from "./RecInferior";
import { useAction } from "../../utils/action";
import Summary from "./Summary";
import RatingQuestion from "../RatingQuestionV2";
import TalkBubble from "./TalkBubble";
import TypeText from "./TypeText";

interface BotonCuadradoCopyProps {
  exerciseData: any; // JSON con los datos del ejercicio
  topicID: string;
}

const BotonCuadradoCopy: React.FC<BotonCuadradoCopyProps> = ({ exerciseData, topicID }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = exerciseData.steps;
  const action = useAction();
  const [complete, setComplete] = useState(false);

  const handleAlternativeClick = (isCorrect: boolean) => {
    if (isCorrect && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);

      requestAnimationFrame(() => {
        document
          .getElementById("scroll-anchor")
          ?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    }
    console.log("len", steps.length, "currentStep", currentStep);
  };

  const handleExerciseComplete = () => {
    console.log("Recibí señal de ejercicio terminado!");
    setTimeout(() => {
      setComplete(true);
    }, 1000);

    action({
      verbName: "completeContent",
      contentID: exerciseData.code,
      topicID: topicID,
      result: 1,
      extra: { steps: {}, tutor: ["PIZARRA"] },
    });
  };

  useEffect(() => {
    if (complete) {
      requestAnimationFrame(() => {
        document
          .getElementById("summary-anchor")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [complete]);

  const current = steps[currentStep];
  const codeExercise = exerciseData.code;

  // Construcción arrays para RecSuperior
  const exerciseSteps = exerciseData?.steps ?? [];
  const baseExprs = exerciseSteps.map((s: any) => s.expression);
  const stepTitlesBase = exerciseSteps.map((s: any) => s.stepTitle);

  const lastStep = exerciseSteps[exerciseSteps.length - 1];
  const finalExprFromLastStep = lastStep?.displayResult?.[0] ?? lastStep?.expression ?? null;

  const addFinal = Boolean(complete && finalExprFromLastStep);
  const expressionsForTop = addFinal ? [...baseExprs, finalExprFromLastStep] : baseExprs;
  const stepTitlesForTop = addFinal ? [...stepTitlesBase, "Respuesta final"] : stepTitlesBase;

  const currentForTop = addFinal ? currentStep + 1 : currentStep;

  return (
    <Grid templateRows="auto 1fr">
      <Superior
        expressions={expressionsForTop}
        currentStep={currentForTop}
        stepTitles={stepTitlesForTop}
      />

      {complete ? (
        <SlideFade
          in={complete}
          unmountOnExit
          offsetY="10px"
          transition={{ enter: { duration: 0.25 }, exit: { duration: 0.2 } }}
        >
          <Box
            id="summary-anchor"
            width={"50%"}
            justifyContent={"center"}
            alignItems={"center"}
            margin={"auto"}
            mt={4}
          >
            <Flex>
              <Image
                src="/img/mateo4.png"
                alt="Mateo"
                w="120px"
                h="110px"
                objectFit="contain"
                mt="2px"
                mb="30px"
              />
              {/* Nota: steps.stepId no existe (steps es array). Si quieres key estable,
                  podrías usar `key={codeExercise}` o `key={currentStep}` */}
              <TalkBubble textColor={undefined}>
                <Text fontSize="lg">
                  <TypeText
                    text={
                      "¡Felicidades! Has completado el ejercicio\nAquí un resumen de tu desarrollo:"
                    }
                    speed={12}
                  />
                </Text>
              </TalkBubble>
            </Flex>
            <Summary exc={exerciseData} />
            <RatingQuestion />
          </Box>
        </SlideFade>
      ) : (
        <Inferior
          steps={current}
          stepLength={steps.length}
          stepTitle={current.stepTitle}
          codeExercise={codeExercise}
          topicID={topicID}
          onAlternativeClick={handleAlternativeClick}
          onExerciseComplete={handleExerciseComplete}
        />
      )}
    </Grid>
  );
};

export default BotonCuadradoCopy;
