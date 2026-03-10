import React, { useRef, useState } from "react";
import Hint from "../../../Hint";
import { useAction } from "../../../../utils/action";
import { Alert, Button, Center, Stack, RadioGroup, Wrap, WrapItem } from "@chakra-ui/react";

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
            <Alert.Root status="warning">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>
                  Seleccione una alternativa
                </Alert.Title>
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
                <Alert.Title>
                  {step3.incorrectMsg}
                </Alert.Title>
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
        <WrapItem>
          <Center>
            <RadioGroup.Root value={value} onValueChange={({ value }) => setValue(value)}>
              <Stack>
                <RadioGroup.Item value="1" disabled={step3Valid != null}>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>
                    Factorizable con diferentes raíces reales
                  </RadioGroup.ItemText>
                </RadioGroup.Item>

                <RadioGroup.Item value="2" disabled={step3Valid != null}>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>Factorizable con raíces reales iguales</RadioGroup.ItemText>
                </RadioGroup.Item>

                <RadioGroup.Item value="3" disabled={step3Valid != null}>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>
                    Factorizable con raíces complejas conjugadas
                  </RadioGroup.ItemText>
                </RadioGroup.Item>
              </Stack>
            </RadioGroup.Root>
          </Center>
        </WrapItem>

        <WrapItem padding="25px 0px 0px 70px">
          {step3Valid == null && (
            <>
              <Button
                colorPalette="cyan"
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
