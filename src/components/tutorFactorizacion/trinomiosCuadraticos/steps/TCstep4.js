import React, { useRef, useState } from "react";
import Hint from "../../../Hint";
import { MathComponent } from "../../../MathJax";
import { useAction } from "../../../../utils/action";
import { Alert, Button, Center, Spacer, Input, Wrap, WrapItem } from "@chakra-ui/react";

export const TCstep4 = ({
  step4,
  setStep4Valid,
  step4Valid,
  contentID,
  topicID,
  extra,
  setExtra,
  isEditorMode = false,
}) => {
  const response1 = useRef(null); //first input response
  const response2 = useRef(null); //2nd input response
  const [feedbackMsg, setFeedbackMsg] = useState(null); //feedback message
  const [error, setError] = useState(false); //true when the student enters an incorrect answers
  const correctAlternatives = step4.answers.map(elemento => elemento.answer); //list of answers valid
  const _action = useAction(); //send action to central system
  const action = isEditorMode ? () => {} : _action; // ✅ no-op en editor
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
    ];
    const validate = element =>
      (element[0] === responseStudent[0] && element[1] === responseStudent[1]) ||
      (element[0] === responseStudent[1] && element[1] === responseStudent[0]);
    if (correctAlternatives.some(validate)) {
      setStep4Valid((step4Valid = step4.answers[correctAlternatives.findIndex(validate)].nextStep));
      if (!isEditorMode) {
        extra.att = attempts;

        extra.hints = hints;

        extra.duration = (Date.now() - dateInitial) / 1000;

        extra.lastHint = lastHint;

        setExtra(extra);
      }
    } else {
      if (response1.current.value == "" || response2.current.value == "") {
        setTimeout(() => {
          setFeedbackMsg(
            <Alert.Root status="warning">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Ingrese respuesta(s)</Alert.Title>
              </Alert.Content>
            </Alert.Root>,
          );
        }, 50);
      } else {
        setError(true);
        setTimeout(() => {
          setFeedbackMsg(
            //error cuando la entrada es incorrecta
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{step4.incorrectMsg}</Alert.Title>
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
        <WrapItem padding="8px 0px 10px 0px">
          <Center>
            <MathComponent tex={String.raw`${step4.expression}`} display={false} />
          </Center>
        </WrapItem>

        <Spacer />

        <WrapItem>
          <Center>
            <label>x₁ =&nbsp;</label>
            <Input
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "600",
              }}
              size="sm"
              w={100}
              focusRingColor="cyan.200"
              focusRingWidth="2px"
              placeholder="Ingrese x₁"
              ref={response1}
              readOnly={step4Valid != null}
            />

            <label>&nbsp;&nbsp;, x₂ =&nbsp;</label>
            <Input
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "600",
              }}
              size="sm"
              w={100}
              focusRingColor="cyan.200"
              focusRingWidth="2px"
              placeholder="Ingrese x₂"
              ref={response2}
              readOnly={step4Valid != null}
            />
          </Center>
        </WrapItem>

        <Spacer />

        <WrapItem>
          {step4Valid == null && (
            <>
              <Button
                colorPalette="cyan"
                variant="outline"
                onClick={() => {
                  compare();
                  response1.current.value != "" &&
                    response2.current.value != "" &&
                    action({
                      verbName: "tryStep",
                      stepID: "" + step4.stepId,
                      contentID: contentID,
                      topicID: topicID,
                      result: step4Valid === null ? 0 : 1,
                      kcsIDs: step4.KCs,
                      extra: {
                        response: [response1.current.value, response2.current.value],
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
                hints={step4.hints}
                contentId={contentID}
                topicId={topicID}
                stepId={step4.stepId}
                matchingError={step4.matchingError}
                response={[response1, response2]}
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
      {step4Valid == null && feedbackMsg}
    </>
  );
};
