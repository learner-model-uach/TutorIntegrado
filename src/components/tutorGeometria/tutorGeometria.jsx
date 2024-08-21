/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Summary } from "./tools/Summary";
import { Conclusion } from "./tools/Conclusion";
import { MathComponent } from "../MathJax";
import Hint from "../Hint";
import { useAction } from "../../utils/action";
import jsonAP from "./json/jsonAP.json";
import jsonAPmultiple from "./json/jsonAPmultiple.json";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Alert,
  AlertIcon,
  Wrap,
  WrapItem,
  Heading,
  Center,
  Spacer,
  Button,
  Image,
  Input,
  RadioGroup,
  Stack,
  Radio,
  Text,
} from "@chakra-ui/react";
import RatingQuestion from "../RatingQuestion";

export const GEO = ({ exercise, topicId }) => {
  let kc = {
    AreaC: "Conocimiento del área del círculo",
    PerC: "Conocimiento del perímetro del círculo",
    AreaT: "Conocimiento del área del triángulo",
    PerT: "Conocimiento del perímetro del triángulo",
    AreaR: "Conocimiento del área del rectángulo",
    PerR: "Conocimiento del perímetro del rectángulo",
    PlanTh: "Plantear teorema de Thales",
    CatHip: "Conocimiento Catetos e Hipotenusa",
    AN: "Aritmética de números",
    AD: "Asociar Datos",
    DespVarEcu: "Despejar variable en ecuación",
  };
  const action = useAction();
  const content = exercise.code;
  const steps = exercise.steps;
  const [index, setIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [select, setSelect] = useState([0]);
  const [stepValid, setStepValid] = useState([]);
  const [conclusion, setConclusion] = useState(false);
  const [extras, setExtras] = useState({ steps: {} });

  useEffect(() => {
    setConclusion(false);
    if (currentStep == -1) {
      setConclusion(true);
    }
  }, [currentStep]);

  useEffect(() => {
    if (conclusion) {
      action({
        verbName: "completeContent",
        contentID: content,
        topicID: topicId,
        result: 1,
        extra: extras,
      });
    }
  }, [conclusion]);

  return (
    <>
      <Heading as="h1" size="lg" noOfLines={3}>
        {exercise.title}
      </Heading>
      {exercise.text && (
        <Heading as="h5" size="sm" mt={2}>
          {exercise.text}
        </Heading>
      )}

      <Wrap
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        {exercise.image && <Image src={exercise.image} style={{ width: 300, height: 300 }} />}
      </Wrap>

      <Accordion allowToggle allowMultiple index={index} style={{ padding: 0, marginBottom: 20 }}>
        {steps.map((step, stepIndex) => (
          <AccordionItem
            isDisabled={select.includes(step.stepId) ? false : true}
            isFocusable={true}
          >
            <Alert
              colorScheme={
                stepValid.includes(step.stepId)
                  ? "green"
                  : currentStep == step.stepId
                  ? "blue"
                  : "gray"
              }
            >
              <AccordionButton
                onClick={e => {
                  setIndex(stepIndex);
                }}
              >
                <Box flex="1" textAlign="left">
                  <Wrap>
                    <Center>
                      <Wrap>
                        {step.stepTitle.concat(stepValid.includes(step.stepId) ? " ✔" : "")}
                      </Wrap>
                    </Center>
                    <Box mt={2}>
                      <Text fontSize="sm" color="gray.600">
                        KCs: {step.KCs.map(kcKey => kc[kcKey]).join("; ")}
                      </Text>
                    </Box>
                  </Wrap>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Alert>
            <AccordionPanel style={{ padding: 0 }}>
              {exercise.exerciseType == "steps" ? (
                <StepGeometria
                  step={step}
                  stepValid={stepValid}
                  setStepValid={setStepValid}
                  setCurrentStep={setCurrentStep}
                  currentStep={currentStep}
                  setIndex={setIndex}
                  index={index}
                  select={select}
                  setSelect={setSelect}
                  topicId={topicId}
                  contentId={content}
                  extras={extras}
                  setExtras={setExtras}
                />
              ) : (
                <SeleccionGeometria
                  step={step}
                  stepValid={stepValid}
                  setStepValid={setStepValid}
                  setCurrentStep={setCurrentStep}
                  currentStep={currentStep}
                  setIndex={setIndex}
                  index={index}
                  select={select}
                  setSelect={setSelect}
                  topicId={topicId}
                  contentId={content}
                  extras={extras}
                  setExtras={setExtras}
                />
              )}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      {conclusion && (
        <>
          <Conclusion expression={exercise.conclusion} style={{ marginTop: 10 }} />
          <Summary expression={exercise.text} steps={exercise.steps} />
          <RatingQuestion />
        </>
      )}
    </>
  );
};

export default GEO;

const StepGeometria = ({
  step,
  stepValid,
  setStepValid,
  setCurrentStep,
  currentStep,
  setIndex,
  index,
  select,
  setSelect,
  topicId,
  contentId,
  extras,
  setExtras,
}) => {
  const responseRefs = step.inputs.map(input => (input === "input" ? useRef(null) : null));
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [error, setError] = useState(false);
  const [lastHint, setLastHint] = useState(false);
  const dateInitial = Date.now();
  const action = useAction();
  const [response, setResponse] = useState([]);
  const [hints, setHints] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (attempts != 0 && extras.steps[step.stepId]) {
      setExtras(prevExtras => {
        const newExtras = JSON.parse(JSON.stringify(prevExtras));
        newExtras.steps[step.stepId].att = attempts;
        action({
          verbName: "tryStep",
          stepID: "" + step.stepId,
          contentID: contentId,
          topicID: topicId,
          result: stepValid.includes(step.stepId) ? 1 : 0,
          kcsIDs: step.KCs,
          extra: {
            response: response,
            attempts: attempts,
            hints: hints,
          },
        });
        return newExtras;
      });
    }
  }, [attempts]);
  const compare = () => {
    setAttempts(prevAttempts => prevAttempts + 1);
    const inputValues = [];
    responseRefs.map(ref => {
      if (ref && ref.current) inputValues.push(ref.current.value);
    });
    setResponse(inputValues);
    const isCorrect = step.answers.some(answerCombo =>
      answerCombo.answer.every((ans, index) => ans === inputValues[index]),
    );
    if (isCorrect) {
      setExtras(prevExtras => {
        const newExtras = JSON.parse(JSON.stringify(prevExtras));
        const prevAttempts = newExtras.steps[currentStep]?.att || 0;
        newExtras.steps[currentStep] = {
          hints: hints,
          lastHint: lastHint,
          duration: (Date.now() - dateInitial) / 1000,
        };

        return newExtras;
      });
      setStepValid(prevStepValid => [...prevStepValid, step.stepId]);
      setSelect(prevSelect => [...prevSelect, step.stepId]);
      setSelect(prevSelect => [...prevSelect, step.answers[0].nextStep]);
      setCurrentStep(step.answers[0].nextStep);
      setIndex(step.answers[0].nextStep);
    } else {
      setError(true);
      setFeedbackMsg(
        <Alert status="error">
          <AlertIcon />
          {step.incorrectMsg}
        </Alert>,
      );
    }
  };

  return (
    <>
      <Wrap padding="15px 10px 10px 10px">
        <WrapItem padding="5px 0px 10px 0px">
          <Center>{step.expression}</Center>
        </WrapItem>

        <Spacer />

        <WrapItem>
          <Center>
            {step.inputs.map((input, inputIndex) =>
              input === "input" ? (
                <Input
                  key={inputIndex}
                  ref={responseRefs[inputIndex]}
                  style={{
                    textAlign: "center",
                    fontStyle: "italic",
                    fontWeight: "6000",
                  }}
                  size="sm"
                  w={100}
                  focusBorderColor="#9DECF9"
                  isReadOnly={stepValid.includes(step.stepId)}
                />
              ) : (
                input
              ),
            )}
          </Center>
        </WrapItem>

        <Spacer />
        <WrapItem>
          {!stepValid.includes(step.stepId) && (
            <>
              <Button
                colorScheme="cyan"
                variant="outline"
                onClick={() => {
                  compare();
                  action({
                    verbName: "tryStep",
                    stepID: "" + step.stepId,
                    contentID: contentId,
                    topicID: topicId,
                    result: stepValid.includes(step.stepId) ? 1 : 0,
                    kcsIDs: step.KCs,
                    extra: {
                      response: response,
                      attempts: attempts,
                      hints: hints,
                    },
                  });
                }}
                size="sm"
              >
                Aceptar
              </Button>
              &nbsp;&nbsp;
              <Hint
                hints={step.hints}
                contentId={contentId}
                topicId={topicId}
                stepId={step.stepId}
                matchingError={step.matchingError}
                response={response}
                error={error}
                setError={setError}
                hintCount={hints}
                setHints={setHints}
                setLastHint={setLastHint}
              ></Hint>
            </>
          )}
        </WrapItem>
      </Wrap>
      {!stepValid.includes(step.stepId) && feedbackMsg}
    </>
  );
};

const SeleccionGeometria = ({
  step,
  stepValid,
  setStepValid,
  setCurrentStep,
  currentStep,
  setIndex,
  index,
  select,
  setSelect,
  topicId,
  contentId,
  extras,
  setExtras,
}) => {
  const action = useAction();
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [error, setError] = useState(false);
  const [lastHint, setLastHint] = useState(false);
  const dateInitial = Date.now();
  const [response, setResponse] = useState([]);
  const [hints, setHints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  console.log("topicId", topicId, "contentId", contentId);
  const compare = () => {
    const isCorrect = step.answers[value - 1]?.correct == 1;
    setAttempts(prevAttempts => prevAttempts + 1);
    setResponse(step.answers[value - 1]?.answer || []);
    if (isCorrect) {
      setExtras(prevExtras => {
        const newExtras = JSON.parse(JSON.stringify(prevExtras));
        const prevAttempts = newExtras.steps[currentStep]?.att || 0;
        newExtras.steps[currentStep] = {
          hints: hints,
          lastHint: lastHint,
          duration: (Date.now() - dateInitial) / 1000,
        };

        return newExtras;
      });
      setStepValid(prevStepValid => [...prevStepValid, step.stepId]);
      setSelect(prevSelect => [...prevSelect, step.stepId]);
      setSelect(prevSelect => [...prevSelect, step.answers[0].nextStep]);
      setCurrentStep(step.answers[0].nextStep);
      setIndex(step.answers[0].nextStep);
    } else {
      setError(true);
      setFeedbackMsg(
        <Alert status="error">
          <AlertIcon />
          {step.incorrectMsg}
        </Alert>,
      );
    }
  };
  const [value, setValue] = useState(null);
  const handleRadioChange = event => {
    setValue(parseInt(event, 10));
  };
  useEffect(() => {
    if (attempts != 0) {
      action({
        verbName: "tryStep",
        stepID: "" + step.stepId,
        contentID: contentId,
        topicID: topicId,
        result: stepValid.includes(step.stepId) ? 1 : 0,
        kcsIDs: step.KCs,
        extra: {
          response: response,
          attempts: attempts,
          hints: hints,
        },
      });
      if (extras.steps[step.stepId]) {
        setExtras(prevExtras => {
          const newExtras = JSON.parse(JSON.stringify(prevExtras));
          newExtras.steps[step.stepId].att = attempts;
          return newExtras;
        });
      }
    }
  }, [attempts]);
  return (
    <>
      <Wrap padding="15px 10px 10px 10px">
        <WrapItem padding="5px 0px 10px 0px" width="20%">
          <Center>
            <RadioGroup onChange={handleRadioChange} value={value}>
              <Stack direction="column">
                {step.answers.map((ans, i) => (
                  <Radio key={i} value={i + 1} correct={ans.correct}>
                    {ans.answer}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </Center>
        </WrapItem>
        <WrapItem width="100%">
          {!stepValid.includes(step.stepId) && (
            <Center>
              <Button
                colorScheme="cyan"
                variant="outline"
                onClick={() => {
                  compare();
                }}
                size="sm"
              >
                Aceptar
              </Button>
              &nbsp;&nbsp;
              <Hint
                hints={step.hints}
                contentId={contentId}
                topicId={topicId}
                stepId={step.stepId}
                matchingError={step.matchingError}
                response={response}
                error={error}
                setError={setError}
                hintCount={hints}
                setHints={setHints}
                setLastHint={setLastHint}
              ></Hint>
            </Center>
          )}
        </WrapItem>
      </Wrap>
      {!stepValid.includes(step.stepId) && feedbackMsg}
    </>
  );
};
