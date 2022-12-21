import React, { useEffect, useState, useContext } from "react";
import { Button, Stack, Link } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import problems from "../../practiceproblem.json";
import { AccordionSteps } from "./Accordion/AccordionSteps";
import { Feedback } from "./Feedbacks/Feedback";
import { SortStepsTest } from "./SortSteps/SortStepsTest";
import { NEXT_STEP_BUTTOM_NAME, NEXT_EXERCISE_BUTTOM_NAME } from "../../types";
import { useAction } from "../../utils/action";
import { useAuth } from "../Auth";
import ExerciseContext from "../../context/exercise/exerciseContext";
import { useRouter } from "next/router";

export function TutorTesting({
  id,
  setTabIndex,
  setColorTab,
  setShowFeedback,
}) {
  const [idExercise, setIdExercise] = useState(id % 14);
  const [exerciseSelected, setExerciseSelected] = useState(null);
  const [totalSteps, setTotalSteps] = useState(0);
  const [disableState, setDisableState] = useState([true]);
  const [nextExercise, setNextExercise] = useState(false);
  const [orderFirst, setOrderFirst] = useState(null);
  const [showOrder, setShowOrder] = useState(null);
  const [nextPhase, setNextPhase] = useState(true);

  const exerciseContext = useContext(ExerciseContext);
  const { settingContent } = exerciseContext;
  const { push } = useRouter();

  const startAction = useAction({});

  useEffect(() => {
    setIdExercise(id % 14);
    const selet = problems.filter(
      (exercise) => exercise.id === parseInt(idExercise)
    );
    settingContent(selet[0]?.content);
    startAction({
      verbName: "loadContent",
      contentID: selet[0]?.content,
    });
    setOrderFirst(selet[0].order_steps.position === "initial");
    setShowOrder(selet[0].order_steps.show);
    setNextPhase(true);
    setExerciseSelected(selet[0]);
    setTotalSteps(selet[0].steps.length);
    setDisableState([true]);
    setNextExercise(false);
  }, [id]);

  const handlerNextExercise = (e) => {
    e.preventDefault();
    startAction({
      verbName: "nextContent",
    });
    if (id < 7) {
      setTabIndex((prev) => prev + 1);
    } else {
      setShowFeedback(true);
    }
    setColorTab((prev) => [
      ...prev.slice(0, id),
      "#91e87b",
      ...prev.slice(id + 1),
    ]);
  };
  return (
    <>
      {exerciseSelected && (
        <>
          <Stack
            textAlign="center"
            fontSize={{ base: "15px", sm: "20px", lg: "25px" }}
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
            {showOrder ? (
              orderFirst ? (
                nextPhase ? (
                  <SortStepsTest
                    steps={exerciseSelected.steps}
                    setNextPhase={setNextPhase}
                    linkNext={false}
                    content={exerciseSelected.content}
                    setTabIndex={setTabIndex}
                    setColorTab={setColorTab}
                    setShowFeedback={setShowFeedback}
                  />
                ) : (
                  <>
                    <AccordionSteps
                      exercise={exerciseSelected}
                      setNextExercise={setNextExercise}
                    />
                    {nextExercise && (
                      <>
                        {exerciseSelected.content !== "sys_eq0" &&
                          exerciseSelected.content !== "sys_eq1" && (
                            <Feedback />
                          )}
                        <Button
                          marginRight="12px"
                          fontSize={{
                            base: "11px",
                            sm: "13px",
                            lg: "16px",
                          }}
                          colorScheme="blue"
                          onClick={handlerNextExercise}
                          style={{ float: "right" }}
                        >
                          {NEXT_EXERCISE_BUTTOM_NAME}
                        </Button>
                      </>
                    )}
                  </>
                )
              ) : nextPhase ? (
                <>
                  <AccordionSteps
                    exercise={exerciseSelected}
                    setNextExercise={setNextExercise}
                  />
                  {nextExercise && (
                    <>
                      {exerciseSelected.content !== "sys_eq0" &&
                        exerciseSelected.content !== "sys_eq1" && <Feedback />}

                      <Button
                        marginRight="12px"
                        fontSize={{
                          base: "11px",
                          sm: "13px",
                          lg: "16px",
                        }}
                        colorScheme="blue"
                        onClick={() => setNextPhase((prev) => !prev)}
                        style={{ float: "right" }}
                      >
                        {NEXT_STEP_BUTTOM_NAME}
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <SortStepsTest
                  steps={exerciseSelected.steps}
                  setIdExercise={setIdExercise}
                  linkNext={true}
                  content={exerciseSelected.content}
                  idExercise={idExercise}
                  setTabIndex={setTabIndex}
                  setColorTab={setColorTab}
                  setShowFeedback={setShowFeedback}
                />
              )
            ) : (
              <>
                <AccordionSteps
                  exercise={exerciseSelected}
                  setNextExercise={setNextExercise}
                />
                {nextExercise && (
                  <>
                    {exerciseSelected.content !== "sys_eq0" &&
                      exerciseSelected.content !== "sys_eq1" && <Feedback />}
                    <Button
                      marginRight="12px"
                      fontSize={{
                        base: "11px",
                        sm: "13px",
                        lg: "16px",
                      }}
                      colorScheme="blue"
                      onClick={handlerNextExercise}
                      style={{ float: "right" }}
                    >
                      {NEXT_EXERCISE_BUTTOM_NAME}
                    </Button>
                  </>
                )}
              </>
            )}
          </Stack>
        </>
      )}
    </>
  );
}
