import React, { useState, memo, useEffect, useRef } from "react";
import RatingQuestion from "../../RatingQuestion";
import { FaHandPointRight } from "react-icons/fa";

import {
  Flex,
  Box,
  Accordion,
  Heading,
  Alert,
  Text,
  HStack,
  VStack,
  Center,
  Image,
} from "@chakra-ui/react";

import dynamic from "next/dynamic";

//reporte de acciones
import { useAction } from "../../../utils/action";

import type { ExType, Step } from "./ExcerciseType";

import { useSnapshot } from "valtio";
import MQProxy, { reset } from "./MQProxy";
import MQStaticMathField from "../../../utils/MQStaticMathField";
import ShuffledLoad from "./CChoice";

const Mq2 = dynamic(
  () => {
    return import("./Mq2");
  },
  { ssr: false },
);

interface value {
  ans: string;
  att: number;
  hints: number;
  lasthint: boolean;
  fail: boolean;
  duration: number;
}

export interface potato {
  disabled: boolean;
  hidden: boolean;
  answer: boolean;
  value: value;
  open: boolean;
}

type AlertStatus = "error" | "info" | "warning" | "success";

interface FeedbackAlertProps {
  topicId: string;
  status?: AlertStatus;
  mqMsg?: string;
  fallbackMsg?: string;
  mt?: number;
}

