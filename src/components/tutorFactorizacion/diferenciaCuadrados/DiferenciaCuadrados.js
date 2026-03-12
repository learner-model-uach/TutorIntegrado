import React, { useState, useEffect, useRef } from "react";
import { MathComponent } from "../../../components/MathJax";
import { BreadcrumbTutor } from "../tools/BreadcrumbTutor";
import { DCstep1 } from "./steps/DCstep1";
import { DCstep2 } from "./steps/DCstep2";
import { DCsummary } from "../tools/Summary";
import { Loading } from "../tools/Spinner";
import Link from "next/link";
import { Accordion, Box, Heading, Alert, Wrap, Center, Stack } from "@chakra-ui/react";
import { SelectStep } from "../tools/SelectStep";
import { useAction } from "../../../utils/action";
import { LoadContentAction } from "../tools/LoadContentAction";
import { sessionState } from "../../SessionState";

export const DC = ({ exercise, topic }) => {
  LoadContentAction(exercise); // report action loadContent

  const [step1Valid, setStep1Valid] = useState(null); //change the value "null" when step 1 is completed
  const [step2Valid, setStep2Valid] = useState(null); //change the value "null" when step 2 is completed
  const STEP1 = "step-1";
  const STEP2 = "step-2";

  // const [index, setIndex] = useState([0]); //list with to indexes of tabs open, initial 0 (only tab 1 open (step 1))
  const [openItems, setOpenItems] = useState([STEP1]);

  const [select, setSelect] = useState(exercise.selectSteps); //select is false when the student select the step 1 correct
  const [select2, setSelect2] = useState(exercise.selectSteps); //select is false when the student select the step 2 correct
  const steps = exercise.steps.map(i => i.stepTitle); //list of all stepTitle for selectStep
  const [loading, setLoading] = useState(true); //loading icon when not charge the math formula
  const action = useAction(); //send action to central system
  const extras = { steps: {} };
  const [extra1, setExtra1] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  const [extra2, setExtra2] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  extras.steps[0] = extra1;
  extras.steps[1] = extra2;

  // para detectar qué item se abrió/cerró cuando cambia el acordeón
  const prevOpenRef = useRef(openItems);

  useEffect(() => {
    step2Valid &&
      action({
        verbName: "completeContent",
        contentID: exercise.code,
        topicID: topic,
        result: 1,
        extra: extras,
      });
  }, [step2Valid]);

  useEffect(() => {
    //when step 1 is completed, open new tab of step 2
    if (step1Valid != null) {
      // setIndex([1]);
      setOpenItems([STEP2]);
    }
  }, [step1Valid]);

  // status válidos en v3: "info" | "success" | "warning" | "error"
  const step1Status = step1Valid == null ? "info" : "success";
  const step2Status = step2Valid == null ? "info" : "success";

  return (
    <>
      <Heading as="h1" size="lg" lineClamp={3}>
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

      {/* v3: Accordion.Root con multiple y collapsible con value={openItems} y onValueChange */}
      <Accordion.Root
        multiple
        collapsible
        value={openItems}
        onValueChange={e => {
          const prev = prevOpenRef.current;
          const next = e.value ?? [];
          setOpenItems(next);

          const closed = prev.filter(p => !next.includes(p));
          const opened = next.filter(n => !prev.includes(n));

          if (opened.includes(STEP1)) {
            action({
              verbName: "openStep",
              stepID: "" + exercise.steps[0].stepId,
              contentID: exercise.code,
              topicID: topic,
            });
          }

          if (closed.includes(STEP1)) {
            action({
              verbName: "closeStep",
              stepID: "" + exercise.steps[0].stepId,
              contentID: exercise.code,
              topicID: topic,
            });
          }

          if (opened.includes(STEP2) && step1Status != null) {
            action({
              verbName: "openStep",
              stepID: "" + exercise.steps[1].stepId,
              contentID: exercise.code,
              topicID: topic,
            });
          }
          if (closed.includes(STEP2) && step1Status != null) {
            action({
              verbName: "closeStep",
              stepID: "" + exercise.steps[1].stepId,
              contentID: exercise.code,
              topicID: topic,
            });
          }

          prevOpenRef.current = next;
        }}
        p="0"
      >
        {/* Step1 */}
        <Accordion.Item value={STEP1} disabled={select}>
          <Alert.Root status={step1Status}>
            <Accordion.ItemTrigger>
              <Box flex="1" textAlign="left" w="full">
                <Wrap>
                  <Center>
                    {!select && (
                      <>
                        {exercise.steps[0].stepTitle}&nbsp;&nbsp;
                        {step1Valid != null && "✔ "}
                      </>
                    )}

                    {select && (
                      <Wrap>
                        Paso 1:
                        <SelectStep
                          correct={0}
                          steps={steps}
                          setSelect={setSelect}
                          contentID={exercise.code}
                          topic={topic}
                        />
                      </Wrap>
                    )}
                  </Center>
                </Wrap>
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Alert.Root>

          <Accordion.ItemContent p="0">
            <Accordion.ItemBody>
              {!select && (
                <DCstep1
                  step1={exercise.steps[0]}
                  setStep1Valid={setStep1Valid}
                  step1Valid={step1Valid}
                  contentID={exercise.code}
                  topicID={topic}
                  extra={extra1}
                  setExtra={setExtra1}
                />
              )}
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Stept 2 */}
        <Accordion.Item value={STEP2} disabled={select2}>
          <Alert.Root status={step2Status}>
            <Accordion.ItemTrigger>
              <Box flex="1" textAlign="left" w="full">
                <Wrap>
                  <Center>
                    {!select2 && (
                      <>
                        {exercise.steps[1].stepTitle}
                        {step2Valid != null && " ✔"}
                      </>
                    )}

                    {select2 && step1Valid != null && (
                      <Wrap>
                        Paso 2:
                        <SelectStep
                          correct={1}
                          steps={steps}
                          setSelect={setSelect2}
                          contentID={exercise.code}
                          topic={topic}
                        />
                      </Wrap>
                    )}
                  </Center>
                </Wrap>
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Alert.Root>

          <Accordion.ItemContent p="0">
            <Accordion.ItemBody>
              {step1Valid != null && !select2 && (
                <DCstep2
                  step2={exercise.steps[step1Valid]}
                  setStep2Valid={setStep2Valid}
                  step2Valid={step2Valid}
                  contentID={exercise.code}
                  topicID={topic}
                  extra={extra2}
                  setExtra={setExtra2}
                />
              )}
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
      {step2Valid != null && (
        <>
          {/*complete content acá */}
          <DCsummary exercise={exercise} />
        </>
      )}
    </>
  );
};
