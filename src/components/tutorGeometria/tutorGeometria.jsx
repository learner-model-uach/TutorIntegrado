/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useRef } from "react";
import { Summary } from "./tools/Summary";
import { Conclusion } from "./tools/Conclusion";
import Hint from "../Hint";
import { useAction } from "../../utils/action";
import { Figura, tieneFigura } from "./figuras/Figura";
import {
  Accordion,
  Alert,
  Box,
  Button,
  Center,
  Heading,
  Image,
  Input,
  RadioGroup,
  Spacer,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import RatingQuestion from "../RatingQuestion";

const KC = {
  AreaC: "Conocimiento del área del círculo",
  PerC: "Conocimiento del perímetro del círculo",
  AreaT: "Conocimiento del área del triángulo",
  PerT: "Conocimiento del perímetro del triángulo",
  AreaR: "Conocimiento del área del rectángulo",
  PerR: "Conocimiento del perímetro del rectángulo",
  PlanTh: "Plantear teorema de Thales",
  PlanTH: "Plantear teorema de Thales",
  CatHip: "Conocimiento Catetos e Hipotenusa",
  AN: "Aritmética de números",
  AD: "Asociar Datos",
  DespVarEcu: "Despejar variable en ecuación",
  AA: "Resolver aritméticamente una expresión algebraica",
  ES: "Encontrar solución",
  DescSol: "Descartar solución por contexto",
  PropsRaiz: "Propiedades de la raíz",
  R3: "Regla de 3",
  NVeces: "Asociar expresión con la frase n veces",
  ExpA: "Expresar algebraicamente",
  IdeCoef: "Identificar coeficientes",
  AplFormRaices: "Calcular raíces",
};
const nombreKc = codigo => KC[codigo] ?? codigo;
const valorPaso = id => `paso-${id}`;

const MensajeError = ({ texto }) => (
  <Alert.Root status="error" mt={2}>
    <Alert.Indicator />
    <Alert.Content>
      <Alert.Title>{texto}</Alert.Title>
    </Alert.Content>
  </Alert.Root>
);

export const GEO = ({ exercise, topicId }) => {
  const action = useAction();
  const content = exercise.code;
  const steps = exercise.steps;
  const [abiertos, setAbiertos] = useState([valorPaso(steps[0]?.stepId ?? 0)]);
  const [currentStep, setCurrentStep] = useState(0);
  const [select, setSelect] = useState([0]);
  const [stepValid, setStepValid] = useState([]);
  const [conclusion, setConclusion] = useState(false);
  const [extras, setExtras] = useState({ steps: {} });

  // al resolver un paso se abre el siguiente
  const setIndex = siguiente => {
    if (siguiente != null && siguiente !== -1) setAbiertos([valorPaso(siguiente)]);
  };

  useEffect(() => {
    setConclusion(currentStep == -1);
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

  const propsPaso = step => ({
    step,
    stepValid,
    setStepValid,
    setCurrentStep,
    currentStep,
    setIndex,
    setSelect,
    topicId,
    contentId: content,
    extras,
    setExtras,
  });

  return (
    <>
      <Heading as="h1" size="2xl" lineClamp={3}>
        {exercise.title}
      </Heading>
      {exercise.text && (
        <Heading as="h5" size="md" mt={2}>
          {exercise.text}
        </Heading>
      )}

      <Center mt={5} mb={2}>
        {tieneFigura(exercise) ? (
          <Figura figura={exercise.figura} pasoActual={currentStep} resuelto={conclusion} />
        ) : (
          exercise.image && <Image src={exercise.image} w="300px" h="300px" />
        )}
      </Center>

      <Accordion.Root
        multiple
        collapsible
        value={abiertos}
        onValueChange={({ value }) => setAbiertos(value)}
        mb={5}
      >
        {steps.map(step => {
          const valido = stepValid.includes(step.stepId);
          const estado = valido ? "success" : currentStep == step.stepId ? "info" : "neutral";
          return (
            <Accordion.Item
              key={step.stepId}
              value={valorPaso(step.stepId)}
              disabled={!select.includes(step.stepId)}
            >
              <Alert.Root status={estado} p={0}>
                <Accordion.ItemTrigger px={4} py={3}>
                  <Box flex="1" textAlign="left">
                    <Text>{step.stepTitle + (valido ? " ✔" : "")}</Text>
                    <Text fontSize="sm" color="gray.600" mt={2}>
                      KCs: {step.KCs.map(nombreKc).join("; ")}
                    </Text>
                  </Box>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
              </Alert.Root>
              <Accordion.ItemContent p={0}>
                {exercise.exerciseType == "steps" ? (
                  <StepGeometria {...propsPaso(step)} />
                ) : (
                  <SeleccionGeometria {...propsPaso(step)} />
                )}
              </Accordion.ItemContent>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
      {conclusion && (
        <>
          <Conclusion expression={exercise.conclusion} />
          <Summary expression={exercise.text} steps={exercise.steps} />
          <RatingQuestion />
        </>
      )}
    </>
  );
};

export default GEO;

const BotonesPaso = ({
  onAceptar,
  step,
  contentId,
  topicId,
  response,
  error,
  setError,
  hints,
  setHints,
  setLastHint,
}) => (
  <>
    <Button colorPalette="cyan" variant="outline" size="sm" onClick={onAceptar}>
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
    />
  </>
);

// Estado y registro comunes a los dos formatos de paso
const usePaso = ({
  step,
  stepValid,
  setStepValid,
  setCurrentStep,
  currentStep,
  setIndex,
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
  const [inicio] = useState(Date.now());
  const [response, setResponse] = useState([]);
  const [hints, setHints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const valido = stepValid.includes(step.stepId);

  useEffect(() => {
    if (attempts == 0) return;
    action({
      verbName: "tryStep",
      stepID: "" + step.stepId,
      contentID: contentId,
      topicID: topicId,
      result: valido ? 1 : 0,
      kcsIDs: step.KCs,
      extra: { response, attempts, hints },
    });
    if (extras.steps[step.stepId]) {
      setExtras(prev => {
        const nuevo = JSON.parse(JSON.stringify(prev));
        nuevo.steps[step.stepId].att = attempts;
        return nuevo;
      });
    }
  }, [attempts]);

  const evaluar = (respuesta, correcta) => {
    setAttempts(prev => prev + 1);
    setResponse(respuesta);
    if (correcta) {
      setExtras(prev => {
        const nuevo = JSON.parse(JSON.stringify(prev));
        nuevo.steps[currentStep] = { hints, lastHint, duration: (Date.now() - inicio) / 1000 };
        return nuevo;
      });
      setStepValid(prev => [...prev, step.stepId]);
      setSelect(prev => [...prev, step.stepId, step.answers[0].nextStep]);
      setCurrentStep(step.answers[0].nextStep);
      setIndex(step.answers[0].nextStep);
    } else {
      setError(true);
      setFeedbackMsg(<MensajeError texto={step.incorrectMsg} />);
    }
  };

  const botones = {
    step,
    contentId,
    topicId,
    response,
    error,
    setError,
    hints,
    setHints,
    setLastHint,
  };
  return { valido, feedbackMsg, evaluar, botones };
};

const StepGeometria = props => {
  const { step } = props;
  const responseRefs = step.inputs.map(input => (input === "input" ? useRef(null) : null));
  const { valido, feedbackMsg, evaluar, botones } = usePaso(props);

  const aceptar = () => {
    const valores = responseRefs.filter(ref => ref && ref.current).map(ref => ref.current.value);
    const correcta = step.answers.some(combo => combo.answer.every((ans, i) => ans === valores[i]));
    evaluar(valores, correcta);
  };

  return (
    <>
      <Wrap p="15px 10px 10px 10px" align="center">
        <WrapItem p="5px 0px 10px 0px">
          <Center>{step.expression}</Center>
        </WrapItem>
        <Spacer />
        <WrapItem>
          <Center gap={1}>
            {step.inputs.map((input, i) =>
              input === "input" ? (
                <Input
                  key={i}
                  ref={responseRefs[i]}
                  textAlign="center"
                  fontStyle="italic"
                  size="sm"
                  w="100px"
                  readOnly={valido}
                />
              ) : (
                <span key={i}>{input}</span>
              ),
            )}
          </Center>
        </WrapItem>
        <Spacer />
        <WrapItem>{!valido && <BotonesPaso onAceptar={aceptar} {...botones} />}</WrapItem>
      </Wrap>
      {!valido && feedbackMsg}
    </>
  );
};

const SeleccionGeometria = props => {
  const { step } = props;
  const [value, setValue] = useState(null);
  const { valido, feedbackMsg, evaluar, botones } = usePaso(props);

  const aceptar = () => {
    const elegida = value ? step.answers[parseInt(value, 10) - 1] : undefined;
    evaluar(elegida?.answer || [], elegida?.correct == 1);
  };

  return (
    <>
      <Stack p="15px 10px 10px 10px" gap={4}>
        <RadioGroup.Root value={value} onValueChange={({ value }) => setValue(value)}>
          <Stack direction="column" gap={2}>
            {step.answers.map((ans, i) => (
              <RadioGroup.Item key={i} value={String(i + 1)} disabled={valido}>
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText>{ans.answer}</RadioGroup.ItemText>
              </RadioGroup.Item>
            ))}
          </Stack>
        </RadioGroup.Root>
        {!valido && (
          <Box>
            <BotonesPaso onAceptar={aceptar} {...botones} />
          </Box>
        )}
      </Stack>
      {!valido && feedbackMsg}
    </>
  );
};
