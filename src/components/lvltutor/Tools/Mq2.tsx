import { Alert, Button, Stack, Box, HStack, VStack } from "@chakra-ui/react";
import { useState, memo, useEffect, useRef } from "react";
import { addStyles, EditableMathField, MathField } from "react-mathquill";
import Hint from "../../Hint";
import MQPostfixSolver from "../../../utils/MQPostfixSolver";
import MQPostfixparser from "../../../utils/MQPostfixparser";
import { useAction } from "../../../utils/action";
import type { Step, answer, value } from "./ExcerciseType";
import { useSnapshot } from "valtio";
import MQProxy from "./MQProxy";
import MQPostfixstrict from "../../../utils/MQPostfixstrict";
import MQStaticMathField from "../../../utils/MQStaticMathField";

addStyles();

const Enabledhint = ({
  disablehint, step, latex, setLastHint,
  isEditorMode = false, // ✅
}: {
  disablehint: boolean; step: Step; latex: string;
  setLastHint: (hint: boolean) => void;
  isEditorMode?: boolean;
}) => {
  const mqSnap = useSnapshot(MQProxy);
  const [error, setError] = useState(false);
  const [hints, setHints] = useState(0);

  useEffect(() => { if (!isEditorMode) MQProxy.error = error; }, [error]);
  useEffect(() => { setError(mqSnap.error); }, [mqSnap.error]);
  useEffect(() => { if (!isEditorMode) MQProxy.hints = hints; }, [hints]);

  if (disablehint) return <></>;
  return (
    <Hint hints={step.hints} contentId={mqSnap.content} topicId={mqSnap.topicId}
      stepId={step.stepId} matchingError={step.matchingError}
      response={[latex]} error={error} setError={setError}
      hintCount={hints} setHints={setHints} setLastHint={setLastHint} />
  );
};

const EMFStyle = {
  width: "190px", maxHeight: "120px", marginBottom: "12px",
  border: "3px solid #73AD21", overflow: "visible",
};

interface values { values: Array<value>; }

const evaluation = ({ input, answer, values }: { input: string; answer: answer; values: values }) => {
  let parseAns = MQPostfixparser(answer.answer[0]);
  let evaluation1 = MQPostfixSolver(input.substring(0), values);
  let evaluation2 = MQPostfixSolver(parseAns.substring(0), values);
  if (!MQProxy.finishedEval || isNaN(evaluation1)) return false;
  MQProxy.finishedEval = true;
  let correctAns = false;
  let y = parseFloat("" + evaluation1);
  let x = parseFloat("" + evaluation2);
  if (parseFloat("" + evaluation2) == 0) { x = x + 1; y = y + 1; }
  let relativeError = Math.abs(1 - y / x);
  if (relativeError < 0.005 && MQPostfixstrict(input, parseAns)) correctAns = true;
  return correctAns;
};

