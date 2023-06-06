import React, { useEffect, useState } from "react";
import FCstep1 from "./steps/FCstep1";
import { MathComponent } from "../../../components/MathJax";
import { Loading } from "../tools/Spinner";
import Link from "next/link";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Alert,
  Box,
  Wrap,
  Spacer,
  Button,
  Stack,
} from "@chakra-ui/react";
import { FCsummary } from "../tools/Summary";
import { SelectStep } from "../tools/SelectStep";
import { useAction } from "../../../utils/action";
import { LoadContentAction } from "../tools/LoadContentAction";
import { sessionState } from "../../SessionState";

export const FC = ({ exercise, topic }) => {
  LoadContentAction(exercise); // report action loadContent
  const action = useAction(); //send action to central system
  const [step1Valid, setStep1Valid] = useState(null); //change the value "null" when step 1 is completed
  const [index, setIndex] = useState([0]); //list with to indexes of tabs open, initial 0 (only tab 1 open (step 1))
  const [select, setSelect] = useState(exercise.selectSteps); //select is true when step is chosen, false when not selectStep
  const steps = exercise.steps.map(i => i.stepTitle); //list of all stepTitle for selectStep
  const [loading, setLoading] = useState(true); //loading icon when not charge the math formula
  const extras = { steps: {} };
  const [extra1, setExtra1] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  extras.steps[0] = extra1;

  useEffect(() => {
    step1Valid &&
      action({
        verbName: "completeContent",
        contentID: exercise.code,
        topicID: topic,
        result: 1,
        extra: extras,
      });
  }, [step1Valid]);

  return (
    <div>
      <Heading as="h1" size="lg" noOfLines={3}>
        {exercise.title}
      </Heading>
      <Heading as="h5" size="sm" mt={2}>
        {exercise.text}
      </Heading>

      <Wrap justify="center">
        {loading && <Loading />}
        <MathComponent
          tex={exercise.steps[0].expression}
          display={true}
          onSuccess={loading && setLoading(false)}
        />
      </Wrap>

      <Accordion allowToggle allowMultiple index={index} style={{ padding: 0 }}>
        <AccordionItem isDisabled={select}>
          <Alert colorScheme={step1Valid == null ? "blue" : "green"}>
            <AccordionButton
              onClick={() => {
                if (index.some(element => element === 0) && !select) {
                  //closeTab
                  setIndex(index.filter(e => e !== 0));
                  action({
                    verbName: "closeStep",
                    stepID: "" + exercise?.steps[0]?.stepId,
                    contentID: exercise?.code,
                    topicID: topic,
                  });
                } else {
                  //no select= false (openTab)
                  setIndex(index.concat(0));
                  action({
                    verbName: "openStep",
                    stepID: "" + exercise?.steps[0]?.stepId,
                    contentID: exercise?.code,
                    topicID: topic,
                  });
                }
              }}
            >
              <Box flex="1" textAlign="left">
                {!select && exercise.steps[0].stepTitle}
                {step1Valid != null && !select && "    ✔ "}
                {select && (
                  <Wrap>
                    Paso 1:
                    <SelectStep
                      correct={0}
                      steps={steps}
                      setSelect={setSelect}
                      contentID={exercise.code}
                      topic={topic}
                    ></SelectStep>
                  </Wrap>
                )}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </Alert>
          <AccordionPanel style={{ padding: 0 }}>
            <>
              {!select && (
                <FCstep1
                  step1={exercise.steps[0]}
                  setStep1Valid={setStep1Valid}
                  step1Valid={step1Valid}
                  contentID={exercise.code}
                  topicID={sessionState.topic}
                  extra={extra1}
                  setExtra={setExtra1}
                ></FCstep1>
              )}
            </>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {step1Valid != null && (
        <>
          <FCsummary exercise={exercise.steps[0]} />
        </>
      )}
    </div>
  );
};
