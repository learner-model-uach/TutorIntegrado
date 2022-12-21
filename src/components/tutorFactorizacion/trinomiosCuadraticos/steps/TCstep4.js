import React, { useRef, useState } from "react";
import Hint from "../../tools/Hint";
import { MathComponent } from "../../../MathJax";
import { useAction } from "../../../../utils/action";
import {
  Alert,
  AlertIcon,
  Button,
  Center,
  Spacer,
  Input,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

export const TCstep4 = ({
  step4,
  setStep4Valid,
  step4Valid,
  contentID,
  topicID,
}) => {
  const response1 = useRef(null); //first input response
  const response2 = useRef(null); //2nd input response
  const [feedbackMsg, setFeedbackMsg] = useState(null); //feedback message
  const [error, setError] = useState(false); //true when the student enters an incorrect answers
  const correctAlternatives = step4.answers.map((elemento) => elemento.answer); //list of answers valid
  const action = useAction(); //send action to central system
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0); //hint counts

  const compare = () => {
    //contador de intentos
    setAttempts(attempts + 1);
    const responseStudent = [
      response1.current.value.replace(/[*]| /g, "").toLowerCase(),
      response2.current.value.replace(/[*]| /g, "").toLowerCase(),
    ];
    const validate = (element) =>
      (element[0] === responseStudent[0] &&
        element[1] === responseStudent[1]) ||
      (element[0] === responseStudent[1] && element[1] === responseStudent[0]);
    if (correctAlternatives.some(validate)) {
      setStep4Valid(
        (step4Valid =
          step4.answers[correctAlternatives.findIndex(validate)].nextStep)
      );
    } else {
      setError(true);
      setFeedbackMsg(
        //error cuando la entrada es incorrecta
        <Alert status="error">
          <AlertIcon />
          {step4.incorrectMsg}
        </Alert>
      );
    }
  };
  return (
    <>
      <Wrap padding="15px 10px 10px 10px">
        <WrapItem padding="8px 0px 10px 0px">
          <Center>
            <MathComponent
              tex={String.raw`${step4.expression}`}
              display={false}
            />
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
              focusBorderColor="#9DECF9"
              placeholder="Ingrese x₁"
              ref={response1}
              isReadOnly={step4Valid != null}
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
              focusBorderColor="#9DECF9"
              placeholder="Ingrese x₂"
              ref={response2}
              isReadOnly={step4Valid != null}
            />
          </Center>
        </WrapItem>

        <Spacer />

        <WrapItem>
          {step4Valid == null && (
            <>
              <Button
                colorScheme="cyan"
                variant="outline"
                onClick={() => {
                  compare();
                  action({
                    verbName: "tryStep",
                    stepID: "" + step4.stepId,
                    contentID: contentID,
                    topicID: topicID,
                    result: step4Valid === null ? 0 : 1,
                    kcsIDs: step4.KCs,
                    extra: {
                      response: [
                        response1.current.value,
                        response2.current.value,
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
                hints={step4.hints}
                contentId={contentID}
                topicId={topicID}
                stepId={step4.stepId}
                matchingError={step4.matchingError}
                response={[response1, response2]}
                itemTitle="Trinomios cuadráticos" //no se utiliza
                error={error}
                setError={setError}
                hintCount={hints}
                setHints={setHints}
              ></Hint>
            </>
          )}
        </WrapItem>
      </Wrap>
      {step4Valid == null && feedbackMsg}
    </>
  );
};
