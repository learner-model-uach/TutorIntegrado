import React, { useState, useEffect } from "react";
import TeX from "@matejmazur/react-katex";
import { Flex, Button, Grid, Stack, Input, VStack, Text } from "@chakra-ui/react";
import { Hint } from "./Hint";
import {
  ACCORDION_COLOR,
  CORRECT_BUTTOM_NAME,
  CORRECT_ANSWER_COLOR,
  INCORRECT_ANSWER_COLOR,
} from "../types";
import { useAction } from "../../../utils/action";

export const StepInput = ({
  step, //content of "steps" field of the exercise
  setNumStep,
  nStep, //"nStep" field of the exercise
  setDisableState,
  totalSteps,
  setStepCorrect,
  setColor,
  setNextExercise,
  code, // "code" field of the exercise
  topicId, // "id" field in the system
  updateObjectSteps, // update the data in the "steps" field of the completeContent action
  completeContentSteps, // object used in the "steps" field of completeContent
}) => {
  const [answer, setAnswer] = useState("");
  const [firstTimeHint, setFirstTimeHint] = useState(true);
  const [idAnswer, setIdAnswer] = useState(-1); // id corresponding to the answer
  const [isCorrect, setIsCorrect] = useState(0);
  const [newHintAvaliable, setNewHintAvaliable] = useState(false); // hints that are displayed to the user
  const [attempts, setAttempts] = useState(0); // number of user attempts
  const [hintsShow, setHintsShow] = useState(0); // number of times a hint has been shown
  const [hints, setHints] = useState([]); // hints available according to the id of the user's response (both non-generic and generic)

  const startAction = useAction({});
  useEffect(() => {
    setColor(prev => [...prev.slice(0, nStep), ACCORDION_COLOR, ...prev.slice(nStep + 1)]);
  }, [step]);

  const onChange = e => {
    setAnswer(e.target.value);
  };

  // returns all hints that can be associated with the user's
  // response (both non-generic and generic).
  const getHints = answerId => {
    let hintsStep = step.hints;

    if (hintsStep != undefined) {
      let filterHint = hintsStep.filter(hint => {
        return hint.answers.includes(answerId);
      });
      if (filterHint != undefined) {
        filterHint = filterHint.concat(
          hintsStep.filter(hint => hint.generic && !filterHint.includes(hint)),
        );
      } else {
        filterHint = filterHint.concat(hintsStep.filter(hint => hint.generic));
      }
      return filterHint;
    }
    return null;
  };

  // gets the id of the user's response, if there is not then the id is set to 0,
  // this is so that if the user's response does not have a hint associated with it,
  // then a generic hint can be displayed.
  const getId = userAnswer => {
    userAnswer = userAnswer.replaceAll(" ", "");
    let answer = step.answers.filter(answer => answer.value === userAnswer.toString());
    if (answer !== undefined && answer.length > 0) {
      return answer[0].id;
    }
    if (userAnswer.length !== 0) {
      return 0;
    }
    return -1;
  };

  const checkLastStep = () => {
    if (nStep == totalSteps - 1) {
      // it is executed when all the steps are completed
      startAction({
        verbName: "completeContent",
        contentID: code, // it is "code" field of the exericse
        topicID: topicId, // it is "id" field in the system
        result: Number(isCorrect), // it is 1 if the response of the user's is correct and 0 if not
        extra: {
          steps: completeContentSteps, // object defined in updateObjectSteps
        },
      });
      setNextExercise(true);
    }
  };

  const checkAnswers = e => {
    e.preventDefault();

    let idUserAnswer = getId(answer);

    if (answer.length === 0) {
      return;
    } else {
      updateObjectSteps(step.stepId, attempts, hintsShow, 0);
      if (step.stepId === nStep.toString()) {
        if (idUserAnswer === step.correct_answer) {
          startAction({
            verbName: "tryStep",
            contentID: code,
            topicID: topicId,
            stepID: step.stepId,
            result: 1,
            kcsIDs: step.KCs,
            extra: {
              response: answer,
              attemps: attempts,
              hints: hintsShow,
            },
          });
          setStepCorrect(state => [...state, answer]);
          setColor(prev => [
            ...prev.slice(0, nStep),
            CORRECT_ANSWER_COLOR,
            ...prev.slice(nStep + 1),
          ]);
          setNumStep(prevState => prevState + 1);
          setDisableState(prevState => [...prevState, true]);
          setIsCorrect(true);
          checkLastStep();
          setFirstTimeHint(true);
        } else {
          setAttempts(prev => prev + 1);
          setIdAnswer(idUserAnswer);
          setHints(getHints(idUserAnswer));
          setFirstTimeHint(false);
          setNewHintAvaliable(true);
          startAction({
            verbName: "tryStep",
            contentID: code,
            topicID: topicId,
            stepID: step.stepId,
            result: 0,
            kcsIDs: step.KCs,
            extra: {
              response: answer,
              attemps: attempts,
              hints: hintsShow,
            },
          });
        }
      } else {
      }
    }
  };

  return (
    <Stack w="100%" maxW="100%" minW={0}>
      <Stack w="100%" maxW="100%" minW={0}>
        <VStack
          align="stretch"
          borderRadius="10px"
          p="10px"
          w="100%"
          maxW="100%"
          minW={0}
          overflow="hidden"
        >
          <Stack
            direction={{ base: "column", xl: "row" }}
            align={{ base: "stretch", xl: "center" }}
            justify="center"
            gap={{ base: 3, xl: 4 }}
            w="100%"
            maxW="100%"
            minW={0}
          >
            <Flex
              flex="1"
              minW={0}
              maxW="100%"
              align="center"
              justify={{ base: "center", xl: "flex-start" }}
              overflow="hidden"
            >
              <Text display={{ base: "none", xl: "block" }} margin={{ base: "auto" }}>
                {step.left_text}
              </Text>
              <Flex padding={{ base: "5px" }} flexShrink={0}>
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
              <Stack w={{ base: "min(100%, 180px)", xl: "100px" }} minW={0}>
                <Input type="text" value={answer} onChange={onChange} m="auto" maxW="100%" />
              </Stack>
            </Flex>

            <Grid
              templateColumns="repeat(2, minmax(0, 1fr))"
              gap={{ base: 2, sm: 3 }}
              w={{ base: "100%", xl: "auto" }}
              maxW={{ base: "320px", xl: "none" }}
              alignSelf="center"
            >
              <Button
                colorPalette="blue"
                onClick={checkAnswers}
                w={{ base: "100%", xl: "auto" }}
                minW={0}
                px={{ base: 3, sm: 4 }}
                whiteSpace="nowrap"
              >
                {CORRECT_BUTTOM_NAME}
              </Button>

              <Hint
                firstTimeHint={firstTimeHint}
                hints={hints}
                setNewHintAvaliable={setNewHintAvaliable}
                answerId={idAnswer}
                newHintAvaliable={newHintAvaliable}
                code={code}
                nStep={nStep}
                setHintsShow={setHintsShow}
              />
            </Grid>
          </Stack>
        </VStack>
      </Stack>
    </Stack>
  );
};
