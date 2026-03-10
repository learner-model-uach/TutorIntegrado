import React, { useState, useEffect } from "react";
import {
  Box,
  Accordion,
  Alert,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Latex from "react-latex-next";
import type { ExLog } from "./Tools/ExcerciseType2";
import { FaHandPointRight } from "react-icons/fa";
import { useAction } from "../../utils/action";
import Summary from "./Summary";
import RatingQuestion from "../RatingQuestion";

const TrueFalse = dynamic(() => import("./TrueFalse"), { ssr: false });
const Blank = dynamic(() => import("./Blank"), { ssr: false });
const InputButtons = dynamic(() => import("./InputButtons"), { ssr: false });
const Alternatives = dynamic(() => import("./Alternatives"), { ssr: false });
const MultiplePlaceholders = dynamic(() => import("./MultiplePlaceholders"), { ssr: false });
const TableStep = dynamic(() => import("./TableStep"), { ssr: false });
const SinglePlaceholder = dynamic(() => import("./SinglePlaceholder"), { ssr: false });

const extras = { steps: {} };

const ShowSteps = ({
  exc,
  nStep,
  Step,
  setStep,
  topic,
}: {
  exc: ExLog;
  nStep: number;
  Step: any;
  setStep: any;
  topic: string;
}) => {
  const [completed, setCompleted] = useState(false);
  const next = parseInt(exc.steps[nStep].answers[0].nextStep);
  const [changed, setChanged] = useState(false);
  const action = useAction();
  const [report, setReport] = useState(true);
  const [color, setColor] = useState("#bee3f8");

  useEffect(() => {
    if (completed && !changed) {
      setColor("#C6F6D5");
      if (next !== -1) setStep(next);
      if (report) {
        action({
          verbName: "completeContent",
          contentID: exc.code,
          topicID: topic,
          result: 1,
          extra: extras,
        });
        setReport(false);
      }
      setChanged(true);
    }
  }, [completed, changed, next, setStep, report, action, exc.code, topic]);

  return (
    <Accordion.Item value={String(nStep)}>
      <Accordion.ItemTrigger
        style={{ backgroundColor: color }}
        onClick={() => {
          setStep((prev: number) => (prev === nStep ? -1 : nStep));
        }}
      >
        <Box
          as="span"
          flex="1"
          textAlign="center"
          fontSize={{ base: "12px", sm: "15px", lg: "20px" }}
        >
          <Box mr={1}>
            <FaHandPointRight />
            <Latex>{exc.steps[nStep].stepTitle}</Latex>
          </Box>
        </Box>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>

      <Accordion.ItemContent>
        <Accordion.ItemBody pb={8} zIndex={nStep}>
          {exc.steps[nStep].stepType === "TrueFalse" && (
            <TrueFalse exc={exc} nStep={nStep} setCompleted={setCompleted} topic={topic} />
          )}
          {exc.steps[nStep].stepType === "Blank" && (
            <Blank exc={exc} nStep={nStep} setCompleted={setCompleted} topic={topic} />
          )}
          {exc.steps[nStep].stepType === "Alternatives" && (
            <Alternatives exc={exc} nStep={nStep} setCompleted={setCompleted} topic={topic} />
          )}
          {exc.steps[nStep].stepType === "InputButtons" && (
            <InputButtons exc={exc} nStep={nStep} setCompleted={setCompleted} topic={topic} />
          )}
          {exc.steps[nStep].stepType === "MultiplePlaceholders" && (
            <MultiplePlaceholders exc={exc} nStep={nStep} setCompleted={setCompleted} topic={topic} />
          )}
          {exc.steps[nStep].stepType === "SinglePlaceholder" && (
            <SinglePlaceholder exc={exc} nStep={nStep} setCompleted={setCompleted} topic={topic} />
          )}
          {exc.steps[nStep].stepType === "TableStep" && (
            <TableStep exc={exc} nStep={nStep} setCompleted={setCompleted} topic={topic} />
          )}
        </Accordion.ItemBody>
      </Accordion.ItemContent>

      {completed && next === -1 ? (
        <>
          <Alert.Root status="success">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>Ejercicio Terminado</Alert.Description>
            </Alert.Content>
          </Alert.Root>
          <Summary exc={exc} />
          <RatingQuestion />
        </>
      ) : completed && next !== -1 ? (
        <ShowSteps exc={exc} nStep={next} Step={Step} setStep={setStep} topic={topic} />
      ) : null}
    </Accordion.Item>
  );
};

export default ShowSteps;
