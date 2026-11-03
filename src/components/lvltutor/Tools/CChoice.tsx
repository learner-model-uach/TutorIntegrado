import {
  Box,
  RadioCard,
  HStack,
  Button,
  Alert,
  VStack,
  Text,
  Grid,
  GridItem,
  Center,
  SimpleGrid,
} from "@chakra-ui/react";
import Hint from "../../Hint";
import MQStaticMathField from "../../../utils/MQStaticMathField";
import { useSnapshot } from "valtio";
import type { option, Step } from "./ExcerciseType";
import { useState, useEffect } from "react";
import MQProxy from "./MQProxy";
import { useAction } from "../../../utils/action";

const Enabledhint = ({
  disablehint,
  step,
  latex,
  setLastHint,
}: {
  disablehint: boolean;
  step: Step;
  latex: string;
  setLastHint: (hint: boolean) => void;
}) => {
  const mqSnap = useSnapshot(MQProxy);

  const [error, setError] = useState(false);
  const [hints, setHints] = useState(0);

  useEffect(() => {
    MQProxy.error = error;
  }, [error]);

  useEffect(() => {
    setError(mqSnap.error);
  }, [mqSnap.error]);

  useEffect(() => {
    MQProxy.hints = hints;
  }, [hints]);

  if (disablehint) {
    return <></>;
  } else {
    return (
      <Hint
        hints={step.hints}
        contentId={mqSnap.content}
        topicId={mqSnap.topicId}
        stepId={step.stepId}
        matchingError={step.matchingError}
        response={[latex]}
        error={error}
        setError={setError}
        hintCount={hints}
        setHints={setHints}
        setLastHint={setLastHint}
      />
    );
  }
};

function handleAnswer(
  oans: option,
  ans: Array<option>,
  uans: string,
  attempts: number,
  stepid: string,
) {
  let correctAns = false;
  let at: "info" | "warning" | "success" | "error" | undefined;
  let output = {
    result: 0,
    attempts: attempts,
    alerttype: at,
    alertmsg: "potato",
    alerthidden: false,
  };

  for (var e of ans) if (e.correct && ("" + e.id).localeCompare(uans) == 0) correctAns = true;

  //console.log(validationType, correctAns);
  if (correctAns) {
    output.result = 1;
    MQProxy.endDate = Date.now();
    MQProxy.defaultIndex = [parseInt(stepid), parseInt(stepid) + 1];
    MQProxy.error = false;
  } else {
    output.result = 0;
    output.alerttype = "error";
    output.alertmsg = null;
    output.alerthidden = false;
    MQProxy.error = true;
  }
  if (oans != undefined) {
    if (oans.feedbackMsg != undefined) {
      output.alertmsg = oans.feedbackMsg;
      MQProxy.spaghettimsg = oans.feedbackMsg;
    } else {
      MQProxy.spaghettimsg = undefined;
    }
    if (oans.feedbackMsgExp != undefined) {
      MQProxy.spaghettimsgexp = oans.feedbackMsgExp;
    } else {
      MQProxy.spaghettimsgexp = undefined;
    }
  }

  MQProxy.submit = true;
  output.attempts = attempts + 1;

  return output;
}