const Mq2 = ({
  step, content, topicId, disablehint,
  isEditorMode = false, // ✅ nuevo prop
}: {
  step: Step; content: string; topicId: string; disablehint: boolean;
  isEditorMode?: boolean;
}) => {
  const mqSnap = useSnapshot(MQProxy);
  const _action = useAction();
  const action = isEditorMode ? () => {} : _action; // ✅ no-op en editor

  let entero = parseInt(step.stepId);
  const [lastHint, setLastHint] = useState(false);
  const [latex, setLatex] = useState(" ");
  const [placeholder, setPlaceholder] = useState(true);
  const [ta, setTa] = useState<MathField | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [alertType, setAlertType] = useState<"info" | "warning" | "success" | "error" | undefined>();
  const [alertMsg, setAlertMsg] = useState("");
  const [alertHidden, setAlertHidden] = useState(true);
  const result = useRef(false);

  const handleAnswer = () => {
    let validationType = step.validation;
    let answers = step.answers;
    let correctAns = false;
    let parseInput = MQPostfixparser(latex);
    let values: values = { values: [] };
    if (step.values != undefined) values.values = step.values;

    if (validationType) {
      if (validationType.localeCompare("evaluate") == 0) {
        for (let i = 0; i < answers.length; i++) {
          let e = answers[i]; if (!e) continue;
          if (evaluation({ input: parseInput, answer: e, values })) correctAns = true;
        }
      } else if (validationType.localeCompare("countElements") == 0) {
        for (let i = 0; i < answers.length; i++) {
          let e = answers[i]; if (!e) continue;
          let parseAns = MQPostfixparser(e.answer[0]);
          if (MQPostfixstrict(parseInput, parseAns)) correctAns = true;
        }
      } else if (validationType.localeCompare("evaluateAndCount") == 0) {
        for (let i = 0; i < answers.length; i++) {
          let e = answers[i]; if (!e) continue;
          if (evaluation({ input: parseInput, answer: e, values })) correctAns = true;
        }
      } else {
        for (let i = 0; i < answers.length; i++) {
          let e = answers[i]; if (!e) continue;
          let parseAns = MQPostfixparser(e.answer[0]);
          if (parseInput.localeCompare(parseAns) == 0) correctAns = true;
        }
      }
    } else {
      for (let i = 0; i < answers.length; i++) {
        let e = answers[i]; if (!e) continue;
        let parseAns = MQPostfixparser(e.answer[0]);
        if (parseInput.localeCompare(parseAns) == 0) correctAns = true;
      }
    }

    if (correctAns) {
      result.current = true;
      if (!isEditorMode) { // ✅ solo actualiza MQProxy en modo estudiante
        MQProxy.endDate = Date.now();
        MQProxy.defaultIndex = [parseInt(step.stepId), parseInt(step.stepId) + 1];
        MQProxy.submitValues = { ans: latex, att: attempts, hints: mqSnap.hints, lasthint: lastHint, fail: false, duration: 0 };
        MQProxy.error = false;
      } else {
        setAlertType("success");
        setAlertMsg("¡Correcto! (modo editor — sin registrar)");
        setAlertHidden(false);
      }
    } else {
      result.current = false;
      setAlertType("error");
      setAlertMsg("La expresion ingresada no es correcta.");
      setAlertHidden(false);
      if (!isEditorMode) {
        MQProxy.error = true;
        MQProxy.submitValues = { ans: latex, att: attempts, hints: mqSnap.hints, lasthint: lastHint, fail: true, duration: 0 };
      }
    }
    action({ verbName: "tryStep", stepID: "" + step.stepId, contentID: content, topicID: topicId,
      result: result.current ? 1 : 0, kcsIDs: step.KCs,
      extra: { response: [latex], attempts, hints: mqSnap.hints } });
    if (!isEditorMode) MQProxy.submit = true;
    setAttempts(attempts + 1);
  };

  const refMQElement = (mathquill: MathField) => { if (ta == undefined) setTa(mathquill); };
  const MQtools = (operation: string) => { if (ta != undefined) ta.cmd(operation); };
  const clear = () => { if (ta != undefined) setLatex(""); };

  return (
    <>
      <VStack alignItems="center" justifyContent="center" margin={"auto"}>
        <MQStaticMathField exp={step.expression}
          currentExpIndex={parseInt(step.stepId) == mqSnap.defaultIndex[mqSnap.defaultIndex.length - 1] ? true : false} />
        <Box>
          <Stack gap={4} direction="row" align="center" pb={4}>
            {[["(","("], [")",")"], ["x^y","^"], ["\\sqrt{x}","\\sqrt"], ["\\sqrt[y]{x}","\\nthroot"]].map(([label, cmd]) => (
              <Button key={cmd} width="40px" height="40px" colorPalette="teal"
                onMouseDown={e => { e.preventDefault(); MQtools(cmd); }}>
                {cmd.startsWith("\\") ? <MQStaticMathField exp={label} currentExpIndex={false} /> : label}
              </Button>
            ))}
          </Stack>
          <Stack gap={4} direction="row" align="center" pb={4}>
            {[["+","+"], ["-","-"], ["*","*"], ["/","\\frac"], ["C","clear"]].map(([label, cmd]) => (
              <Button key={cmd} width="40px" height="40px" colorPalette="teal"
                onMouseDown={e => { e.preventDefault(); cmd === "clear" ? clear() : MQtools(cmd); }}>
                {label}
              </Button>
            ))}
          </Stack>
          <HStack gap="4px" alignItems="center" justifyContent="center" margin={"auto"}>
            <Button colorPalette="teal" onMouseDown={e => { e.preventDefault(); if (ta != undefined) ta.keystroke("Left"); }} size="xs">L</Button>
            <EditableMathField key={"EMF" + entero} latex={latex} style={EMFStyle}
              onMouseDown={() => { if (placeholder) { setPlaceholder(false); setLatex(""); } }}
              onChange={mathField => { setLatex(() => mathField.latex()); refMQElement(mathField); }} />
            <Button colorPalette="teal" onMouseDown={e => { e.preventDefault(); if (ta != undefined) ta.keystroke("Right"); }} size="xs">R</Button>
          </HStack>
        </Box>
      </VStack>
      <HStack gap="4px" alignItems="center" justifyContent="center" margin={"auto"}>
        <Box>
          <Button colorPalette="teal" height="32px" width="88px"
            onClick={() => {
              if (!(latex.localeCompare("") == 0 || latex.localeCompare(" ") == 0)) handleAnswer();
              else { setAlertType("error"); setAlertMsg("Comienza por ingresar una expresion."); setAlertHidden(false); }
            }}>
            Enviar
          </Button>
        </Box>
        <Enabledhint disablehint={disablehint} step={step} latex={latex} setLastHint={setLastHint} isEditorMode={isEditorMode} />
      </HStack>
      <Alert.Root key={"Alert" + topicId + "i"} status={alertType} mt={2} hidden={alertHidden}>
        <Alert.Indicator key={`AlertIcon${topicId}i`} />
        <Alert.Content>
          <Alert.Description>{"¡Inténtalo nuevamente! (intentos: " + attempts + ") " + alertMsg}</Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </>
  );
};
export default memo(Mq2);