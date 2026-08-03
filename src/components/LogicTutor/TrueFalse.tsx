import React from "react";
import { useState } from "react";
import { Box, Button, Stack, Alert, Center } from "@chakra-ui/react";
import type { ExLog } from "./Tools/ExcerciseType2";
import Hint from "../../components/Hint";
import Latex from "react-latex-next";
import { useAction } from "../../utils/action";

const TrueFalse = ({
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
  const [isCorrectValue, setIsCorrectvalue] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [respuestas, setRespuestas] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const [_, setLastHint] = useState(0);
  //@ts-ignore
  let valor: number | string;
  if (exc && exc.steps && exc.steps[1] && exc.steps[1].values && exc.steps[1].values[0]) {
    valor = exc.steps[1].values[0].value;
    //{console.log("valor: "+valor)}
  }
  const evaluar = (Response: string) => {
    if (isCorrectValue) return;

    const nextAttempts = attempts + 1;

    setRespuestas(prevRespuestas => [...prevRespuestas, Response]);
    let respuesta = false;
    if (Response === exc.steps[nStep].answers[0].answer[0]) {
      setIsCorrectvalue(true);
      setCompleted(true);
      respuesta = true;
    } else {
      setError(true);
    }
    setFirstTime(false);
    setAttempts(nextAttempts);
    action({
      verbName: "tryStep",
      stepID: "" + exc.steps[nStep].stepId,
      contentID: exc.code,
      topicID: topic,
      result: respuesta ? 1 : 0,
      kcsIDs: exc.steps[nStep].KCs,
      extra: {
        response: [Response],
        attempts: nextAttempts,
        hints: hints,
      },
    });
  };
  //console.log(exc.steps[nStep].expression)
  return (
    <>
      <>
        <Box w="full" overflowX="auto">
          <Center minW="fit-content" mx="auto">
            <Latex>{"$$" + exc.steps[nStep].expression + "$$"}</Latex>
          </Center>
        </Box>
        {!isCorrectValue && (
          <Stack
            gap={4}
            m={2}
            direction={{ base: "column", sm: "row" }}
            align="center"
            justifyContent="center"
          >
            <Button colorPalette="teal" size="sm" onClick={() => evaluar("V")}>
              Verdadero
            </Button>
            <Button colorPalette="red" size="sm" onClick={() => evaluar("F")}>
              Falso
            </Button>
            <Hint
              hints={exc.steps[nStep].hints}
              contentId={exc.code}
              topicId={topic}
              stepId={exc.steps[nStep].stepId}
              matchingError={exc.steps[nStep].matchingError}
              response={respuestas}
              error={error}
              setError={setError}
              hintCount={hints}
              setHints={setHints}
              setLastHint={setLastHint}
            ></Hint>
          </Stack>
        )}
      </>
      {firstTime ? null : !isCorrectValue ? (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>
              Tu respuesta no es la esperada, inténtalo de nuevo.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ) : (
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

export default TrueFalse;
