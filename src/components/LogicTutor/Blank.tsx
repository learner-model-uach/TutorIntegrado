import React from "react";
import { useState } from "react";
import { Box, Button, Stack, Input, Alert } from "@chakra-ui/react";
import type { ExLog } from "./Tools/ExcerciseType2";
import Hint from "../../components/Hint";
import { useAction } from "../../utils/action";

const Blank = ({
  exc,
  nStep,
  setCompleted,
  topic,
  isEditorMode = false, // ✅ nuevo prop
}: {
  exc: ExLog;
  nStep: number;
  setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  topic: string;
  isEditorMode?: boolean;
}) => {
  const _action = useAction();
  const action = isEditorMode ? () => {} : _action; // ✅ no-op en editor

  const [inputText, setInputText] = useState<string>("");
  const [isCorrectValue, setIsCorrectvalue] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [respuestas, setRespuestas] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [hints, setHints] = useState(0);
  const [_, setLastHint] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const evaluar = () => {
    let respuesta = false;
    setRespuestas(prevRespuestas => [...prevRespuestas, inputText]);
    setFirstTime(false);
    if (inputText === exc.steps[nStep].answers[0].answer[0]) {
      setIsCorrectvalue(true);
      respuesta = true;
      setCompleted(true);
    } else {
      setError(true);
    }
    setAttempts(attempts + 1);
    action({
      verbName: "tryStep",
      stepID: "" + exc.steps[nStep].stepId,
      contentID: exc.code,
      topicID: topic,
      result: respuesta ? 1 : 0,
      kcsIDs: exc.steps[nStep].KCs,
      extra: { response: [Response], attempts, hints },
    });
  };

  const handleButtonClick = (symbol: string) => setInputText(prevText => prevText + symbol);

  return (
    <>
      <Stack
        gap={4}
        m={2}
        direction={{ base: "column", sm: "row" }}
        align="center"
        justifyContent="center"
      >
        <Input
          htmlSize={4}
          w={{ base: "100%", sm: "auto" }}
          maxW={{ base: "100%", sm: "xs" }}
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
        />
        <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
          <Button bg="#3b82f6" size="sm" onClick={() => handleButtonClick("[")}>
            [{" "}
          </Button>
          <Button bg="#3b82f6" size="sm" onClick={() => handleButtonClick("]")}>
            ]
          </Button>
          <Button bg="#3b82f6" size="sm" onClick={() => handleButtonClick("∞")}>
            ∞
          </Button>
        </Box>
      </Stack>
      <Stack
        gap={4}
        m={2}
        direction={{ base: "column", sm: "row" }}
        align="center"
        justifyContent="center"
      >
        {isCorrectValue ? null : (
          <>
            <Button colorPalette="teal" h="2rem" onClick={() => evaluar()}>
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
            />
          </>
        )}
      </Stack>
      {firstTime ? null : !isCorrectValue ? (
        <Alert.Root status="error">
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
export default Blank;