function ChoiceContent({ option, id }: { option: option; id: number }) {
  let text = option.text;
  let exp = option.expression;
  return (
    <VStack
      key={"CCVS" + id}
      alignItems="center"
      alignContent="center"
      className="lvltutor-choice-content"
    >
      {text ? (
        <Text key={"CCT" + id} className="lvltutor-choice-text">
          {text}{" "}
        </Text>
      ) : null}
      {exp ? <MQStaticMathField key={"CCL" + id} exp={exp} currentExpIndex={true} /> : null}
    </VStack>
  );
}

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
function CChoice({
  step,
  content,
  topicId,
  disablehint,
  options,
}: {
  step: Step;
  content: string;
  topicId: string;
  disablehint: boolean;
  options: Array<option>;
}) {
  // const answer = useRef("react");
  const [value, setValue] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [alertType, setAlertType] = useState<
    "info" | "warning" | "success" | "error" | undefined
  >();
  const [alertMsg, setAlertMsg] = useState("");
  const [alertHidden, setAlertHidden] = useState(true);
  const [lastHint, setLastHint] = useState(false);
  const action = useAction();

  return (
    <>
      <RadioCard.Root
        name="mathchoice"
        size={"md"}
        value={value ?? undefined}
        onValueChange={({ value }) => setValue(value)}
        variant="surface"
        colorPalette="teal"
        className="lvltutor-choice-root"
      >
        <SimpleGrid
          columns={[1, 1, 1, 2]}
          columnGap="2"
          rowGap="2"
          className="lvltutor-choice-list"
        >
          {options.map(v => (
            <RadioCard.Item key={v.id} value={String(v.id)} className="lvltutor-choice-item">
              <RadioCard.ItemHiddenInput />
              <RadioCard.ItemControl cursor={"pointer"} className="lvltutor-choice-control">
                <RadioCard.ItemIndicator className="lvltutor-choice-indicator" />
                <RadioCard.ItemText className="lvltutor-choice-label">
                  <ChoiceContent option={v} id={v.id} />
                </RadioCard.ItemText>
              </RadioCard.ItemControl>
            </RadioCard.Item>
          ))}
        </SimpleGrid>
      </RadioCard.Root>
      <HStack gap="4px" alignItems="center" justifyContent="center" margin={"auto"} padding="4">
        <Box>
          <Button
            colorPalette="teal"
            height={"32px"}
            width={"88px"}
            onClick={() => {
              const selected = value ?? "";
              let ans = handleAnswer(
                step.multipleChoice.find(e => String(e.id) === selected)!,
                step.multipleChoice,
                selected,
                attempts,
                step.stepId,
              );

              let ansv = "";
              for (let e of step.multipleChoice)
                if (("" + e.id).localeCompare(selected) == 0) {
                  if (e.expression) ansv = e.expression;
                  else ansv = e.text;
                }
              setAttempts(ans.attempts);
              setAlertType(ans.alerttype);
              if (ans.alertmsg) setAlertMsg(ans.alertmsg);
              else setAlertMsg(step.incorrectMsg);
              setAlertHidden(ans.alerthidden);
              action({
                verbName: "tryStep",
                stepID: "" + step.stepId,
                contentID: content,
                topicID: topicId,
                result: ans.result,
                kcsIDs: step.KCs,
                extra: {
                  response: [ansv],
                  attempts: attempts,
                  hints: MQProxy.hints,
                },
              });
              MQProxy.submitValues = {
                ans: ansv,
                att: attempts,
                hints: MQProxy.hints,
                lasthint: lastHint,
                fail: ans.result ? false : true,
                duration: 0,
              };
            }}
          >
            Enviar
          </Button>
        </Box>
        <Enabledhint
          disablehint={disablehint}
          step={step}
          latex={value ?? ""}
          setLastHint={setLastHint}
        />
      </HStack>
      <Alert.Root key={`Alert${topicId}i`} status={alertType} mt={2} hidden={alertHidden}>
        <Alert.Content>
          <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(20, 1fr)">
            <GridItem rowSpan={1} colSpan={1}>
              <Alert.Indicator key={`AlertIcon${topicId}i`} />
            </GridItem>
            <GridItem rowSpan={1} colSpan={19}>
              <Text alignSelf={"left"} alignItems="start">
                {"¡Inténtalo nuevamente! (intentos: " + attempts + ") " + alertMsg}
              </Text>
            </GridItem>
            <GridItem rowSpan={1} colSpan={20}>
              {MQProxy.spaghettimsgexp ? (
                <Center>
                  <MQStaticMathField exp={MQProxy.spaghettimsgexp} currentExpIndex={true} />
                </Center>
              ) : null}
            </GridItem>
          </Grid>
        </Alert.Content>
      </Alert.Root>
    </>
  );
}

//Fisher-yates shuffle algorithm
//https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle

function fishyShuffle(options: Array<option>) {
  let arr = options;
  let l = arr.length;
  for (let i = l - 1; i > 0; i--) {
    let s = Math.floor(Math.random() * l);
    let t = arr[s];
    arr[s] = arr[i];
    arr[i] = t;
  }
  console.log("a", arr);
  return arr;
}

function ShuffledLoad({
  step,
  content,
  topicId,
  disablehint,
}: {
  step: Step;
  content: string;
  topicId: string;
  disablehint: boolean;
}) {
  //deepcopy
  var d = JSON.stringify(step);
  var dd = JSON.parse(d);
  return (
    <CChoice
      step={step}
      content={content}
      topicId={topicId}
      disablehint={disablehint}
      options={fishyShuffle(dd.multipleChoice)}
    />
  );
}

export default ShuffledLoad;
