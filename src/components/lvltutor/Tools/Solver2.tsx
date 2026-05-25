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
import MQStaticMathField from "../../../utils/MQStaticMathField";
import ShuffledLoad from "./CChoice";

const Mq2 = dynamic(
  () => {
    return import("./Mq2");
  },
  { ssr: false },
);

const SummaryText = ({ children }: { children: React.ReactNode }) => (
  <Text w="100%" maxW="100%" minW={0} lineHeight="1.6" overflowWrap="anywhere">
    {children}
  </Text>
);

const ScrollableMathField = ({
  exp,
  currentExpIndex,
}: {
  exp: string;
  currentExpIndex: boolean;
}) => (
  <Box w="100%" maxW="100%" minW={0} overflowX="auto" overflowY="hidden" py="1">
    <Box w="max-content" maxW="none" mx="auto">
      <MQStaticMathField exp={exp} currentExpIndex={currentExpIndex} />
    </Box>
  </Box>
);

interface value {
  ans: string;
  att: number;
  hints: number;
  lasthint: boolean;
  fail: boolean;
  duration: number;
}
interface potato {
  disabled: boolean;
  hidden: boolean;
  answer: boolean;
  value: value;
  open: boolean;
}

const Steporans = ({
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
          <Alert.Root key={"Alert" + topicId + "i"} status={"success"} mt={2}>
            <Alert.Indicator key={"AlertIcon" + topicId + "i"} />
            <Alert.Content>
              <Alert.Description>
                {MQProxy.spaghettimsg ? MQProxy.spaghettimsg : step.correctMsg}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
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

const Solver2 = ({ topicId, steps }: { topicId: string; steps: ExType }) => {
  const mqSnap = useSnapshot(MQProxy);

  const action = useAction();
  const currentStep = useRef(0);
  const [test, setTest] = useState<Array<potato>>([]); //(potatoStates);
  const [resumen, setResumen] = useState(true);
  const [stepsCount, setStepsCount] = useState(0);

  // const[steps, setSteps] = useState(initialSteps)
  /*steps: initialSteps
  useEffect(()=> {
    setSteps(initialSteps)
  },[initialSteps])*/

  /*
  const cantidadDePasos = steps.steps.length;

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
*/

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
    <Flex
      key={steps.code}
      alignItems="center"
      justifyContent="center"
      margin={"auto"}
      w="100%"
      maxW="100%"
      minW={0}
      overflowX="hidden"
    >
      <Flex
        direction="column"
        p={1}
        rounded={6}
        w="100%"
        maxW="3xl"
        minW={0}
        overflowX="hidden"
        alignItems="center"
        justifyContent="center"
        margin={"auto"}
      >
        <Heading as="h1" size="3xl" lineClamp={3} color={"heading"} mb={"1rem"}>
          {steps.title}
        </Heading>
        <Heading as="h5" size="md" mb={"0.5rem"}>
          {steps.text}
        </Heading>
        {steps.img ? (
          <Image src={`/img/${steps.img}`} w="md" paddingY={5} alt="Imagen del ejercicio" />
        ) : (
          <ScrollableMathField exp={initialExp || ""} currentExpIndex={true} />
        )}
        <Accordion.Root
          variant={"plain"}
          mt={"1rem"}
          w="100%"
          maxW="100%"
          minW={0}
          multiple
          collapsible
          value={Array.isArray(MQProxy.defaultIndex) ? MQProxy.defaultIndex.map(String) : []}
          onValueChange={({ value }) => {
            MQProxy.defaultIndex = (value ?? []).map(v => Number(v));
          }}
        >
          {steps.steps.map((step, i) => (
            <Accordion.Item
              key={`AccordionItem${i}`}
              value={String(step.stepId)}
              disabled={Boolean(test[parseInt(step.stepId)]?.disabled)}
              hidden={Boolean(test[parseInt(step.stepId)]?.hidden)}
            >
              <h2 key={"AIh2" + i}>
                <Alert.Root status={test[parseInt(step.stepId)]?.answer ? "success" : "info"}>
                  <Alert.Content>
                    <Accordion.ItemTrigger
                      onClick={() => {
                        const potstates = [...test];
                        const idx = parseInt(step.stepId);
                        const potstate = potstates[idx];
                        if (potstate) {
                          if (!potstate.open) {
                            action({
                              verbName: "openStep",
                              stepID: "" + i,
                              contentID: steps?.code,
                              topicID: topicId,
                            });
                            potstate.open = true;
                          } else {
                            action({
                              verbName: "closeStep",
                              stepID: "" + i,
                              contentID: steps?.code,
                              topicID: topicId,
                            });
                            potstate.open = false;
                          }
                          potstates[idx] = potstate;
                          setTest(potstates);
                        }
                      }}
                    >
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
                  {(() => {
                    const idx = Number(step.stepId);
                    const isOpen = (MQProxy.defaultIndex ?? []).includes(Number(step.stepId));
                    const isDone = Boolean(test[idx]?.answer);

                    return (
                      <>
                        {isOpen &&
                        !isDone &&
                        step.expression &&
                        step.multipleChoice != undefined ? (
                          <Center w="100%" maxW="100%" minW={0}>
                            <Box mb="3" w="100%" maxW="100%" minW={0} overflowX="auto">
                              <MQStaticMathField
                                key={`mq-enunciado-${step.stepId}-open`}
                                exp={step.expression}
                                currentExpIndex={true} // ahora sí, visible
                              />
                            </Box>
                          </Center>
                        ) : null}
                        <Steporans
                          key={`Steporans-${step.stepId}-${isOpen ? "open" : "closed"}`}
                          step={step}
                          topicId={topicId}
                          content={steps.code}
                          i={i}
                          answer={test[parseInt(step.stepId)]?.value?.ans}
                        />
                      </>
                    );
                  })()}
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
        <Box w="100%" maxW="100%" minW={0}>
          <Alert.Root
            status="info"
            hidden={resumen}
            alignItems="stretch"
            w="100%"
            maxW="100%"
            minW={0}
            overflow="hidden"
            px={{ base: "4", md: "5" }}
            py="4"
            className="lvltutor-summary"
          >
            <Alert.Content w="100%" maxW="100%" minW={0}>
              <VStack w="100%" maxW="100%" minW={0} align="stretch" gap="3">
                <Center w="100%">
                  <Heading fontSize="xl">Resumen</Heading>
                </Center>
                <Box w="100%" maxW="100%" minW={0}>
                  <Text>Expresión:</Text>
                  <ScrollableMathField exp={initialExp || ""} currentExpIndex={!resumen} />
                </Box>
                {steps.steps.map((step, i) => (
                  <Box key={"ResumenBox" + i} w="100%" maxW="100%" minW={0}>
                    <SummaryText key={"ResumenText" + i}>{step.summary}</SummaryText>
                    <Box key={"ResumenMCContainer" + i} w="100%" maxW="100%" minW={0}>
                      <ScrollableMathField
                        key={"ResumenMC" + i}
                        exp={step.displayResult[0]!}
                        currentExpIndex={!resumen}
                      />
                    </Box>
                  </Box>
                ))}
              </VStack>
            </Alert.Content>
          </Alert.Root>
        </Box>
        {!resumen && <RatingQuestion />}
      </Flex>
    </Flex>
  );
};

export default memo(Solver2);
