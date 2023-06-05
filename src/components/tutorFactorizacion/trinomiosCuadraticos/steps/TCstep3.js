import React, { useRef, useState } from "react";
import Hint from "../../../Hint";
import { useAction } from "../../../../utils/action";
import {
  Alert,
  AlertIcon,
  Button,
  Center,
  Stack,
  Radio,
  RadioGroup,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";

export const TCstep3 = ({
  step3,
  setStep3Valid,
  step3Valid,
  contentID,
  topicID,
  extra,
  setExtra,
}) => {
  const [feedbackMsg, setFeedbackMsg] = useState(null); // feedback message
  const [value, setValue] = React.useState(); //checked radio
  const [error, setError] = useState(false); //true when the student enters an incorrect answers
  const action = useAction(); //send action to central system
  const hintUnique = ["*"];
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(0); //hint counts
  const dateInitial = Date.now();
  const [lastHint, setLastHint] = useState(false);

  const compare = () => {
    setFeedbackMsg(null);
    //contador de intentos
    setAttempts(attempts + 1);
    if (step3.answers[0].answer === value) {
      setStep3Valid((step3Valid = step3.answers[0].nextStep ?? 0));
      extra.att = attempts;
      extra.hints = hints;
      extra.duration = (Date.now() - dateInitial) / 1000;
      extra.lastHint = lastHint;
      setExtra(extra);
    } else {
      if (value == undefined) {
        setTimeout(() => {
          setFeedbackMsg(
            <Alert status="warning">
              <AlertIcon />
              Seleccione una alternativa
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
              {step3.incorrectMsg}
            </Alert>,
          );
        }, 50);
      }
    }
  };
  return (
    <>
      <Wrap padding="15px 10px 10px 10px">
        <WrapItem>
          <Center>
            <RadioGroup onChange={setValue} value={value}>
              <Stack>
                <Radio value="1" isReadOnly={step3Valid != null}>
                  Factorizable con diferentes raíces reales
                </Radio>
                <Radio value="2" isReadOnly={step3Valid != null}>
                  Factorizable con raíces reales iguales
                </Radio>
                <Radio value="3" isReadOnly={step3Valid != null}>
                  Factorizable con raíces complejas conjugadas
                </Radio>
              </Stack>
            </RadioGroup>
          </Center>
        </WrapItem>

        <WrapItem padding="25px 0px 0px 70px">
          {step3Valid == null && (
            <>
              <Button
                colorScheme="cyan"
                variant="outline"
                onClick={() => {
                  compare();
                  value != undefined &&
                    action({
                      verbName: "tryStep",
                      stepID: "" + step3.stepId,
                      contentID: contentID,
                      topicID: topicID,
                      result: step3Valid === null ? 0 : 1,
                      kcsIDs: step3.KCs,
                      extra: {
                        response: [value],
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
                hints={step3.hints}
                contentId={contentID}
                topicId={topicID}
                stepId={step3.stepId}
                matchingError={step3.matchingError}
                response={hintUnique}
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
      {step3Valid == null && feedbackMsg}
    </>
  );
};
