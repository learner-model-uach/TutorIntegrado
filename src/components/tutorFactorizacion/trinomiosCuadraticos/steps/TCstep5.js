import React, { useRef, useState } from "react";
import Hint from "../../../Hint";
import { MathComponent } from "../../../MathJax";
import { useAction } from "../../../../utils/action";
import { Alert, AlertIcon, Button, Center, Spacer, Input, Wrap, WrapItem } from "@chakra-ui/react";

export const TCstep5 = ({
  step5,
  setStep5Valid,
  step5Valid,
  contentID,
  topicID,
  extra,
  setExtra,
}) => {
  const response1 = useRef(null); //1st input response
  const response2 = useRef(null); //2nd input response
  const response3 = useRef(null); //3nd input response
  const [feedbackMsg, setFeedbackMsg] = useState(null); //feedback message
  const [error, setError] = useState(false); //true when the student enters an incorrect answers
  const correctAlternatives = step5.answers.map(elemento => elemento.answer); //list of answers valid
  const action = useAction(); //send action to central system
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0); //hint counts
  const dateInitial = Date.now();
  const [lastHint, setLastHint] = useState(false);

  const compare = () => {
    setFeedbackMsg(null);
    //contador de intentos
    setAttempts(attempts + 1);
    const responseStudent = [
      response1.current.value.replace(/[*]|[(]|[)]|[{]|[}]| /g, "").toLowerCase(),
      response2.current.value.replace(/[*]|[(]|[)]|[{]|[}]| /g, "").toLowerCase(),
      response3.current.value.replace(/[*]|[(]|[)]|[{]|[}]| /g, "").toLowerCase(),
    ];
    const validate = element =>
      (element[0] === responseStudent[0] &&
        element[1] === responseStudent[1] &&
        element[2] === responseStudent[2]) ||
      (element[0] === responseStudent[0] &&
        element[1] === responseStudent[2] &&
        element[2] === responseStudent[1]);
    if (correctAlternatives.some(validate)) {
      setFeedbackMsg(
        <Alert status="success">
          <AlertIcon />
          {step5.correctMsg}
          &nbsp;
          <MathComponent tex={step5.displayResult} display={false} />
        </Alert>,
      );
      setStep5Valid((step5Valid = "Terminado"));
      extra.att = attempts;
      extra.hints = hints;
      extra.duration = (Date.now() - dateInitial) / 1000;
      extra.lastHint = lastHint;
      setExtra(extra);
    } else {
      if (
        response1.current.value == "" ||
        response2.current.value == "" ||
        response3.current.value == ""
      ) {
        setTimeout(() => {
          setFeedbackMsg(
            <Alert status="warning">
              <AlertIcon />
              Ingrese respuesta(s)
            </Alert>,
          );
        }, 50);
      } else {
        setError(true);
        setTimeout(() => {
          setFeedbackMsg(
            //error cuando la entrada es incorrecta
            <Alert status="error">
              <AlertIcon />
              {step5.incorrectMsg}
            </Alert>,
          );
        }, 50);
      }
    }
  };
  return (
    <>
      <Wrap padding="15px 10px 10px 10px">
        <WrapItem padding="8px 0px 10px 0px">
          <Center>
            <MathComponent tex={String.raw`${step5.expression}`} display={false} />
          </Center>
        </WrapItem>

        <Spacer />

        <WrapItem>
          <Center>
            <Input
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "600",
              }}
              size="sm"
              w={50}
              focusBorderColor="#9DECF9"
              placeholder="a"
              ref={response1}
              isReadOnly={step5Valid != null}
            />
            <label>(</label>
            <Input
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "600",
              }}
              size="sm"
              w={120}
              focusBorderColor="#9DECF9"
              placeholder="x - x₁"
              ref={response2}
              isReadOnly={step5Valid != null}
            />
            <label>)(</label>
            <Input
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "600",
              }}
              size="sm"
              w={120}
              focusBorderColor="#9DECF9"
              placeholder="x - x₂"
              ref={response3}
              isReadOnly={step5Valid != null}
            />
            <label>)</label>
          </Center>
        </WrapItem>

        <Spacer />

        <WrapItem>
          {step5Valid == null && (
            <>
              <Button
                colorScheme="cyan"
                variant="outline"
                onClick={() => {
                  compare();
                  response1.current.value != "" &&
                    response2.current.value != "" &&
                    response3.current.value != "" &&
                    action({
                      verbName: "tryStep",
                      stepID: "" + step5.stepId,
                      contentID: contentID,
                      topicID: topicID,
                      result: step5Valid === null ? 0 : 1,
                      kcsIDs: step5.KCs,
                      extra: {
                        response: [
                          response1.current.value,
                          response2.current.value,
                          response3.current.value,
                        ],
                        attempts: attempts,
                        hints: hints,
                      },
                    });
                }}
                size="sm"
              >
                Aceptar
              </Button>{" "}
              &nbsp; &nbsp;
              <Hint
                hints={step5.hints}
                contentId={contentID}
                topicId={topicID}
                stepId={step5.stepId}
                matchingError={step5.matchingError}
                response={[response1, response2, response3]}
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
