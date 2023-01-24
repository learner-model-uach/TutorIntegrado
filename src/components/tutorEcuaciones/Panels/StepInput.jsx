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
  step, //content of "steps" field of json file
  setNumStep,
  nStep, //"nStep" field of json file
  setDisableState,
  totalSteps,
  setStepCorrect,
  setColor,
  setNextExercise,
  code, // "code" field of json file
  topicId // "id" field in the system
}) => {
  const exerciseContext = useContext(ExerciseContext);
  
  const [alert, setAlert] = useState({});
  const [answer, setAnswer] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [firstTimeHint, setFirstTimeHint] = useState(true);
  const [idAnswer, setIdAnswer] = useState(-1); // id corresponding to the answer
  const [isCorrect, setIsCorrect] = useState(0);
  const [newHintAvaliable, setNewHintAvaliable] = useState(false); // hints that are displayed to the user
  const [openAlert, setOpenAlert] = useState(false);
  const [attempts, setAttempts] = useState(0); // number of user attempts
  const [hintsShow, setHintsShow] = useState(0); // number of times a hint has been shown
  const [dataCompleteContent, setDataCompleteContent] = useState({}); // object used in the "steps" field for the completeContent action
  
  const startAction = useAction({});

  const onChange = (e) => {
    setAnswer(e.target.value);
  };
  
  // gets the id of the user's response, if there is not then the id is set to 0,
  // this is so that if the user's response does not have a hint associated with it,
  // then a generic hint can be displayed.
  const getId = (userAnswer) => {
    setIdAnswer(-1);
    userAnswer = userAnswer.replaceAll(" ", "");
    if (userAnswer.length ==! 0) {
      setIdAnswer(0);
    }
    step.answers.map((answer) => {
      if (answer.value === userAnswer) {
        setIdAnswer(answer.id);
      }
    })
  }

  const updateData = () => { // update the data in the "steps" field of the completeContent action
    let idObject = {};
    idObject[step.stepId] = { // create an object with key "id"
      att: attempts, // number of user attempts to response
      hints: hintsShow, // number of times the user saw a hint
      lastHint: false, // in this tutorial there is no last hint, since the hints change according to the error
      duration: 0
	}
    setDataCompleteContent((prev) => ({...prev, idObject}));
  }
  
  const checkLastStep = () => {
    if (nStep == totalSteps - 1) {
      startAction({
        verbName: "completeContent",
        contentID: code, // it is "code" field of the json file
        topicID: topicId, // it is "id" field in the system
        result: Number(isCorrect), // it is 1 if the response of the user's is correct and 0 if not
        extra: {
          steps: dataCompleteContent // object defined in updateData
        }
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
      updateData();
      if (step.stepId === nStep) {
        if (answer === step.correct_answer.toString()) {
          startAction({
            verbName: "tryStep",
            contentID: code,
            topicID: topicId,
            stepID: step.stepId,
            result: 1,
            kcsIDs: step.kcs,
            extra: {
              response: answer,
              attemps: attempts,
              hints: hintsShow
            },
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
          setAttempts((prev) => prev + 1);
          setAnswerInput(answer);
          setFirstTimeHint(false);
          setNewHintAvaliable(true);
          startAction({
            verbName: "tryStep",
            contentID: code,
            topicID: topicId,
            stepID: step.stepId,
            result: 0,
            kcsIDs: step.kcs,
            extra: {
              response: answer,
              attemps: attempts,
              hints: hintsShow
            },
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
                  answerId={idAnswer}
                  newHintAvaliable={newHintAvaliable}
                  code={code}
                  nStep={nStep}
                  setHintsShow={setHintsShow}
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
                      answerId={idAnswer}
                      newHintAvaliable={newHintAvaliable}
                      code={code}
                      nStep={nStep}
                      setHintsShow={setHintsShow}
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
