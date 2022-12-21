import React, { useState, useContext } from "react";
import TeX from "@matejmazur/react-katex";
import {
  Flex,
  Button,
  Grid,
  Stack,
  Input,
  VStack,
  Text,
} from "@chakra-ui/react";
import { Hint } from "./Hint";
import {
  CORRECT_BUTTOM_NAME,
  BACKGROUND_COLOR_PANEL,
  CORRECT_ANSWER_COLOR,
  INCORRECT_ANSWER_COLOR,
} from "../types";
import ExerciseContext from "../context/exercise/exerciseContext";
import { useAction } from "../../../utils/action";

export const StepInput = ({
  step,
  setNumStep,
  nStep,
  setDisableState,
  totalSteps,
  setStepCorrect,
  setColor,
  setNextExercise,
  content,
}) => {
  const [isCorrect, setIsCorrect] = useState(0);
  const [answer, setAnswer] = useState("");
  const [alert, setAlert] = useState({});
  const [openAlert, setOpenAlert] = useState(false);
  const exerciseContext = useContext(ExerciseContext);
  const [newHintAvaliable, setNewHintAvaliable] = useState(false);
  const [firstTimeHint, setFirstTimeHint] = useState(true);
  const [answerInput, setAnswerInput] = useState("");

  const startAction = useAction({});
  const onChange = (e) => {
    setAnswer(e.target.value);
  };

  const checkLastStep = () => {
    if (nStep == totalSteps - 1) {
      startAction({
        verbName: "completeContent",
        contentID: content,
        result: 1,
      });
      setNextExercise(true);
    }
  };

  const checkAnswers = (e) => {
    e.preventDefault();
    setOpenAlert(true);
    if (answer.length === 0) {
      setAlert({
        status: "info",
        text: "Escribe alguna respuesta",
      });
    } else {
      if (step.n_step === nStep) {
        if (answer === step.correct_answer.toString()) {
          startAction({
            verbName: "tryStep",
            contentID: content,
            result: 1,
            stepID: step.n_step,
            extra: { response: answer },
          });
          setStepCorrect((state) => [...state, answer]);
          setColor((prev) => [
            ...prev.slice(0, nStep),
            CORRECT_ANSWER_COLOR,
            ...prev.slice(nStep + 1),
          ]);
          setNumStep((prevState) => prevState + 1);
          setDisableState((prevState) => [...prevState, true]);

          setAlert({
            status: "success",
            text: "Respuesta Correcta",
          });
          setIsCorrect(true);
          checkLastStep();
        } else {
          setAnswerInput(answer);

          setFirstTimeHint(false);
          setNewHintAvaliable(true);
          startAction({
            verbName: "tryStep",
            contentID: content,
            result: 0,
            stepID: step.n_step,
            extra: { response: answer },
          });
          setColor((prev) => [
            ...prev.slice(0, nStep),
            INCORRECT_ANSWER_COLOR,
            ...prev.slice(nStep + 1),
          ]);
          setAlert({
            status: "error",
            text: "Respuesta Incorrecta",
          });
        }
      } else {
      }
    }
  };

  return (
    <Stack>
      <Stack>
        <VStack
          direction={["row", "column"]}
          style={{
            borderRadius: 10,
            backgroundColor: BACKGROUND_COLOR_PANEL,
            padding: 10,
            width: "100%",
          }}
        >
          <Stack direction={{ base: ["row", "column"], xl: ["column", "row"] }}>
            <Flex marginRight={{ xl: "250px" }} margin={{ base: "auto" }}>
              <Text
                display={{ base: "none", xl: "block" }}
                margin={{ base: "auto" }}
              >
                {step.left_text}
              </Text>
              <Flex padding={{ base: "5px" }}>
                {step.input_labels && (
                  <TeX
                    style={{
                      fontSize: "12px",
                      margin: "auto",
                    }}
                    math={step.input_labels}
                    as="figcaption"
                  />
                )}
              </Flex>
              <Stack style={{ width: "100px" }}>
                <Input
                  type="text"
                  value={answer}
                  onChange={onChange}
                  style={{
                    margin: "auto",
                  }}
                />
              </Stack>
            </Flex>

            <Stack marginLeft={{ base: "0px", xl: "-180px" }}>
              <Grid
                display={{ xl: "none", base: "grid" }}
                style={{ margin: "10px" }}
                templateColumns="repeat(2, 1fr)"
                gap={6}
              >
                <Button colorScheme="blue" onClick={checkAnswers}>
                  {CORRECT_BUTTOM_NAME}
                </Button>

                <Hint
                  firstTimeHint={firstTimeHint}
                  hints={step.hints}
                  setNewHintAvaliable={setNewHintAvaliable}
                  answerId={parseInt(answerInput)}
                  newHintAvaliable={newHintAvaliable}
                  content={content}
                  nStep={nStep}
                />
              </Grid>

              <Stack display={{ xl: "block", base: "none" }}>
                <Flex>
                  <div style={{ paddingRight: "5px" }}>
                    <Button colorScheme="blue" onClick={checkAnswers}>
                      {CORRECT_BUTTOM_NAME}
                    </Button>
                  </div>
                  <div style={{ paddingRight: "5px" }}>
                    <Hint
                      firstTimeHint={firstTimeHint}
                      hints={step.hints}
                      setNewHintAvaliable={setNewHintAvaliable}
                      answerId={parseInt(answerInput)}
                      newHintAvaliable={newHintAvaliable}
                      content={content}
                      nStep={nStep}
                    />
                  </div>
                </Flex>
              </Stack>
            </Stack>
          </Stack>
        </VStack>
      </Stack>
    </Stack>
  );
};
