// @ts-nocheck
import React, { useRef, useState } from "react";
import Hint from "../../../../components/Hint";
import { MathComponent } from "../../../MathJax";
import { useAction } from "../../../../utils/action";
import { Alert, AlertIcon, Button, Center, Input, Wrap, WrapItem, Spacer } from "@chakra-ui/react";

export const TPstepF = ({ step, setStepValid, stepValid, contentID, topicID, extra, setExtra }) => {
  const response1 = useRef(null); //first input response
  const [feedbackMsg, setFeedbackMsg] = useState(null); //feedback message
  const [error, setError] = useState(false); //true when the student enters an incorrect answers
  const correctAlternatives = step.answers.map(elemento => elemento.answer); //list of answers valid
  const action = useAction(); //send action to central system
  const [attempts, setAttempts] = useState(0); //attemps counts
  const [hints, setHints] = useState(0); //hint counts
  const dateInitial = Date.now();
  const [lastHint, setLastHint] = useState(false);
  const compare = () => {
    //contador de intentos
    setAttempts(attempts + 1);

    const responseStudent = [response1.current.value.replace(/[*]| /g, "").toLowerCase()];
    const validate = element => element[0] === responseStudent[0];

    if (correctAlternatives.some(validate)) {
      setStepValid((stepValid = "Terminado"));
      extra.att = attempts;
      extra.hints = hints;
      extra.duration = (Date.now() - dateInitial) / 1000;
      extra.lastHint = lastHint;
      setExtra(extra);
    } else {
      setError(true);
      //error cuando la entrada es incorrecta
      setFeedbackMsg(
        //error cuando la entrada es incorrecta
        <Alert status="error">
          <AlertIcon />
          {step.incorrectMsg}
        </Alert>,
      );
    }
  };
  return (
    <>
      <Wrap padding="15px 10px 10px 10px">
        <WrapItem padding="5px 0px 10px 0px">
          <Center>
            <MathComponent tex={String.raw`${step.expression}`} display={false} />
          </Center>
        </WrapItem>

        <Spacer />

        <WrapItem>
          <Center>
            <Input
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "6000",
              }}
              size="sm"
              w={100}
              focusBorderColor="#9DECF9"
              ref={response1}
              isReadOnly={stepValid != null}
            />
          </Center>
        </WrapItem>

        <Spacer />

        <WrapItem>
          {stepValid == null && (
            <>
              <Button
                colorScheme="cyan"
                variant="outline"
                onClick={() => {
                  compare();
                  action({
                    verbName: "tryStep",
                    stepID: "" + step.stepId,
                    contentID: contentID,
                    topicID: topicID,
                    result: stepValid === null ? 0 : 1,
                    kcsIDs: step.KCs,
                    extra: {
                      response: [response1.current.value],
                      attempts: attempts,
                      hints: hints,
                    },
                  });
                }}
                size="sm"
              >
                Aceptar
              </Button>
              &nbsp;&nbsp;
              <Hint
                hints={step.hints}
                stepId={step.stepId}
                contentId={contentID}
                topicID={topicID}
                matchingError={step.matchingError}
                response={[response1]}
                error={error}
                setError={setError}
                hintCount={hints}
                setHints={setHints}
                setLastHint={setLastHint}
              ></Hint>
            </>
          )}
        </WrapItem>
      </Wrap>
      {feedbackMsg}
    </>
  );
};