export const FeedbackAlert = ({
  topicId,
  status = "success",
  mqMsg,
  fallbackMsg,
  mt = 2,
}: FeedbackAlertProps) => {
  return (
    <Alert.Root key={`Alert-${topicId}`} status={status} mt={mt}>
      <Alert.Indicator key={`AlertIcon-${topicId}`} />
      <Alert.Content>
        <Alert.Description>{mqMsg ? mqMsg : fallbackMsg}</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
};

export const Steporans = ({
  step,
  topicId,
  content,
  i,
  answer,
}: {
  step: Step;
  topicId: string;
  content: string;
  i: number;
  answer?: string;
}) => {
  const [currentComponent, setCC] = useState(<></>);
  useEffect(() => {
    if (answer && answer != "") {
      setCC(
        <>
          <MQStaticMathField key={"respuesta" + i} exp={answer} currentExpIndex={true} />
          <FeedbackAlert
            topicId={topicId + "i"}
            mqMsg={MQProxy.spaghettimsg}
            fallbackMsg={step.correctMsg}
            status="success"
          />
        </>,
      );
    } else {
      if (step.multipleChoice != undefined)
        setCC(
          <ShuffledLoad
            key={"Mq2" + i}
            step={step}
            content={content}
            topicId={topicId}
            disablehint={false}
          />,
        );
      else
        setCC(
          <Mq2
            key={"Mq2" + i}
            step={step}
            content={content}
            topicId={topicId}
            disablehint={false}
          />,
        );
    }
  }, [answer, step, content, topicId, i]);

  return currentComponent;
};

export const Header = ({
  title,
  subtitle,
  img,
  mathExp,
}: {
  title: string;
  subtitle: string;
  img?: string;
  mathExp?: string;
}) => (
  <>
    <Heading as="h1" size="3xl" lineClamp={3} color={"heading"} mb={"1rem"}>
      {title}
    </Heading>
    <Heading as="h5" size="md" mb={"0.5rem"}>
      {subtitle}
    </Heading>
    {img ? (
      <Image src={`/img/${img}`} w="md" paddingY={5} alt="Imagen del ejercicio" />
    ) : (
      <MQStaticMathField exp={mathExp || ""} currentExpIndex={true} />
    )}
  </>
);

export const CustomAccordionItem = ({
  index,
  step,
  test,
  stepsCode,
  topicId,
  action,
  setTest,
}: {
  index: number;
  step: Step;
  test: Array<potato>;
  stepsCode: string;
  topicId: string;
  action: any;
  setTest: React.Dispatch<React.SetStateAction<Array<potato>>>;
}) => {
  const stepId = parseInt(step.stepId);
  const stepData = test[stepId]; // Ahora es de tipo: potato | undefined

  const handleAccordionClick = () => {
    const potstates = [...test];
    const potstate = potstates[stepId];
    if (potstate) {
      if (!potstate.open) {
        action({
          verbName: "openStep",
          stepID: "" + index,
          contentID: stepsCode,
          topicID: topicId,
        });
        potstate.open = true;
      } else {
        action({
          verbName: "closeStep",
          stepID: "" + index,
          contentID: stepsCode,
          topicID: topicId,
        });
        potstate.open = false;
      }
      potstates[stepId] = potstate;
      setTest(potstates);
    }
  };

  const idx = Number(step.stepId);
  const isOpen = (MQProxy.defaultIndex ?? []).includes(Number(step.stepId));
  const isDone = Boolean(test[idx]?.answer);

  return (
    <Accordion.Item
      key={`AccordionItem${index}`}
      value={String(step.stepId)}
      disabled={Boolean(stepData?.disabled)}
      hidden={Boolean(stepData?.hidden)}
    >
      <h2 key={"AIh2" + index}>
        <Alert.Root status={stepData?.answer ? "success" : "info"}>
          <Alert.Content>
            <Accordion.ItemTrigger onClick={handleAccordionClick}>
              <Box pr={3}>
                <FaHandPointRight />
              </Box>
              <Box flex="1" textAlign="left">
                {step.stepTitle}
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Alert.Content>
        </Alert.Root>
      </h2>

      <Accordion.ItemContent>
        <Accordion.ItemBody pb={4}>
          {isOpen && !isDone && step.expression && step.multipleChoice != undefined ? (
            <Center>
              <Box mb="3" overflow="visible">
                <MQStaticMathField
                  key={`mq-enunciado-${step.stepId}-open`}
                  exp={step.expression}
                  currentExpIndex={true}
                />
              </Box>
            </Center>
          ) : null}
          <Steporans
            key={`Steporans-${step.stepId}-${isOpen ? "open" : "closed"}`}
            step={step}
            topicId={topicId}
            content={stepsCode}
            i={index}
            answer={stepData?.value?.ans}
          />
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
};

// DESPUÉS
export const SummaryStep = ({
  summary,
  displayResult,
  currentExpIndex,
  stepIndex,
}: {
  summary?: string;           // ✅ opcional
  displayResult?: string[];   // ✅ opcional
  currentExpIndex: boolean;
  stepIndex: number;
}) => {
  // ✅ Si no hay summary ni displayResult, no renderiza nada
  if (!summary && (!displayResult || displayResult.length === 0)) return null;

  return (
    <Box key={"ResumenBox" + stepIndex}>
      {summary && (
        <Text key={"ResumenText" + stepIndex} w="100%" justifyContent={"space-between"}>
          {summary}
        </Text>
      )}
      {/* ✅ Solo renderiza si hay displayResult con contenido */}
      {displayResult?.[0] && (
        <Box key={"ResumenMCContainer" + stepIndex} display="flex" justifyContent="center">
          <MQStaticMathField
            key={"ResumenMC" + stepIndex}
            exp={displayResult[0]}         // ✅ ya garantizado por el guard de arriba
            currentExpIndex={currentExpIndex}
          />
        </Box>
      )}
    </Box>
  );
};

export const Summary = ({
  initialExp,
  steps,
  resumen,
}: {
  initialExp: string;
  steps: ExType;
  resumen: boolean;
}) => (
  <VStack w="100%" align="start">
    <Center>
      <Heading fontSize="xl">Resumen</Heading>
    </Center>
    <HStack>
      <Text>Expresión:</Text>
      <MQStaticMathField exp={initialExp || ""} currentExpIndex={!resumen} />
    </HStack>
    {steps.steps.map((step, i) => (
      <SummaryStep
        key={`step-${i}`}
        summary={step.summary}
        displayResult={step.displayResult}
        currentExpIndex={!resumen}
        stepIndex={i}
      />
    ))}
  </VStack>
);

const Solver2 = ({ topicId, steps }: { topicId: string; steps: ExType }) => {
  const mqSnap = useSnapshot(MQProxy);

  const action = useAction();
  const currentStep = useRef(0);
  const [test, setTest] = useState<Array<potato>>([]);
  const [resumen, setResumen] = useState(true);
  const [stepsCount, setStepsCount] = useState(0);

  useEffect(() => {
    console.log("Solver2 mounted with:", { topicId, steps });
  }, [topicId, steps]);

  useEffect(() => {
    reset();
    MQProxy.startDate = Date.now();
    MQProxy.content = steps.code;
    MQProxy.topicId = topicId;
    action({
      verbName: "loadContent",
      contentID: steps?.code,
      topicID: topicId,
    });
  }, []);

  useEffect(() => {
    const cantidadDePasos = steps.steps.length;
    setStepsCount(cantidadDePasos);
    let potatoStates: Array<potato> = [
      {
        disabled: false,
        hidden: false,
        answer: false,
        value: {
          ans: "",
          att: 0,
          hints: 0,
          lasthint: false,
          fail: false,
          duration: 0,
        },
        open: true,
      },
    ];

    for (let i = 1; i < cantidadDePasos; i++) {
      potatoStates.push({
        disabled: true,
        hidden: false,
        answer: false,
        value: {
          ans: "",
          att: 0,
          hints: 0,
          lasthint: false,
          fail: false,
          duration: 0,
        },
        open: true,
      });
    }

    const initializeExercise = () => {
      reset();
      MQProxy.startDate = Date.now();
      MQProxy.content = steps.code;
      MQProxy.topicId = topicId;
      action({
        verbName: "loadContent",
        contentID: steps?.code,
        topicID: topicId,
      });
      setTest(potatoStates);
      setResumen(true);
    };

    initializeExercise();
  }, [topicId, steps.code]);

  useEffect(() => {
    if (mqSnap.submit) {
      if (!mqSnap.submitValues.fail) {
        currentStep.current = mqSnap.defaultIndex[1]!;
        let currentStepValue = test;
        let duration = (MQProxy.endDate - MQProxy.startDate) / 1000;
        let sv = MQProxy.submitValues;
        sv.duration = duration;
        MQProxy.startDate = Date.now();
        currentStepValue[mqSnap.defaultIndex[0]] = {
          disabled: false,
          hidden: false,
          answer: true,
          value: sv,
          open: false,
        };
        if (mqSnap.defaultIndex[1]! < stepsCount) {
          currentStepValue[mqSnap.defaultIndex[1]] = {
            disabled: false,
            hidden: false,
            answer: false,
            value: {
              ans: "",
              att: 0,
              hints: 0,
              lasthint: false,
              fail: false,
              duration: 0,
            },
            open: true,
          };
        } else {
          let completecontent: Array<value> = [];
          for (let i = 0; i < test.length; i++) {
            const value = currentStepValue[i];
            if (!value) continue;
            completecontent.push(value.value);
          }
          let extra = {
            steps: Object.assign({}, completecontent),
          };
          action({
            verbName: "completeContent",
            result: 1,
            contentID: steps?.code,
            topicID: topicId,
            extra: extra,
          });
          setResumen(false);
        }
        setTest(currentStepValue);
      }
      MQProxy.submit = false;
    }
  }, [mqSnap.submit, stepsCount]);

  let initialExp = steps.initialExpression ? steps.initialExpression : steps.steps[0]?.expression;

  return (
    <Flex key={steps.code} alignItems="center" justifyContent="center" margin={"auto"}>
      <Flex
        direction="column"
        p={1}
        rounded={6}
        w="100%"
        maxW="3xl"
        alignItems="center"
        justifyContent="center"
        margin={"auto"}
      >
        <Header title={steps.title} subtitle={steps.text} img={steps?.img} mathExp={initialExp} />

        <Accordion.Root
          variant={"plain"}
          mt={"1rem"}
          multiple
          collapsible
          value={Array.isArray(MQProxy.defaultIndex) ? MQProxy.defaultIndex.map(String) : []}
          onValueChange={({ value }) => {
            MQProxy.defaultIndex = (value ?? []).map(v => Number(v));
          }}
        >
          {steps.steps.map((step, i) => (
            <CustomAccordionItem
              key={`AccordionItem-${i}`}
              index={i}
              step={step}
              test={test}
              stepsCode={steps.code}
              topicId={topicId}
              action={action}
              setTest={setTest}
            />
          ))}
        </Accordion.Root>
        <Box>
          <Alert.Root status="info" hidden={resumen} alignItems="flex-start">
            <Alert.Indicator />
            <Alert.Content>
              <Summary initialExp={initialExp} steps={steps} resumen={resumen} />
            </Alert.Content>
          </Alert.Root>
        </Box>
        {!resumen && <RatingQuestion />}
      </Flex>
    </Flex>
  );
};

export default memo(Solver2);