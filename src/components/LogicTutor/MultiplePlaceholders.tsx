import React, { useState, useEffect } from "react";
import { Button, Stack, Alert, Center, Box, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import MQPostfixSolver from "../../utils/MQPostfixSolver";
import MQPostfixparser from "../../utils/MQPostfixparser";
import Hint from "../../components/Hint";
import { convertirNotacion } from "./convertirNotacion";
import { useAction } from "../../utils/action";
import type { ExLog } from "./Tools/ExcerciseType2";
import type { value } from "../../components/lvltutor/Tools/ExcerciseType";
import { FaRegKeyboard } from "react-icons/fa";

const Mathfield = dynamic(() => import("./Tools/mathLive"), { ssr: false });

const MultiplePlaceholders = ({
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
  const action = useAction();
  const [isCorrectValue, setIsCorrectValue] = useState(false);
  const [ValuesArray, setValuesArray] = useState<Array<any>>([]);
  const [error, setError] = useState(false);
  const [hints, setHints] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [_, setLastHint] = useState(0);

  useEffect(() => {
    if (isCorrectValue) setCompleted(true);
  }, [isCorrectValue, setCompleted]);

  const evaluar = () => {
    setError(false);
    interface values {
      values: Array<value>;
    }

    const answer = exc.steps[nStep].answers[0].answer;
    let respuesta = false;
    const evaluation: { input1: string; answer: values; values: [] } = {
      input1: "",
      answer: { values: [] },
      values: [],
    };
    const hasAllValues =
      ValuesArray.length === answer.length &&
      ValuesArray.every(value => typeof value === "string" && value.trim() !== "");

    if (!hasAllValues) {
      setError(true);
      setAttempts(a => a + 1);
      action({
        verbName: "tryStep",
        stepID: "" + exc.steps[nStep].stepId,
        contentID: exc.code,
        topicID: topic,
        result: 0,
        kcsIDs: [...exc.steps[nStep].KCs],
        extra: {
          response: ValuesArray,
          attempts: attempts + 1,
          hints: hints,
        },
      });
      return;
    }

    if (exc.steps[nStep].validation === "evaluate") {
      if (
        ValuesArray.every(
          (value, index) =>
            MQPostfixSolver(MQPostfixparser(convertirNotacion(value)), evaluation.answer) ===
            MQPostfixSolver(MQPostfixparser(convertirNotacion(answer[index])), evaluation.answer),
        )
      ) {
        setIsCorrectValue(true);
        respuesta = true;
      } else {
        setError(true);
      }
    } else {
      if (ValuesArray.every((value, index) => value === answer[index])) {
        setIsCorrectValue(true);
        respuesta = true;
      } else {
        setError(true);
      }
    }

    setAttempts(a => a + 1);

    action({
      verbName: "tryStep",
      stepID: "" + exc.steps[nStep].stepId,
      contentID: exc.code,
      topicID: topic,
      result: respuesta ? 1 : 0,
      kcsIDs: [...exc.steps[nStep].KCs],
      extra: {
        response: ValuesArray,
        attempts: attempts + 1,
        hints: hints,
      },
    });
  };

  function test(_ignored, prompsValues) {
    const newValuesArray: string[] = [];
    for (const key in prompsValues) newValuesArray.push(prompsValues[key]);
    setValuesArray(newValuesArray);
  }

  return (
    <>
      <Center w="100%">
        <Box
          w="100%"
          maxW={{ base: "100%" }}
          p={2}
          // borderColor="red"
          borderWidth={1}
          borderRadius="lg"
          overflow="visible"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <Text
            as="span"
            display="inline-flex"
            gap="2"
            color={"text_exercises"}
            alignItems="center"
          >
            Símbolos especiales en el teclado virtual{" "}
            <FaRegKeyboard style={{ marginBottom: "4px" }} />
          </Text>
          <Box display="flex" justifyContent="center" w="100%">
            <Mathfield
              readOnly={true}
              value={`\\large ${exc.steps[nStep].expression}\\;`}
              onChange={test}
            />
          </Box>
        </Box>
      </Center>

      <Stack
        gap={4}
        m={2}
        direction={{ base: "column", sm: "row" }}
        align="center"
        justifyContent="center"
      >
        {!isCorrectValue && (
          <>
            {/* Button v3: usa colorPalette */}
            <Button colorPalette="teal" h="2rem" onClick={evaluar}>
              Enviar
            </Button>
            <Hint
              hints={exc.steps[nStep].hints}
              contentId={exc.code}
              topicId={topic}
              stepId={exc.steps[nStep].stepId}
              matchingError={exc.steps[nStep].matchingError}
              response={ValuesArray}
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

export default MultiplePlaceholders;
