import {
  Button,
  Stack,
  Box,
  HStack,
  VStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import {
  addStyles,
  EditableMathField,
  MathField,
  StaticMathField,
} from "react-mathquill";
//se importa el componente hint desarrollado por Miguel Nahuelpan
import Hint from "../Tools/Hint";
import MQPostfixSolver from "../../../utils/MQPostfixSolver";
import MQPostfixparser from "../../../utils/MQPostfixparser";
import MQPostfixstrict from "../../../utils/MQPostfixstrict";
//reporte de acciones
import { useAction } from "../../../utils/action";

import { useSnapshot } from "valtio";

import MQProxy from "./MQProxy";

import type { Step } from "./ExcerciseType";

addStyles();

const MQStatic = ({
  exp,
  currentStep,
}: {
  exp: string;
  currentStep: boolean;
}) => {
  const [texExp, setTexExp] = useState("");
  useEffect(() => {
    if (currentStep)
      setTimeout(() => {
        setTexExp(exp);
      }, 10);
  }, [exp, currentStep]);

  return <StaticMathField>{texExp}</StaticMathField>;
};

const Enabledhint = ({
  disablehint,
  step,
  latex,
}: {
  disablehint: boolean;
  step: Step;
  latex: string;
}) => {
  const mqSnap = useSnapshot(MQProxy);

  const [error, setError] = useState(false);
  const [hints, setHints] = useState(0);

  useEffect(() => {
    MQProxy.error = error;
  }, [error]);

  useEffect(() => {
    setError(mqSnap.error);
  }, [mqSnap.error]);

  useEffect(() => {
    MQProxy.hints = hints;
  }, [hints]);

  if (disablehint) {
    return <></>;
  } else {
    return (
      <Hint
        hints={step.hints}
        contentId={mqSnap.content}
        topicId={mqSnap.topicId}
        stepId={step.stepId}
        matchingError={step.matchingError}
        response={[latex]}
        error={error}
        setError={setError}
        hintCount={hints}
        setHints={setHints}
      ></Hint>
    );
  }
};
//inline style aprendido para componentes react en... https://codeburst.io/4-four-ways-to-style-react-components-ac6f323da822
const EMFStyle = {
  width: "190px",
  maxHeight: "120px",
  marginBottom: "12px",
  border: "3px solid #73AD21",
};

const Mq2 = ({
  step,
  content,
  topicId,
  disablehint,
}: {
  step: Step;
  content: string;
  topicId: string;
  disablehint: boolean;
}) => {
  const mqSnap = useSnapshot(MQProxy);
  const action = useAction();

  let entero = parseInt(step.stepId);

  //Mq1
  const [latex, setLatex] = useState(" ");
  const [placeholder, setPlaceholder] = useState(true);
  const [ta, setTa] = useState<MathField | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [alertType, setAlertType] = useState<
    "info" | "warning" | "success" | "error" | undefined
  >();
  const [alertMsg, setAlertMsg] = useState("");
  const [alertHidden, setAlertHidden] = useState(true);

  const result = useRef(false);

  //la siguiente funcion maneja la respuesta ingresada, la respuesta se compara con el valor correspondiente almacenado en el ejercicio.json
  //Ademas, se manejan los componentes de alerta utilizado en el componente padre(solver2) y el componente hijo(Mq2)
  //finalmente, se maneja la activacion del siguiente paso o resumen en caso de que la respuesta ingresada es correcta
  const handleAnswer = () => {
    let exp = step.answers[0]!.answer[0];
    let parse1 = MQPostfixparser(exp!);
    let parse2 = MQPostfixparser(latex);
    let answer1 = "";
    let answer2 = "";
    if (step.values != undefined) {
      answer1 = "" + MQPostfixSolver(parse1.substring(0), step.values);
      answer2 = "" + MQPostfixSolver(parse2.substring(0), step.values);
    } else {
      answer1 = "" + MQPostfixSolver(parse1.substring(0), [{}]);
      answer2 = "" + MQPostfixSolver(parse2.substring(0), step.values);
    }
    let relativeError = Math.abs(1 - parseFloat(answer1) / parseFloat(answer2));
    console.log(relativeError, parseInt(answer1), parseInt(answer2));
    //la validacion considera una precision con un 0.5% de error relativo
    if (relativeError < 0.005 && MQPostfixstrict(parse1, parse2)) {
      result.current = true;
      MQProxy.endDate = Date.now();
      MQProxy.deefaultIndex = [parseInt(step.stepId) + 1];
      MQProxy.submitValues = {
        ans: latex,
        att: attempts,
        hints: mqSnap.hints,
        lasthint: false,
        fail: false,
        duration: 0,
      };
      MQProxy.error = false;
    } else {
      result.current = false;
      setAlertType("error");
      setAlertMsg("La expresion ingresada no es correcta.");
      setAlertHidden(false);
      MQProxy.error = true;
      MQProxy.submitValues = {
        ans: latex,
        att: attempts,
        hints: mqSnap.hints,
        lasthint: false,
        fail: true,
        duration: 0,
      };
    }
    action({
      verbName: "tryStep",
      stepID: "" + step.stepId,
      contentID: content,
      topicID: topicId,
      result: result.current ? 1 : 0,
      kcsIDs: step.KCs,
      extra: {
        response: [latex],
        attempts: attempts,
        hints: mqSnap.hints,
      },
    });
    MQProxy.submit = true;
    setAttempts(attempts + 1);
  };

  const refMQElement = (mathquill: MathField) => {
    if (ta == undefined) {
      setTa(mathquill);
    }
  };

  const MQtools = (operation: string) => {
    if (ta != undefined) ta.cmd(operation);
  };

  const clear = () => {
    if (ta != undefined) setLatex("");
  };

  return (
    <>
      <VStack alignItems="center" justifyContent="center" margin={"auto"}>
        <MQStatic
          exp={step.expression}
          currentStep={
            parseInt(step.stepId) == mqSnap.deefaultIndex[0] ? true : false
          }
        />
        <Box>
          <Stack spacing={4} direction="row" align="center" pb={4}>
            {/*importante la distincion de onMouseDown vs onClick, con el evento onMouseDown aun no se pierde el foco del input*/}
            <Button
              colorScheme="teal"
              onMouseDown={(e) => {
                e.preventDefault();
                MQtools("(");
              }}
            >
              {"("}
            </Button>
            <Button
              colorScheme="teal"
              onMouseDown={(e) => {
                e.preventDefault();
                MQtools(")");
              }}
            >
              {")"}
            </Button>
            <Button
              colorScheme="teal"
              onMouseDown={(e) => {
                e.preventDefault();
                MQtools("^");
              }}
            >
              ^
            </Button>
            <Button
              colorScheme="teal"
              onMouseDown={(e) => {
                e.preventDefault();
                MQtools("\\sqrt");
              }}
            >
              √
            </Button>
          </Stack>
          <Stack spacing={4} direction="row" align="center" pb={4}>
            {/*importante la distincion de onMouseDown vs onClick, con el evento onMouseDown aun no se pierde el foco del input,
                           Ademas con mousedown se puede usar preventDefault*/}
            <Button
              colorScheme="teal"
              onMouseDown={(e) => {
                e.preventDefault();
                MQtools("+");
              }}
            >
              +
            </Button>
            <Button
              colorScheme="teal"
              onMouseDown={(e) => {
                e.preventDefault();
                MQtools("-");
              }}
            >
              -
            </Button>
            <Button
              colorScheme="teal"
              onMouseDown={(e) => {
                e.preventDefault();
                MQtools("*");
              }}
            >
              *
            </Button>
            <Button
              colorScheme="teal"
              onMouseDown={(e) => {
                e.preventDefault();
                MQtools("\\frac");
              }}
            >
              /
            </Button>
            <Button
              colorScheme="teal"
              onMouseDown={(e) => {
                e.preventDefault();
                clear();
              }}
            >
              C
            </Button>
          </Stack>
          <HStack
            spacing="4px"
            alignItems="center"
            justifyContent="center"
            margin={"auto"}
          >
            <Button
              colorScheme="teal"
              onMouseDown={(e) => {
                e.preventDefault();
                if (ta != undefined) ta.keystroke("Left");
              }}
              size="xs"
            >
              L
            </Button>
            <EditableMathField
              key={"EMF" + entero}
              latex={latex}
              style={EMFStyle}
              onMouseDown={() => {
                if (placeholder) {
                  setPlaceholder(false);
                  setLatex("");
                }
              }}
              onChange={(mathField) => {
                //if(placeholder){setLatex("\\text{Ingresa la expresion aqui}")}
                setLatex(() => mathField.latex());
                refMQElement(mathField);
              }}
            ></EditableMathField>
            <Button
              colorScheme="teal"
              onMouseDown={(e) => {
                e.preventDefault();
                if (ta != undefined) ta.keystroke("Right");
              }}
              size="xs"
            >
              R
            </Button>
          </HStack>
        </Box>
      </VStack>
      <HStack
        spacing="4px"
        alignItems="center"
        justifyContent="center"
        margin={"auto"}
      >
        <Box>
          <Button
            colorScheme="teal"
            height={"32px"}
            width={"88px"}
            onClick={() => {
              if (
                !(latex.localeCompare("") == 0 || latex.localeCompare(" ") == 0)
              )
                handleAnswer();
              else {
                setAlertType("error");
                setAlertMsg("Comienza por ingresar una expresion.");
                setAlertHidden(false);
              }
            }}
          >
            Enviar
          </Button>
        </Box>
        <Enabledhint disablehint={disablehint} step={step} latex={latex} />
      </HStack>
      <Alert
        key={"Alert" + topicId + "i"}
        status={alertType}
        mt={2}
        hidden={alertHidden}
      >
        <AlertIcon key={"AlertIcon" + topicId + "i"} />
        {"(" + attempts + ") " + alertMsg}
      </Alert>
    </>
  );
};

export default Mq2;
