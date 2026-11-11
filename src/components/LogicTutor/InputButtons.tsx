import React from "react";
import { useState } from "react";
import { Box, Button, Stack, Input, Alert } from "@chakra-ui/react";
import type { ExLog } from "./Tools/ExcerciseType2";
import Hint from "../../components/Hint";
import { useAction } from "../../utils/action";

const InputButtons = ({
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
  const [isCorrectValue, setIsCorrectvalue] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [inputText, setInputText] = useState<string>("");
  const [respuestas, setRespuestas] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [hints, setHints] = useState(0);
  const [_, setLastHint] = useState(0);
  const action = useAction();
  const [attempts, setAttempts] = useState(0);
  const evaluar = () => {
    if (isCorrectValue) return;

    const nextAttempts = attempts + 1;

    //console.log('Input:', inputText);
    let respuesta = false;
    //console.log('Respuesta esperada:', exc.steps[nStep].answers[0].answer[0]);
    setRespuestas(prevRespuestas => [...prevRespuestas, inputText]);
    setFirstTime(false);
    if (inputText === exc.steps[nStep].answers[0].answer[0]) {
      //console.log("Correcto");
      setIsCorrectvalue(true);
      setCompleted(true);
      respuesta = true;
    } else {
      setError(true);
    }
    setAttempts(nextAttempts);
    action({
      verbName: "tryStep",
      stepID: "" + exc.steps[nStep].stepId,
      contentID: exc.code,
      topicID: topic,
      result: respuesta ? 1 : 0,
      kcsIDs: exc.steps[nStep].KCs,
      extra: {
        response: [inputText],
        attempts: nextAttempts,
        hints: hints,
      },
    });
  };

  const handleButtonClick = (symbol: string) => {
    if (isCorrectValue) return;
    setInputText(prevText => prevText + symbol);
  };

  return (
    <>
      <Stack
        gap={4}
        m={2}
        direction={{ base: "column", sm: "row" }}
        align="center"
        justifyContent="center"
      >
        <span>&#123;</span>
        <Input
          htmlSize={4}
          size="sm"
          w={{ base: "100%", sm: "xs" }}
          maxW={{ base: "100%", sm: "xs" }}
          type="text"
          value={inputText}
          disabled={isCorrectValue}
          onChange={e => setInputText(e.target.value)}
        />
        <span>&#125;</span>
      </Stack>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        m={2}
        justifyContent="center"
        aria-disabled={isCorrectValue}
        pointerEvents={isCorrectValue ? "none" : "auto"}
        opacity={isCorrectValue ? 0.6 : 1}
      >
        <Button
          colorScheme="blue"
          size="sm"
          disabled={isCorrectValue}
          onClick={() => handleButtonClick("√")}
        >
          √
        </Button>
        <Button
          colorScheme="blue"
          size="sm"
          disabled={isCorrectValue}
          onClick={() => handleButtonClick("∈")}
        >
          ∈
        </Button>
        <Button
          colorScheme="blue"
          size="sm"
          disabled={isCorrectValue}
          onClick={() => handleButtonClick("ℂ")}
        >
          ℂ
        </Button>
        <Button
          colorScheme="blue"
          size="sm"
          disabled={isCorrectValue}
          onClick={() => handleButtonClick("ℤ")}
        >
          ℤ
        </Button>
        <Button
          colorScheme="blue"
          size="sm"
          disabled={isCorrectValue}
          onClick={() => handleButtonClick("ℝ")}
        >
          ℝ
        </Button>
        <Button
          colorScheme="blue"
          size="sm"
          disabled={isCorrectValue}
          onClick={() => handleButtonClick("ℕ")}
        >
          ℕ
        </Button>
        <Button
          colorScheme="blue"
          size="sm"
          disabled={isCorrectValue}
          onClick={() => handleButtonClick("∞")}
        >
          ∞
        </Button>
        <Button
          colorScheme="blue"
          size="sm"
          disabled={isCorrectValue}
          onClick={() => handleButtonClick("≤")}
        >
          ≤
        </Button>
        <Button
          colorScheme="blue"
          size="sm"
          disabled={isCorrectValue}
          onClick={() => handleButtonClick("≥")}
        >
          ≥
        </Button>
        <Button
          colorScheme="blue"
          size="sm"
          disabled={isCorrectValue}
          onClick={() => handleButtonClick("<")}
        >
          &lt;
        </Button>
        <Button
          colorScheme="blue"
          size="sm"
          disabled={isCorrectValue}
          onClick={() => handleButtonClick(">")}
        >
          &gt;
        </Button>
      </Box>
      {!isCorrectValue && (
        <Stack
          gap={4}
          m={2}
          direction={{ base: "column", sm: "row" }}
          align="center"
          justifyContent="center"
        >
          <Button colorScheme="teal" h="2rem" onClick={() => evaluar()}>
            Enviar
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

      {firstTime ? null : !isCorrectValue ? (
        <Alert.Root>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{exc.steps[nStep].incorrectMsg}</Alert.Description>
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

export default InputButtons;
