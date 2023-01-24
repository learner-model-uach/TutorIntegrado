import React, { useEffect, useState, useContext } from "react";
import { Button, Stack, Link } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import problems from "./practiceproblem.json";
import { AccordionSteps } from "./Accordion/AccordionSteps";
import { Feedback } from "./Feedbacks/Feedback";
import { SortSteps } from "./SortSteps/SortSteps";
import { NEXT_STEP_BUTTOM_NAME, NEXT_EXERCISE_BUTTOM_NAME } from "./types";
import { useAction } from "../../utils/action";
import { useAuth } from "../Auth";
import ExerciseContext from "./context/exercise/exerciseContext";
import { useRouter } from "next/router";

export function Tutor({ id }) {
  const [idExercise, setIdExercise] = useState(id % 2); // For now, two exercises are being used with the fields of the correct json files.
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
    // json file has no id field
    /*setIdExercise(id % 14); 
    const selet = problems.filter(
      (exercise) => exercise.id === parseInt(idExercise)
    );*/

	// For now, two exercises are being used with the fields of the correct json files.
    let selet = [];
    if (id === 0) {
      selet.push(problems[0]);
    };
    if (id === 6) {
      selet.push(problems[1]);
    };
	
    settingContent(selet[0]?.code); // useContext is not reused
    startAction({
      verbName: "loadContent",
      contentID: selet[0]?.code, // "code" field of the json file
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
    // For now, two exercises are being used with the fields of the correct json files.
    setIdExercise((prev) => (idExercise % 2) + 1);
    push(`/exercise/${(idExercise % 2) + 1}`);
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
                  <SortSteps
                    steps={exerciseSelected.steps}
                    setNextPhase={setNextPhase}
                    linkNext={false}
                  />
                ) : (
                  <>
                    <AccordionSteps
                      exercise={exerciseSelected}
                      id={id}
                      setNextExercise={setNextExercise}
                    />
                    {nextExercise && (
                      <>
                        <Feedback />
                        <Link href={`/exercise/${(idExercise % 14) + 1}`}>
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
                        </Link>
                      </>
                    )}
                  </>
                )
              ) : nextPhase ? (
                <>
                  <AccordionSteps
                    exercise={exerciseSelected}
                    id={id}
                    setNextExercise={setNextExercise}
                  />
                  {nextExercise && (
                    <>
                      <Feedback />

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
                <SortSteps
                  steps={exerciseSelected.steps}
                  setIdExercise={setIdExercise}
                  linkNext={true}
                  idExercise={idExercise}
                />
              )
            ) : (
              <>
                <AccordionSteps
                  exercise={exerciseSelected}
                  id={id}
                  setNextExercise={setNextExercise}
                />
                {nextExercise && (
                  <>
                    <Feedback />
                    <Link href={`/exercise/${(idExercise % 14) + 1}`}>
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
                    </Link>
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
