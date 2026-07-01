import { ButtonGroup, CheckboxCard, Flex, List } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ResAlert from "../Alert/responseAlert";
import HintButton from "../Hint/hint";
import { useAlert } from "../hooks/useAlert";
import { useHint } from "../hooks/useHint";
import { useStore } from "../store/store";
import type { Hint, SelectionMeta } from "../types";
import { AlertStatus } from "../types";
import { useAction } from "../../../utils/action";

interface Props {
  meta: SelectionMeta;
  hints: Hint[];
  correctMsg: string;
  isEditorMode?: boolean;
}
// Alternative selection component
const SelectionComponent = ({ meta, hints, correctMsg, isEditorMode = false }: Props) => {
  //console.log("meta-->", meta)
  //const [selectionMeta, setSelectionMeta] = useState(meta) // State containing the meta info
  const [userSelectedAnswer, setUserSelectedAnswer] = useState<number | null>(null); // State to track user-selected answer
  const [isCorrectUserAnswer, setIsCorrectUserAnswer] = useState<boolean>(false); // State to track if the user's answer is correct

  const {
    unlockNextStep,
    currentStepIndex,
    currentQuestionIndex,
    currentContetId,
    currentTopicId,
    exerciseData,
  } = useStore();
  const _reportAction = useAction();
  const reportAction = isEditorMode ? () => {} : _reportAction; // ✅

  const { alertTitle, alertStatus, alertMsg, alertHidden, showAlert, resetAlert } = useAlert(
    "",
    AlertStatus.info,
    "",
    true,
    3000,
  );

  const {
    unlockedHints,
    currentHint,
    totalHints,
    disabledPrevButton,
    disabledNextButton,
    numHintsActivated,
    prevHint,
    nextHint,
    unlockHint,
    resetNumHintsActivated,
  } = useHint(hints);

  useEffect(() => {
    setUserSelectedAnswer(null);
    setIsCorrectUserAnswer(false);
    resetAlert();
  }, [meta]);

  // Function that controls the selection of an alternative
  const handleClick = (answerIndex: number) => {
    // We compare if the selected alternative is correct
    const isCorrectUserAnswer = answerIndex === meta.idCorrectAnswers;
    setUserSelectedAnswer(answerIndex);

    reportAction({
      verbName: "tryStep",
      stepID: "[" + currentQuestionIndex + "," + currentStepIndex + "]",
      contentID: currentContetId,
      topicID: currentTopicId,
      result: isCorrectUserAnswer ? 1 : 0,
      kcsIDs: exerciseData.questions[currentQuestionIndex].steps[currentStepIndex].kcs,
      extra: {
        Response: meta.answers[answerIndex],
      },
      detail: "SelectionComponent",
    });
    if (isCorrectUserAnswer) {
      // Update color, message and type of alert
      setIsCorrectUserAnswer(true);

      showAlert("😃", AlertStatus.success, correctMsg, null);
      if (!isEditorMode) unlockNextStep(); // ✅
    } else {
      setIsCorrectUserAnswer(false);
      showAlert("😕 ", AlertStatus.error, "Respuesta incorrecta!!");
      unlockHint(answerIndex);
    }
  };

  const getBackgroundColor = (index: number) => {
    // Si el usuario no ha seleccionado respuesta
    if (userSelectedAnswer == null) return "transparent";

    // Si la respuesta es correcta
    if (index === meta.idCorrectAnswers) {
      // Si el usuario seleccionó la respuesta correcta
      if (index === userSelectedAnswer) return "#C6F6D4"; // Colorear de verde
      return "transparent"; // Mantener transparente
    }
    // Si la respuesta es incorrecta
    if (index === userSelectedAnswer) return "#FED6D7"; // Colorear de rojo

    return "transparent";
  };

  const getColorPalette = (index: number) => {
    if (userSelectedAnswer !== index) return "gray";
    return index === meta.idCorrectAnswers ? "green" : "red";
  };

  return (
    <Flex flexDirection="column" width="100%">
      <List.Root listStyleType="none" ps="0">
        {meta.answers.map((answer, index) => {
          return (
            <List.Item paddingBottom={1} key={index}>
              <CheckboxCard.Root
                checked={userSelectedAnswer === index}
                colorPalette={getColorPalette(index)}
                disabled={isCorrectUserAnswer}
                variant="outline"
                width="100%"
                bg={getBackgroundColor(index)}
                borderRadius="md"
                cursor={isCorrectUserAnswer ? "not-allowed" : "pointer"}
                onCheckedChange={details => {
                  if (details.checked) {
                    handleClick(index);
                  }
                }}
              >
                <CheckboxCard.HiddenInput />
                <CheckboxCard.Control width="100%">
                  <CheckboxCard.Indicator />
                  <CheckboxCard.Content flex="1">
                    <CheckboxCard.Label fontWeight="bold">{answer.value}</CheckboxCard.Label>
                  </CheckboxCard.Content>
                </CheckboxCard.Control>
              </CheckboxCard.Root>
            </List.Item>
          );
        })}
      </List.Root>
      <ButtonGroup size="lg" display="flex" justifyContent="flex-end" paddingTop={2}>
        <HintButton
          hints={unlockedHints}
          currentHint={currentHint}
          totalHints={totalHints}
          prevHint={prevHint}
          nextHint={nextHint}
          disabledPrevButton={disabledPrevButton}
          disabledNextButton={disabledNextButton}
          numEnabledHints={numHintsActivated}
          resetNumHintsActivated={resetNumHintsActivated}
        ></HintButton>
      </ButtonGroup>
      <ResAlert title={alertTitle} status={alertStatus} text={alertMsg} alertHidden={alertHidden} />
    </Flex>
  );
};
export default SelectionComponent;
