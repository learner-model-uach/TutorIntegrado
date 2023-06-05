import React, { useEffect, useState, useContext } from "react";
import { Button, Stack, Link } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import { AccordionSteps } from "./Accordion/AccordionSteps";
import { Feedback } from "./Feedbacks/Feedback";
import { SortSteps } from "./SortSteps/SortSteps";
import { NEXT_STEP_BUTTOM_NAME, NEXT_EXERCISE_BUTTOM_NAME } from "./types";
import { useAction } from "../../utils/action";
import { useAuth } from "../Auth";
import RatingQuestion from "../RatingQuestion";

export function Tutor({ exercise, topicId }) {
  const [idExercise, setIdExercise] = useState("");
  const [exerciseSelected, setExerciseSelected] = useState(null);
  const [totalSteps, setTotalSteps] = useState(0);
  const [disableState, setDisableState] = useState([true]);
  const [nextExercise, setNextExercise] = useState(false);
  const [orderFirst, setOrderFirst] = useState(null);
  const [showOrder, setShowOrder] = useState(null);
  const [nextPhase, setNextPhase] = useState(true);

  const startAction = useAction({});

  useEffect(() => {
    setIdExercise(exercise?.code);
    startAction({
      verbName: "loadContent",
      contentID: exercise?.code, // "code" field of the exercise
      topicID: topicId, // "id" field of the system
    });
    setOrderFirst(exercise?.order_steps.position === "initial");
    setShowOrder(exercise?.order_steps.show);
    setNextPhase(true);
    setExerciseSelected(exercise);
    setTotalSteps(exercise?.steps.length);
    setDisableState([true]);
    setNextExercise(false);
  }, [topicId]);

  const handlerNextExercise = e => {
    startAction({
      verbName: "nextContent",
    });
  };
  return (
    <>
      {exerciseSelected && (
        <>
          <Stack textAlign="center" fontSize={{ base: "15px", sm: "20px", lg: "25px" }}>
            <TeX as="figcaption">{exerciseSelected && exerciseSelected.title}</TeX>
            <TeX math={exerciseSelected ? exerciseSelected.eqc : ""} as="figcaption" />
          </Stack>
          <Stack marginTop="20px">
            {showOrder ? (
              orderFirst ? (
                nextPhase ? (
                  <SortSteps
                    steps={exerciseSelected.steps}
                    setNextPhase={setNextPhase}
                    linkNext={false}
                    code={exerciseSelected.code}
                  />
                ) : (
                  <>
                    <AccordionSteps
                      exercise={exerciseSelected}
                      topicId={topicId}
                      setNextExercise={setNextExercise}
                    />
                    {nextExercise && (
                      <>
                        <Feedback type={exerciseSelected.type} />
                        {
                          //<Link href={`/exercise/${(idExercise % 14) + 1}`}>
                        }
                        <Link href={`contentSelect`}>
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
                    topicId={topicId}
                    setNextExercise={setNextExercise}
                  />
                  {nextExercise && (
                    <>
                      <Feedback type={exerciseSelected.type} />

                      <Button
                        marginRight="12px"
                        fontSize={{
                          base: "11px",
                          sm: "13px",
                          lg: "16px",
                        }}
                        colorScheme="blue"
                        onClick={() => setNextPhase(prev => !prev)}
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
                  code={exerciseSelected.code}
                />
              )
            ) : (
              <>
                <AccordionSteps
                  exercise={exerciseSelected}
                  topicId={topicId}
                  setNextExercise={setNextExercise}
                />
                {nextExercise && (
                  <>
                    <Feedback type={exerciseSelected.type} />
                    <RatingQuestion />
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
