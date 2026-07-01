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
  step,
  setNumStep,
  nStep,
  setDisableState,
  totalSteps,
  setStepCorrect,
  setColor,
  setNextExercise,
  code,
  topicId,
  updateObjectSteps,
  completeContentSteps,
  isEditorMode = false, // ✅ nuevo prop
}) => {
  const _action = useAction();
  const startAction = isEditorMode ? () => {} : _action; // ✅ no-op en editor

  const [answer, setAnswer] = useState("");
  const [firstTimeHint, setFirstTimeHint] = useState(true);
  const [idAnswer, setIdAnswer] = useState(-1);
  const [isCorrect, setIsCorrect] = useState(0);
  const [newHintAvaliable, setNewHintAvaliable] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsShow, setHintsShow] = useState(0);
  const [hints, setHints] = useState([]);

  useEffect(() => {
    // ✅ En editor mode no llamamos setColor (puede ser undefined)
    if (!isEditorMode) {
      setColor(prev => [...prev.slice(0, nStep), ACCORDION_COLOR, ...prev.slice(nStep + 1)]);
    }
  }, [step]);

  const onChange = e => setAnswer(e.target.value);

  const getHints = answerId => {
    let hintsStep = step.hints;
    if (hintsStep != undefined) {
      let filterHint = hintsStep.filter(hint => hint.answers.includes(answerId));
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

  const getId = userAnswer => {
    userAnswer = userAnswer.replaceAll(" ", "");
    let answer = step.answers.filter(answer => answer.value === userAnswer.toString());
    if (answer !== undefined && answer.length > 0) return answer[0].id;
    if (userAnswer.length !== 0) return 0;
    return -1;
  };

  const checkLastStep = () => {
    if (nStep == totalSteps - 1) {
      startAction({
        verbName: "completeContent",
        contentID: code,
        topicID: topicId,
        result: Number(isCorrect),
        extra: { steps: completeContentSteps },
      });
      if (!isEditorMode) setNextExercise(true);
    }
  };

  const checkAnswers = e => {
    e.preventDefault();
    let idUserAnswer = getId(answer);
    if (answer.length === 0) return;
    if (!isEditorMode) updateObjectSteps(step.stepId, attempts, hintsShow, 0);
    if (step.stepId === nStep.toString()) {
      if (idUserAnswer === step.correct_answer) {
        startAction({
          verbName: "tryStep",
          contentID: code,
          topicID: topicId,
          stepID: step.stepId,
          result: 1,
          kcsIDs: step.KCs,
          extra: { response: answer, attemps: attempts, hints: hintsShow },
        });
        if (!isEditorMode) {
          setStepCorrect(state => [...state, answer]);
          setColor(prev => [
            ...prev.slice(0, nStep),
            CORRECT_ANSWER_COLOR,
            ...prev.slice(nStep + 1),
          ]);
          setNumStep(prevState => prevState + 1);
          setDisableState(prevState => [...prevState, true]);
        }
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
          extra: { response: answer, attemps: attempts, hints: hintsShow },
        });
      }
    }
  };

  return (
    <Stack>
      <Stack>
        <VStack
          direction={["row", "column"]}
          style={{ borderRadius: 10, padding: 10, width: "100%" }}
        >
          <Stack direction={{ base: ["row", "column"], xl: ["column", "row"] }}>
            <Flex marginRight={{ xl: "250px" }} margin={{ base: "auto" }}>
              <Text display={{ base: "none", xl: "block" }} margin={{ base: "auto" }}>
                {step.left_text}
              </Text>
              <Flex padding={{ base: "5px" }}>
                {step.input_labels && (
                  <TeX
                    style={{ fontSize: "12px", margin: "auto" }}
                    math={step.input_labels}
                    as="figcaption"
                  />
                )}
              </Flex>
              <Stack style={{ width: "100px" }}>
                <Input type="text" value={answer} onChange={onChange} style={{ margin: "auto" }} />
              </Stack>
            </Flex>
            <Stack marginLeft={{ base: "0px", xl: "-180px" }}>
              <Grid
                display={{ xl: "none", base: "grid" }}
                style={{ margin: "10px" }}
                templateColumns="repeat(2, 1fr)"
                gap={6}
              >
                <Button colorPalette="blue" onClick={checkAnswers}>
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
              <Stack display={{ xl: "block", base: "none" }}>
                <Flex>
                  <div style={{ paddingRight: "5px" }}>
                    <Button colorPalette="blue" onClick={checkAnswers}>
                      {CORRECT_BUTTOM_NAME}
                    </Button>
                  </div>
                  <div style={{ paddingRight: "5px" }}>
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
