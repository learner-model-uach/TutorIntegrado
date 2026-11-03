import React, { useEffect, useState } from "react";
import { Stack } from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import problems from "../../../problems.json";
import { AccordionSteps } from "./AccordionSteps";
import { FeedbackTutorial } from "../Feedbacks/FeedbackTutorial";

export function Tutor({ id, setIntro, intro }) {
  const [exerciseSelected, setExerciseSelected] = useState(null);
  const [nextExercise, setNextExercise] = useState(false);

  useEffect(() => {
    const nextExerciseId = id % 14;
    const selectedExercise = problems.find(exercise => exercise.id === nextExerciseId);
    setExerciseSelected(selectedExercise ?? null);
    setNextExercise(false);
  }, [id]);

  return (
    <>
      {exerciseSelected && (
        <>
          <Stack
            textAlign="center"
            fontSize={{ base: "15px", sm: "20px", lg: "25px" }}
            className="eq-exercise"
          >
            <TeX as="figcaption">{exerciseSelected && exerciseSelected.tittle}</TeX>
            <TeX math={exerciseSelected ? exerciseSelected.eqc : ""} as="figcaption" />
          </Stack>
          <Stack marginTop="20px">
            <AccordionSteps
              intro={intro}
              setIntro={setIntro}
              exercise={exerciseSelected}
              setNextExercise={setNextExercise}
            />
            {nextExercise && (
              <>
                <FeedbackTutorial showFeedback={true} />
              </>
            )}
          </Stack>
        </>
      )}
    </>
  );
}
