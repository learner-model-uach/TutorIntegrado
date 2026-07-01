import React, { useRef, useState } from "react";
import Hint from "../../../Hint";
import { MathComponent } from "../../../MathJax";
import { useAction } from "../../../../utils/action";
import { Alert, Button, Center, Spacer, Input, Wrap, WrapItem } from "@chakra-ui/react";

export const DCstep2 = ({
  step2,
  setStep2Valid,
  step2Valid,
  contentID,
  topicID,
  extra,
  setExtra,
  isEditorMode = false,
}) => {
  const _action = useAction();
  const action = isEditorMode ? () => {} : _action; // ✅ no-op en editor

  const response1 = useRef(null);
  const response2 = useRef(null);
  const correctAlternatives = step2.answers.map(elemento => elemento.answer);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0);
  const dateInitial = Date.now();
  const [lastHint, setLastHint] = useState(false);

  const clean = val =>
    val
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

  const compare = () => {
    setFeedbackMsg(null);
    setAttempts(attempts + 1);
    const responseStudent = [clean(response1.current.value), clean(response2.current.value)];
    const validate = element =>
      (element[0] === responseStudent[0] && element[1] === responseStudent[1]) ||
      (element[0] === responseStudent[1] && element[1] === responseStudent[0]);

    if (correctAlternatives.some(validate)) {
      setStep2Valid((step2Valid = "Terminado"));
      if (!isEditorMode) {
        extra.att = attempts;
        extra.hints = hints;
        extra.duration = (Date.now() - dateInitial) / 1000;
        extra.lastHint = lastHint;
        setExtra(extra);
      }
      setFeedbackMsg(
        <Alert.Root status="success">
          <Alert.Indicator />
          <Alert.Title>{step2.correctMsg}</Alert.Title>
        </Alert.Root>,
      );
    } else {
      if (response1.current.value == "" || response2.current.value == "") {
        setTimeout(() => {
          setFeedbackMsg(
            <Alert.Root status="warning">
              <Alert.Indicator />
              <Alert.Title>Ingrese respuesta(s)</Alert.Title>
            </Alert.Root>,
          );
        }, 50);
      } else {
        setError(true);
        setTimeout(() => {
          setFeedbackMsg(
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Title>{step2.incorrectMsg}</Alert.Title>
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
          <Center>
            <MathComponent tex={String.raw`${step2.expression}`} display={false} />
          </Center>
        </WrapItem>
        <Spacer />
        <WrapItem>
          <Center>
            <label>( </label>
            <Input
              style={{ textAlign: "center", fontStyle: "italic", fontWeight: "600" }}
              size="sm"
              w={125}
              focusBorderColor="#9DECF9"
              placeholder="Ingrese suma"
              ref={response1}
              isReadOnly={step2Valid != null}
            />
            <label htmlFor="label2">)(</label>
            <Input
              style={{ textAlign: "center", fontStyle: "italic", fontWeight: "600" }}
              size="sm"
              w={125}
              focusBorderColor="#9DECF9"
              placeholder="Ingrese resta"
              ref={response2}
              isReadOnly={step2Valid != null}
            />
            <label htmlFor="label3">)</label>
          </Center>
        </WrapItem>
        <Spacer />
        <WrapItem>
          {step2Valid == null && (
            <>
              <Button
                colorPalette="teal"
                variant="outline"
                size="sm"
                onClick={() => {
                  compare();
                  response1.current.value != "" &&
                    response2.current.value != "" &&
                    action({
                      verbName: "tryStep",
                      stepID: "" + step2.stepId,
                      contentID,
                      topicID,
                      result: step2Valid === null ? 0 : 1,
                      kcsIDs: step2.KCs,
                      extra: {
                        response: [response1.current.value, response2.current.value],
                        attempts,
                        hints,
                      },
                    });
                }}
              >
                Aceptar
              </Button>
              &nbsp;&nbsp;
              <Hint
                hints={step2.hints}
                contentId={contentID}
                topicId={topicID}
                stepId={step2.stepId}
                matchingError={step2.matchingError}
                response={[response1, response2]}
                error={error}
                setError={setError}
                hintCount={hints}
                setHints={setHints}
                setLastHint={setLastHint}
              />
            </>
          )}
        </WrapItem>
      </Wrap>
      {feedbackMsg}
    </>
  );
};
