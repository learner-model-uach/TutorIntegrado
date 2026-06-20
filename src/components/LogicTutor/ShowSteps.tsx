import React, { useState, useEffect } from "react";
import { Box, Accordion, Alert } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Latex from "react-latex-next";
import type { ExLog } from "./Tools/ExcerciseType2";
import { FaHandPointRight } from "react-icons/fa";
import { useAction } from "../../utils/action";
import Summary from "./Summary";
import RatingQuestion from "../RatingQuestion";

const TrueFalse         = dynamic(() => import("./TrueFalse"), { ssr: false });
const Blank             = dynamic(() => import("./Blank"), { ssr: false });
const InputButtons      = dynamic(() => import("./InputButtons"), { ssr: false });
const Alternatives      = dynamic(() => import("./Alternatives"), { ssr: false });
const MultiplePlaceholders = dynamic(() => import("./MultiplePlaceholders"), { ssr: false });
const TableStep         = dynamic(() => import("./TableStep"), { ssr: false });
const SinglePlaceholder = dynamic(() => import("./SinglePlaceholder"), { ssr: false });

const extras = { steps: {} };

const ShowSteps = ({
  exc,
  nStep,
  setStep,
  topic,
  isEditorMode = false,
}: {
  exc: ExLog;
  nStep: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  topic: string;
  isEditorMode?: boolean;
}) => {
  const [completed, setCompleted] = useState(false);
  const next = parseInt(exc.steps[nStep].answers[0].nextStep);
  const [changed, setChanged] = useState(false);
  const _action = useAction();
  const action = isEditorMode ? () => {} : _action; // ✅
  const [report, setReport] = useState(true);
  const [color, setColor] = useState("accordion_step");
  const [textColor, setTexColor] = useState("accordion_step_text");

  useEffect(() => {
    if (completed && !changed) {
      setColor("accordion_success");
      setTexColor("accordion_success_text");
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

  // prop común para todos los step components
  const stepProps = { exc, nStep, setCompleted, topic, isEditorMode };

  return (
    <>
      <Accordion.Item value={String(nStep)} w="100%" border="none">
        <Accordion.ItemTrigger
          bg={color} color={textColor}
          px={{ base: 3, md: 4 }} py={{ base: 3, md: 2 }}
          alignItems={{ base: "flex-start", md: "center" }}
        >
          <Box p={3}><FaHandPointRight /></Box>
          <Box as="span" flex="1" textAlign="left" whiteSpace="normal" wordBreak="break-word">
            <Latex>{exc.steps[nStep].stepTitle}</Latex>
          </Box>
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>

        <Accordion.ItemContent>
          <Accordion.ItemBody px={{ base: 3, md: 4 }} pb={8} zIndex={nStep}>
            {/* isEditorMode propagado a todos los stepTypes */}
            {exc.steps[nStep].stepType === "TrueFalse"            && <TrueFalse            {...stepProps} />}
            {exc.steps[nStep].stepType === "Blank"                && <Blank                {...stepProps} />}
            {exc.steps[nStep].stepType === "Alternatives"         && <Alternatives         {...stepProps} />}
            {exc.steps[nStep].stepType === "InputButtons"         && <InputButtons         {...stepProps} />}
            {exc.steps[nStep].stepType === "MultiplePlaceholders" && <MultiplePlaceholders {...stepProps} />}
            {exc.steps[nStep].stepType === "SinglePlaceholder"    && <SinglePlaceholder    {...stepProps} />}
            {exc.steps[nStep].stepType === "TableStep"            && <TableStep            {...stepProps} />}
          </Accordion.ItemBody>
        </Accordion.ItemContent>
      </Accordion.Item>

      {completed && next === -1 ? (
        <>
          <Alert.Root status="success">
            <Alert.Indicator />
            <Alert.Content><Alert.Description>Ejercicio Terminado</Alert.Description></Alert.Content>
          </Alert.Root>
          <Summary exc={exc} />
          <RatingQuestion />
        </>
      ) : completed && next !== -1 ? (
        // isEditorMode propagado a la llamada recursiva
        <ShowSteps exc={exc} nStep={next} setStep={setStep} topic={topic} isEditorMode={isEditorMode} />
      ) : null}
    </>
  );
};

export default ShowSteps;