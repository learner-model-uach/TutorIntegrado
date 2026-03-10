import React, { useState, useEffect } from "react";
import { MathComponent } from "../../../components/MathJax";
import FCCstep1 from "./steps/FCCstep1";
import FCCstep2 from "./steps/FCCstep2";
import FCstep1 from "../factorComun/steps/FCstep1";
import { BreadcrumbTutor } from "../tools/BreadcrumbTutor";
import { FCCsummary } from "../tools/Summary";
import { Loading } from "../tools/Spinner";
import { SelectStep } from "../tools/SelectStep";
import Link from "next/link";
import { Accordion, Heading, Box, Alert, Wrap } from "@chakra-ui/react";
import { useAction } from "../../../utils/action";
import { LoadContentAction } from "../tools/LoadContentAction";
import { sessionState } from "../../SessionState";

export const FCC = ({ exercise, topic }) => {
  LoadContentAction(exercise); // report action loadContent
  const [step1Valid, setStep1Valid] = useState(null); //change the value "null" when step 1 is completed
  const [step2Valid, setStep2Valid] = useState(null); //change the value "null" when step 2 is completed
  const [step3Valid, setStep3Valid] = useState(null); //change the value "null" when step 3 is completed

  //v3: Accordion se controla por value (strings)
  const STEP1 = "step-1";
  const STEP2 = "step-2";
  const STEP3 = "step-3";
  const [openItems, setOpenItems] = useState([STEP1]);

  const [select, setSelect] = useState(exercise.selectSteps); //select is false when the student select the step 1 correct
  const [select2, setSelect2] = useState(exercise.selectSteps); //select is false when the student select the step 2 correct
  const [select3, setSelect3] = useState(exercise.selectSteps); //select is false when the student select the step 3 correct
  const steps = exercise.steps.map(i => i.stepTitle); //list of all stepTitle for selectStep
  const [loading, setLoading] = useState(true); //loading icon when not charge the math formula
  const action = useAction(); //send action to central system
  const extras = { steps: {} };
  const [extra1, setExtra1] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  const [extra2, setExtra2] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  const [extra3, setExtra3] = useState({ att: 0, hints: 0, lastHint: false, duration: 0 });
  extras.steps[0] = extra1;
  extras.steps[1] = extra2;
  extras.steps[2] = extra3;
  useEffect(() => {
    step3Valid &&
      action({
        verbName: "completeContent",
        contentID: exercise.code,
        topicID: topic,
        result: 1,
        extra: extras,
      });
  }, [step3Valid]);

  useEffect(() => {
    //when step 1 is completed, open new tab of step 2
    if (step1Valid != null) setOpenItems([STEP2])
  }, [step1Valid]);

  useEffect(() => {
    //when step 2 is completed, open new tab of step 3
    if (step2Valid != null) setOpenItems([STEP3]);
  }, [step2Valid]);

  //v3 map de status para Alert
  const step1Status = step1Valid == null ? "info" : "success";
  const step2Status = step2Valid == null ? (step1Valid == null ? "neutral" : "info") : "success";
  const step3Status = step3Valid == null ? (step2Valid == null ? "neutral" : "info") : "success";

  return (
    <>
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

      <Accordion.Root
        multiple
        collapsible
        value={openItems}
        p="0"
        onValueChange={e => {
          const next = Array.isArray(e) ? e : (e?.value ?? []);
          setOpenItems(prev => {
            const closed = prev.filter(p => !next.includes(p));
            const opened = next.filter(n => !prev.includes(n));

            if (opened.includes(STEP1) && !select) {
              action({
                verbName: "openStep",
                stepID: "" + exercise.steps[0].stepId,
                contentID: exercise.code, //leer del json
                topicID: topic,
              });
            }
            if (closed.includes(STEP1) && !select) {
              action({
                verbName: "closeStep",
                stepID: "" + exercise.steps[0].stepId,
                contentID: exercise.code,
                topicID: topic,
              });
            }

            if (opened.includes(STEP2) && step1Valid != null && !select2) {
              action({
                verbName: "openStep",
                stepID: "" + exercise.steps[1].stepId,
                contentID: exercise.code,
                topicID: topic,
              });
            }
            if (closed.includes(STEP2) && step1Valid != null && !select2) {
              action({
                verbName: "closeStep",
                stepID: "" + exercise.steps[1].stepId,
                contentID: exercise.code,
                topicID: topic,
              });
            }

            if (opened.includes(STEP3) && step2Valid != null && !select3) {
              action({
                verbName: "openStep",
                stepID: "" + exercise.steps[2].stepId,
                contentID: exercise.code,
                topicID: topic,
              });
            }
            if (closed.includes(STEP3) && step2Valid != null && !select3) {
              action({
                verbName: "closeStep",
                stepID: "" + exercise.steps[2].stepId,
                contentID: exercise.code,
                topicID: topic,
              });
            }
            return next;
          });
        }}
      >
        {/* Paso 1 */}
        <Accordion.Item value={STEP1} disabled={select}>
          <Alert.Root status={step1Status}>
            <Accordion.ItemTrigger>
              <Box flex="1" textAlign="left" w="100">
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
                    />
                  </Wrap>
                )}
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Alert.Root>

          <Accordion.ItemContent p="0">
            {!select && (
              <FCCstep1
                step1={exercise.steps[0]}
                setStep1Valid={setStep1Valid}
                step1Valid={step1Valid}
                stepId={"" + exercise.steps[0].stepId}
                contentID={exercise.code}
                topicID={topic}
                extra={extra1}
                setExtra={setExtra1}
              />
            )}
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Paso 2: */}
        <Accordion.Item disabled={select2} value={STEP2}>
          <Alert.Root status={step2Status}>
            <Accordion.ItemTrigger>
              <Box flex="1" textAlign="left" w="full">
                {!select2 && exercise.steps[1].stepTitle}
                {step2Valid != null && !select2 && "    ✔ "}
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
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Alert.Root>

          <Accordion.ItemContent p="0">
            {step1Valid != null && !select2 && (
              <FCCstep2
                step2={exercise.steps[step1Valid]}
                setStep2Valid={setStep2Valid}
                step2Valid={step2Valid}
                contentID={exercise.code}
                topicID={topic}
                extra={extra2}
                setExtra={setExtra2}
              />
            )}
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Paso 3 */}
        <Accordion.Item disabled={select3} value={STEP3}>
          <Alert.Root status={step3Status}>
            <Accordion.ItemTrigger>
              <Box flex="1" textAlign="left" w="full">
                {!select3 && exercise.steps[exercise.steps[1].answers[0].nextStep].stepTitle}
                {step3Valid != null && !select3 && "    ✔ "}
                {select3 && step2Valid != null && (
                  <Wrap>
                    Paso 3:
                    <SelectStep
                      correct={2}
                      steps={steps}
                      setSelect={setSelect3}
                      contentID={exercise.code}
                      topic={topic}
                    />
                  </Wrap>
                )}
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Alert.Root>

          <Accordion.ItemContent p="0">
            {step2Valid != null && !select3 && (
              <FCstep1
                step1={exercise.steps[step2Valid]}
                setStep1Valid={setStep3Valid}
                step1Valid={step3Valid}
                contentID={exercise.code}
                topicID={topic}
                extra={extra3}
                setExtra={setExtra3}
              />
            )}
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>

      {step3Valid != null && (
        <>
          <FCCsummary exercise={exercise} />
        </>
      )}
    </>
  );
};
