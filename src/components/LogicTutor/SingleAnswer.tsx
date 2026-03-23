import React, { useState, useEffect } from "react";
import { Button, Stack, Alert, Center, Text, Box } from "@chakra-ui/react";
import type { ExLog } from "./Tools/ExcerciseType2";
import Hint from "../../components/Hint";
import dynamic from "next/dynamic";
import MQPostfixSolver from "../../utils/MQPostfixSolver";
import MQPostfixparser from "../../utils/MQPostfixparser";
import { convertirNotacion } from "./convertirNotacion";
import { useAction } from "../../utils/action";
import type { value } from "../../components/lvltutor/Tools/ExcerciseType";
import { FaRegKeyboard } from "react-icons/fa";

const Mathfield = dynamic(() => import("./Tools/mathLive"), { ssr: false });

const SinglePlaceholder = ({
  exc,
  nStep,
  setCompleted,
  topic,
}: {
  exc: ExLog;
  nStep: number;
  setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  topic: string;
}) => {
  const [latex, setLatex] = useState("");
  const [error, setError] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [isCorrectValue, setIsCorrectvalue] = useState(false);
  const [valueA, setValueA] = useState<string>("");
  const [hints, setHints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const action = useAction();
  const [_, setLastHint] = useState(false);

  interface values {
    values: Array<value>;
  }
  const evaluation: { input1: string; answer: values; values: Array<value> } = {
    input1: "",
    answer: { values: [] },
    values: [],
  };

  useEffect(() => {
    if (isCorrectValue) setCompleted(true);
  }, [isCorrectValue, setCompleted]);

  function evaluar(_: unknown, val: string) {
    if (typeof val !== "string" || val.trim() === "") {
      setFirstTime(false);
      setError(true);
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      action({
        verbName: "tryStep",
        stepID: "" + exc.steps[nStep].stepId,
        contentID: exc.code,
        topicID: topic,
        result: 0,
        kcsIDs: exc.steps[nStep].KCs,
        extra: {
          response: [valueA],
          attempts: nextAttempts,
          hints,
        },
      });
      return;
    }

    const c = MQPostfixSolver(MQPostfixparser(convertirNotacion(val)), evaluation.answer);
    setFirstTime(!firstTime);
    const answer = exc.steps[nStep].answers[0].answer;
    const a = MQPostfixparser(answer[0]);
    const b = MQPostfixSolver(a, evaluation.answer);

    let response = false;
    if (b === c) {
      setIsCorrectvalue(true);
      response = true;
      setError(false);
    } else {
      setError(true);
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    action({
      verbName: "tryStep",
      stepID: "" + exc.steps[nStep].stepId,
      contentID: exc.code,
      topicID: topic,
      result: response ? 1 : 0,
      kcsIDs: exc.steps[nStep].KCs,
      extra: {
        response: [valueA],
        attempts: nextAttempts,
        hints,
      },
    });
  }

  function modify(newLatex: string, prompsValues: any) {
    setLatex(newLatex);
    const a = prompsValues?.a;
    setValueA(Array.isArray(a) ? (a[0] ?? "") : (a ?? ""));
  }

  return (
    <>
      <Center>
        <Box
          maxW={{ base: "100%" }}
          p={2}
          // borderColor="red"
          borderWidth={1}
          borderRadius="lg"
          overflowX="auto"
          overflowY="hidden"
          alignItems="center"
        >
          <Text as="span" display="inline-flex"  gap="2" color={"text_exercises"}>
            Símbolos especiales en el teclado virtual{" "}
            {" "}
            <FaRegKeyboard  style={{ marginBottom: "4px" }} />
          </Text>
          <Mathfield
            readOnly
            value={`\\large ${exc.steps[nStep].expression} \\quad`}
            onChange={modify}
          />
        </Box>
      </Center>

      <Stack gap={4} m={2} direction="row" justifyContent="center">
        {!isCorrectValue && (
          <>
            <Button colorPalette="teal" h="2rem"  onClick={() => evaluar(latex, valueA)}>
              Enviar
            </Button>
            <Hint
              hints={exc.steps[nStep].hints}
              contentId={exc.code}
              topicId={topic}
              stepId={exc.steps[nStep].stepId}
              matchingError={exc.steps[nStep].matchingError}
              response={[latex]}
              error={error}
              setError={setError}
              hintCount={hints}
              setHints={setHints}
              setLastHint={setLastHint}
            />
          </>
        )}
      </Stack>

      {error && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{exc.steps[nStep].incorrectMsg}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      {isCorrectValue && (
        <Alert.Root status="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{exc.steps[nStep].correctMsg}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
    </>
  );
};

export default SinglePlaceholder;
