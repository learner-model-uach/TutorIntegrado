import React, { useState, memo, useEffect, useRef } from "react";
import RatingQuestion from "../../RatingQuestion";
import { FaHandPointRight } from "react-icons/fa";

import {
  Flex,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Alert,
  Text,
  AlertIcon,
  HStack,
  VStack,
  Center,
  Image,
} from "@chakra-ui/react";

//la siguiente linea se utiliza para el wraper del componente Mq, el cual usa la libreria JS mathquill
import dynamic from "next/dynamic";

//reporte de acciones
import { useAction } from "../../../utils/action";

import type { ExType, Step } from "./ExcerciseType";

import { useSnapshot } from "valtio";
import MQProxy, { reset } from "./MQProxy";
//import MQStaticMathField from "../../../utils/MQStaticMathField";
import ShuffledLoad from "./CChoice";

const Mq2 = dynamic(
  () => {
    return import("./Mq2");
  },
  { ssr: false },
);

const MQStaticMathField = dynamic(() => import("../../../utils/MQStaticMathField"), {
  ssr: false,
  loading: () => <div>Loading math field...</div>,
});

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
    <Alert key={`Alert-${topicId}`} status={status} mt={mt}>
      <AlertIcon key={`AlertIcon-${topicId}`} />
      {mqMsg || fallbackMsg}
    </Alert>
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
            status={"success"}
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

export const Header = ({ title, subtitle, img, mathExp }) => (
  <>
    <Heading as="h1" size="lg" noOfLines={3}>
      {title}
    </Heading>

    <Heading as="h5" size="sm" mt={2}>
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
  steps,
  topicId,
  action,
  setTest,
  useActions = true,
}) => {
  const stepId = parseInt(step.stepId);
  const stepData = test[stepId] || {};

  const handleAccordionClick = () => {
    const newTest = [...test];
    const stepState = newTest[stepId];

    if (stepState) {
      if (useActions) {
        // Solo ejecuta actions si useActions es true
        const verbName = stepState.open ? "closeStep" : "openStep";
        action({
          verbName: verbName,
          stepID: String(index),
          contentID: steps?.code,
          topicID: topicId,
        });
      }

      stepState.open = !stepState.open;
      newTest[stepId] = stepState;
      setTest(newTest);
    }
  };

  return (
    <AccordionItem
      key={`AccordionItem${index}`}
      isDisabled={stepData.disabled}
      hidden={stepData.hidden}
    >
      <h2 key={`AIh2${index}`}>
        <Alert key={`AIAlert${index}`} status={stepData.answer ? "success" : "info"}>
          <AccordionButton key={`AIAccordionButton${index}`} onClick={handleAccordionClick}>
            <Box paddingRight={3}>
              <FaHandPointRight />
            </Box>
            <Box key={`AIBox${index}`} flex="1" textAlign="left">
              {step.stepTitle}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </Alert>
      </h2>
      <AccordionPanel key={`AIAccordionPanel${index}`} pb={4}>
        <Steporans
          step={step}
          topicId={topicId}
          content={steps.code}
          i={index}
          answer={stepData.value?.ans}
        />
      </AccordionPanel>
    </AccordionItem>
  );
};

const Summary = ({ initialExp, steps, showSummary }) => (
  <VStack w="100%" align="left">
    <Center>
      <Heading fontSize="xl">Resumen</Heading>
    </Center>
    <HStack>
      <Text>Expresión:</Text>
      <MQStaticMathField exp={initialExp || ""} currentExpIndex={!showSummary} />
    </HStack>
    {steps.steps.map((step, i) => (
      <SummaryStep
        key={`step-${i}`}
        summary={step.summary}
        displayResult={step.displayResult}
        currentExpIndex={!showSummary}
        stepIndex={i}
      />
    ))}
  </VStack>
);

export const SummaryStep = ({ summary, displayResult, currentExpIndex, stepIndex }) => (
  <Box key={"ResumenBox" + stepIndex}>
    <Text key={"ResumenText" + stepIndex} w="100%" justifyContent={"space-between"}>
      {summary}
    </Text>
    <Box key={"ResumenMCContainer" + stepIndex} display="flex" justifyContent="center">
      <MQStaticMathField
        key={"ResumenMC" + stepIndex}
        exp={displayResult[0]!}
        currentExpIndex={currentExpIndex}
      />
    </Box>
  </Box>
);

const Solver2 = ({ topicId, steps }: { topicId: string; steps: ExType }) => {
  const mqSnap = useSnapshot(MQProxy);

  const action = useAction();
  const currentStep = useRef(0);
  const [test, setTest] = useState<Array<potato>>([]); //(potatoStates);
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

        <Accordion
          onChange={algo => (MQProxy.defaultIndex = algo as Array<number>)}
          index={MQProxy.defaultIndex}
          allowToggle={true}
          allowMultiple={true}
        >
          {steps.steps.map((step, i) => (
            <CustomAccordionItem
              key={`AccordionItem-${i}`}
              index={i}
              step={step}
              test={test}
              steps={{ code: steps.code }}
              topicId={topicId}
              action={action}
              setTest={setTest}
              useActions={true}
            />
          ))}
        </Accordion>
        <Box>
          <Alert status="info" hidden={resumen} alignItems="top">
            <AlertIcon />
            <Summary initialExp={initialExp} steps={steps} showSummary={resumen} />
          </Alert>
        </Box>
        {!resumen && <RatingQuestion />}
      </Flex>
    </Flex>
  );
};

export default memo(Solver2);
