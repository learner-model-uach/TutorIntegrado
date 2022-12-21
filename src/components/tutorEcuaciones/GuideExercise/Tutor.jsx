import React, { useEffect, useState } from "react";
import { Button, Stack } from "@chakra-ui/react";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import problems from "../../../problems.json";
import Link from "next/link";
import { AccordionSteps } from "./AccordionSteps";
import { FeedbackTutorial } from "../Feedbacks/FeedbackTutorial";

export function Tutor({ id, setIntro, intro }) {
  const [idExercise, setIdExercise] = useState(id % 14);
  const [exerciseSelected, setExerciseSelected] = useState(null);
  const [totalSteps, setTotalSteps] = useState(0);
  const [disableState, setDisableState] = useState([true]);
  const [nextExercise, setNextExercise] = useState(false);
  const [orderFirst, setOrderFirst] = useState(null);
  const [showOrder, setShowOrder] = useState(null);
  const [nextPhase, setNextPhase] = useState(true);
  useEffect(() => {
    setIdExercise(id % 14);
    const selet = problems.filter(
      (exercise) => exercise.id === parseInt(idExercise)
    );
    setOrderFirst(selet[0].order_steps.position === "initial");
    setShowOrder(selet[0].order_steps.show);
    setNextPhase(true);
    setExerciseSelected(selet[0]);
    setTotalSteps(selet[0].steps.length);
    setDisableState([true]);
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
            <TeX as="figcaption">
              {exerciseSelected && exerciseSelected.tittle}
            </TeX>
            <TeX
              math={exerciseSelected ? exerciseSelected.eqc : ""}
              as="figcaption"
            />
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
