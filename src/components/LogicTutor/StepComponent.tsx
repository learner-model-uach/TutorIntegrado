import React, { useEffect, useState } from "react";
import { Accordion } from "@chakra-ui/react";
import type { ExLog } from "./Tools/ExcerciseType2";
import "katex/dist/katex.min.css";
import { useAction } from "../../utils/action";
import ShowSteps from "./ShowSteps";

const StepComponent = ({ exc, nStep, topicId }: { exc: ExLog; nStep: number; topicId: string }) => {
  //console.log(exc?.code)
  //console.log("Sesion topic " + sessionState.topic)
  //console.log("current code "+sessionState.currentContent.code)
  const action = useAction();
  const [Step, setStep] = useState<number>(nStep ?? 0);
  //console.log("Valor Step Base: ", Step)
  useEffect(() => {
    action({
      verbName: "loadContent",
      contentID: exc.code,
      topicID: topicId,
    });
  }, [action, exc.code, topicId]);

  return (
    <>
      <Accordion.Root
        collapsible
        value={Step === -1 ? [] : [String(Step)]}
        onValueChange={({ value }) => {
          setStep(value.length ? parseInt(value[0], 10) : -1);
        }}
      >
        <ShowSteps exc={exc} nStep={nStep} setStep={setStep} topic={topicId} />
      </Accordion.Root>
    </>
  );
};

export default StepComponent;
