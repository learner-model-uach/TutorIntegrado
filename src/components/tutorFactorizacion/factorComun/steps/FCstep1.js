import React, { useRef, useState } from "react";
import { MathComponent } from "../../../MathJax";
import { useAction } from "../../../../utils/action";
import { Alert, Button, Input, Wrap, WrapItem, Center, Spacer } from "@chakra-ui/react";

import Hint from "../../../Hint";

const FCstep1 = ({ step1, setStep1Valid, step1Valid, contentID, topicID, extra, setExtra }) => {
  const action = useAction(); //send action to central system
  const response = useRef(null); // answer entered by the student
  const [feedbackMsg, setFeedbackMsg] = useState(null); //feedback message
  const [error, setError] = useState(false); //true when the student enters an incorrect answers
  const correctAlternatives = step1.answers.map(element => element.answer); //list of answers valid
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0); //hint counts
  const dateInitial = Date.now();
  const [lastHint, setLastHint] = useState(false);

  //function compare when press button "Aceptar"
  const compare = () => {
    setFeedbackMsg(null);
    //contador de intentos
    setAttempts(attempts + 1);
    //responseStudent equals response with replace "space" and "*" (work string in lower case)
    const responseStudent = response.current.value
      .replace(/[*]|[(]|[)]|[{]|[}]| /g, "")
      .replace(/[²]| /g, "^2")
      .replace(/[³]| /g, "^3")
      .replace(/[⁴]| /g, "^4")
      .replace(/[⁵]| /g, "^5")
      .replace(/[⁶]| /g, "^6")
      .replace(/[⁷]| /g, "^7")
      .replace(/[⁸]| /g, "^8")
      .replace(/[⁹]| /g, "^9")
      .toLowerCase();
    //validate is a function that compares each element with response of student
    const validate = element => element === responseStudent;

    //if response of student is correct (response == one element of correctAlternatives)
    if (correctAlternatives.some(validate)) {
      setFeedbackMsg(
        <>
          <Alert.Root status="success">
            <Alert.Indicator/>
            <Alert.Content>
              <Alert.Title>{step1.correctMsg}</Alert.Title>
            </Alert.Content>
          </Alert.Root>
        </>,
      );
      setStep1Valid((step1Valid = "Terminado"));

      extra.att = attempts;
      extra.hints = hints;
      extra.duration = (Date.now() - dateInitial) / 1000;
      extra.lastHint = lastHint;
      setExtra(extra);
    } else {
      /*if response is incorrect*/
      if (response.current.value == "") {
        setTimeout(() => {
          setFeedbackMsg(
            <Alert.Root status="warning">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Ingrese respuesta</Alert.Title>
              </Alert.Content>
            </Alert.Root>,
          );
        }, 50);
      } else {
        setError(true);
        setTimeout(() => {
          setFeedbackMsg(
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{step1.incorrectMsg}</Alert.Title>
              </Alert.Content>
            </Alert.Root>,
          );
        }, 50);
      }
    }
  };

  return (
    <>
      <Wrap padding="15px 10px 10px 10px">
        <WrapItem padding="5px 0px 10px 0px">
          <MathComponent tex={String.raw`${step1.expression}`} display={false} />
        </WrapItem>

        <Spacer />

        <WrapItem>
          <Center>
            <label>(</label>
            <Input
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "600",
              }}
              size="sm"
              w={160}
              placeholder="Ingrese factor común"
              ref={response}
              readOnly={step1Valid != null}
              focusRingColor="cyan.200"
              focusRingWidth="2px"
            />
            <label>)</label>

            {step1Valid === null ? (
              <label>&nbsp;(?)</label>
            ) : (
              <>
                <MathComponent tex={String.raw`${step1.displayResult}`} display={false} />
              </>
            )}
          </Center>
        </WrapItem>

        <Spacer />

        <WrapItem>
          {step1Valid === null && (
            <>
              <Button
                colorScheme="cyan"
                size="sm"
                variant="outline"
                onClick={() => {
                  compare();
                  response.current.value != "" &&
                    action({
                      verbName: "tryStep",
                      stepID: "" + step1.stepId,
                      contentID: contentID,
                      topicID: topicID,
                      result: step1Valid === null ? 0 : 1,
                      kcsIDs: step1.KCs,
                      extra: {
                        response: [response.current.value],
                        attempts: attempts,
                        hints: hints,
                      },
                    });
                }}
              >
                Aceptar
              </Button>
              &nbsp;&nbsp;
              <Hint
                hints={step1.hints}
                contentId={contentID}
                topicId={topicID}
                stepId={step1.stepId}
                matchingError={step1.matchingError}
                response={[response]}
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
export default FCstep1;
