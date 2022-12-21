import React, { useRef, useState } from "react";
import Hint from "../../tools/Hint";
import { Loading } from "../../tools/Spinner";
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

export const DSCstep1 = ({
  step1,
  setStep1Valid,
  step1Valid,
  sign,
  contentID,
  topicID,
}) => {
  const response1 = useRef(null); //first input response
  const response2 = useRef(null); //second input response
  const [feedbackMsg, setFeedbackMsg] = useState(null); //feedback message
  const [error, setError] = useState(false); //true when the student enters an incorrect answers
  const correctAlternatives = step1.answers.map((elemento) => elemento.answer); //list of answers valid
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
      element[0] === responseStudent[0] && element[1] === responseStudent[1];
    if (correctAlternatives.some(validate)) {
      setStep1Valid(
        (step1Valid =
          step1.answers[correctAlternatives.findIndex(validate)].nextStep)
      );
    } else {
      setError(true);
      setFeedbackMsg(
        //error cuando la entrada es incorrecta
        <Alert status="error">
          <AlertIcon />
          {step1.incorrectMsg}
        </Alert>
      );
    }
  };

  return (
    <>
      <Wrap padding="15px 10px 10px 10px">
        <WrapItem padding="5px 0px 10px 0px">
          <Center>
            <MathComponent
              tex={String.raw`${step1.expression}`}
              display={false}
            />
          </Center>
        </WrapItem>

        <Spacer />

        <WrapItem>
          <Center>
            <label>( </label>
            <Input
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "600",
              }}
              size="sm"
              w={125}
              focusBorderColor="#9DECF9"
              placeholder="Primera Raiz³"
              ref={response1}
              isReadOnly={step1Valid != null}
            />
            <label htmlFor="label2">)³</label>
            <label>&nbsp;{sign} ( </label>
            <Input
              style={{
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "600",
              }}
              size="sm"
              w={125}
              focusBorderColor="#9DECF9"
              placeholder="Segunda Raiz³"
              ref={response2}
              isReadOnly={step1Valid != null}
            />
            <label htmlFor="label3">)³</label>
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
                response={[response1, response2]}
                itemTitle="Diferencia/suma de cubos" //no se utiliza
                error={error}
                setError={setError}
                hintCount={hints}
                setHints={setHints}
              ></Hint>
            </>
          )}
        </WrapItem>
      </Wrap>
      {step1Valid == null && feedbackMsg}
    </>
  );
};
