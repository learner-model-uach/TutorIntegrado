import {
  Alert,
  AlertIcon,
  Button,
  Stack,
  Box,
  HStack,
  VStack,
  StyledStepper,
} from "@chakra-ui/react";
import { useState, useCallback, memo, useEffect, useRef } from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import { MathComponent } from "./MathJax";
//se importa el componente hint desarrollado por Miguel Nahuelpan
import Hint from "./tutorGeometria/tools/Hint";
import MQPostfixSolver from "../utils/MQPostfixSolver";
import MQPostfixparser from "../components/tutorGeometria/tools/MQPostfixparser";
//reporte de acciones
//import { useAction } from "../../../utils/action";

addStyles();

const Mq2 = ({ step, setStepValid, stepValid, content, topicId }) => {
  //const action = useAction();

  let entero = parseInt(step.stepId);

  //Mq1
  const [latex, setLatex] = useState(" ");

  //inline style aprendido para componentes react en... https://codeburst.io/4-four-ways-to-style-react-components-ac6f323da822
  const EMFStyle = {
    width: "190px",
    maxHeight: "120px",
    marginBottom: "12px",
    border: "3px solid #73AD21",
    userSelect: "none",
  };
  const [placeholder, setPlaceholder] = useState(true);
  const correctAlternatives = step.answers.map(elemento => elemento.answer);
  const [ta, setTa] = useState();

  //hooks utilizados poara forzar el re-renderizado
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  //Inputsimple
  const [alerta, setAlerta] = useState("success");
  const [alertaMSG, setAlertaMSG] = useState("");
  const [alertaVisibility, setAlertaVisibility] = useState(true);

  //hooks de miguel definido para los hints
  const [error, setError] = useState(false); //true when the student enters an incorrect answers
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [lastHint, setLastHint] = useState(false);

  const result = useRef(false);

  //la siguiente funcion maneja la respuesta ingresada, la respuesta se compara con el valor correspondiente almacenado en el ejercicio.json
  //Ademas, se manejan los componentes de alerta utilizado en el componente padre(solver2) y el componente hijo(Mq2)
  //finalmente, se maneja la activacion del siguiente paso o resumen en caso de que la respuesta ingresada es correcta
  const handleAnswer = () => {
    let correctAnswer = false;
    let parse2 = MQPostfixparser(latex);
    parse2 = parse2.replace(" \\cdot", "");
    //console.log(parse2);
    for (let i in correctAlternatives) {
      if (correctAlternatives[i].replaceAll(" ", "").trim() == parse2.replaceAll(" ", "").trim())
        correctAnswer = true;
    }
    if (correctAnswer) {
      result.current = true;
      setAlerta("success");
      setAlertaMSG("Has ingresado la expresion correctamente!.");
      setAlertaVisibility(false);
      setError(false);
      setStepValid((stepValid = step.answers[0].nextStep));
    } else {
      result.current = false;
      setAlerta("error");
      setAlertaMSG("La expresion ingresada no es correcta.");
      setAlertaVisibility(false);
      setError(true);
    }
    /*action({
            verbName: "tryStep",
            stepID: "" + step.stepId,
            contentID: content,
            topicID: topicId,
            result: result.current? 1 : 0,
            kcsIDs: step.KCs,
            extra: {
              response: [
                latex
              ],
              attempts: attempts,
              hints: hints,
            }
          });*/
    setAttempts(attempts + 1);
  };

  const refMQElement = mathquill => {
    if (ta == undefined) {
      setTa(() => {
        return mathquill;
      });
    }
  };

  const MQtools = (operation, action, label) => {
    if (ta != undefined) ta.cmd(operation);
  };

  const clear = () => {
    if (ta != undefined) setLatex("");
  };

  const enabledhint = () => {
    return (
      <Hint
        hints={step.hints}
        contentId={content}
        topicId={topicId}
        stepId={step.stepId}
        matchingError={step.matchingError}
        response={[latex]}
        error={error}
        setError={setError}
        hintCount={hints}
        setHints={setHints}
        setLastHint={setLastHint}
      ></Hint>
    );
  };

  return (
    <>
      <VStack alignItems="center" justifyContent="center" margin={"auto"}>
        <Box>
          <MathComponent tex={step.expression} display={true} />
        </Box>
        <Box>
          <Stack spacing={4} direction="row" align="center" pb={4}>
            {/*importante la distincion de onMouseDown vs onClick, con el evento onMouseDown aun no se pierde el foco del input*/}
            <Button
              colorScheme="teal"
              onMouseDown={e => {
                e.preventDefault();
                MQtools("(", "MOUSEDOWN", "MOUSEDOWN");
              }}
            >
              {"("}
            </Button>
            <Button
              colorScheme="teal"
              onMouseDown={e => {
                e.preventDefault();
                MQtools(")", "MOUSEDOWN", "MOUSEDOWN");
              }}
            >
              {")"}
            </Button>
            <Button
              colorScheme="teal"
              onMouseDown={e => {
                e.preventDefault();
                MQtools("^", "MOUSEDOWN", "MOUSEDOWN");
              }}
            >
              ^
            </Button>
            <Button
              colorScheme="teal"
              onMouseDown={e => {
                e.preventDefault();
                MQtools("\\sqrt", "MOUSEDOWN", "MOUSEDOWN");
              }}
            >
              √
            </Button>
            <Button
              colorScheme="teal"
              onMouseDown={e => {
                e.preventDefault();
                MQtools("pi", "MOUSEDOWN", "MOUSEDOWN");
              }}
            >
              π
            </Button>
          </Stack>
          <Stack spacing={4} direction="row" align="center" pb={4}>
            {/*importante la distincion de onMouseDown vs onClick, con el evento onMouseDown aun no se pierde el foco del input,
                           Ademas con mousedown se puede usar preventDefault*/}
            <Button
              colorScheme="teal"
              onMouseDown={e => {
                e.preventDefault();
                MQtools("+", "MOUSEDOWN", "MOUSEDOWN");
              }}
            >
              +
            </Button>
            <Button
              colorScheme="teal"
              onMouseDown={e => {
                e.preventDefault();
                MQtools("-", "MOUSEDOWN", "MOUSEDOWN");
              }}
            >
              -
            </Button>
            <Button
              colorScheme="teal"
              onMouseDown={e => {
                e.preventDefault();
                MQtools("*", "MOUSEDOWN", "MOUSEDOWN");
              }}
            >
              *
            </Button>
            <Button
              colorScheme="teal"
              onMouseDown={e => {
                e.preventDefault();
                MQtools("\\frac", "MOUSEDOWN", "MOUSEDOWN");
              }}
            >
              /
            </Button>
            <Button
              colorScheme="teal"
              onMouseDown={e => {
                e.preventDefault();
                clear();
              }}
            >
              C
            </Button>
          </Stack>
          <HStack spacing="4px" alignItems="center" justifyContent="center" margin={"auto"}>
            <Button
              colorScheme="teal"
              onMouseDown={e => {
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
              onChange={mathField => {
                //if(placeholder){setLatex("\\text{Ingresa la expresion aqui}")}
                setLatex(() => mathField.latex());
                refMQElement(mathField);
              }}
              disabled={true}
            ></EditableMathField>
            <Button
              colorScheme="teal"
              onMouseDown={e => {
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
      <HStack spacing="4px" alignItems="center" justifyContent="center" margin={"auto"}>
        <Box>
          <Button
            colorScheme="teal"
            height={"32px"}
            width={"88px"}
            onClick={() => {
              handleAnswer();
            }}
          >
            Enviar
          </Button>
        </Box>
        {enabledhint()}
      </HStack>
      <Alert status={alerta} mt={2} hidden={alertaVisibility}>
        <AlertIcon />
        {alertaMSG}
      </Alert>
    </>
  );
};

export default memo(Mq2);
