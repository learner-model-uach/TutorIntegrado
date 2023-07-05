import React, { useRef, useState } from "react";
import Hint from "../../../Hint";
import { MathComponent } from "../../../MathJax";
import { useAction } from "../../../../utils/action";
import { Alert, AlertIcon, Button, Center, Spacer, Input, Wrap, WrapItem } from "@chakra-ui/react";

export const TCstep1 = ({
  step1,
  setStep1Valid,
  step1Valid,
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
  const correctAlternatives = step1.answers.map(elemento => elemento.answer); //list of answers valid
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
      element[0] === responseStudent[0] &&
      element[1] === responseStudent[1] &&
      element[2] === responseStudent[2];
    if (correctAlternatives.some(validate)) {
      setStep1Valid((step1Valid = step1.answers[correctAlternatives.findIndex(validate)].nextStep));
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
              {step1.incorrectMsg}
            </Alert>,
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
            <MathComponent tex={String.raw`${step1.expression}`} display={false} />
          </Center>
        </WrapItem>

        <Spacer />

        <WrapItem>
          <Center>
            <label>a =</label>
            <Input
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "600",
              }}
              size="sm"
              w={85}
              focusBorderColor="#9DECF9"
              placeholder="Ingrese a"
              ref={response1}
              isReadOnly={step1Valid != null}
            />
            <label> , b =</label>
            <Input
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "600",
              }}
              size="sm"
              w={85}
              focusBorderColor="#9DECF9"
              placeholder="Ingrese b"
              ref={response2}
              isReadOnly={step1Valid != null}
            />
            <label>, c = &nbsp;</label>
            <Input
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "600",
              }}
              size="sm"
              w={85}
              focusBorderColor="#9DECF9"
              placeholder="Ingrese c"
              ref={response3}
              isReadOnly={step1Valid != null}
            />
          </Center>
        </WrapItem>

        <Spacer />

        <WrapItem>
          {step1Valid == null && (
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
                      stepID: "" + step1.stepId,
                      contentID: contentID,
                      topicID: topicID,
                      result: step1Valid === null ? 0 : 1,
                      kcsIDs: step1.KCs,
                      extra: {
                        response: [
                          response1.current.value,
                          response2.current.value,
                          response3.current.value,
                        ],
                        attempts: attempts,
                        hints: hints,
                      },
                      // topicID: ""+ejercicio.code,
                    });
                }}
                size="sm"
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
      {step1Valid == null && feedbackMsg}
    </>
  );
};
