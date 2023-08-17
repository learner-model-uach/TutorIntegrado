import { Button, ButtonGroup } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "../components/Auth";
import { LoadContent } from "../components/tutorWordProblems/LoadExercise";
import { useExerciseStore } from "../components/tutorWordProblems/store/store";

export default function WpExercises() {
  const { user } = useAuth();
  const { setExercise, exerciseIds, currentExercise, nextExercise } = useExerciseStore();

  console.log("USER-->", user);

  useEffect(() => {
    if (user) {
      let newExerciseIds = [];
      if (user?.groups?.some(group => group?.code === "groupWPA")) {
        newExerciseIds = ["wp1", "wp2", "wp3"];
      } else if (user?.groups?.some(group => group?.code === "groupWPB")) {
        newExerciseIds = ["wp2", "wp3", "wp4"];
      } else if (user?.groups?.some(group => group?.code === "groupWPC")) {
        newExerciseIds = ["wp3", "wp4", "wp5"];
      } else if (user?.groups?.some(group => group?.code === "groupWPD")) {
        newExerciseIds = ["wp4", "wp5", "wp1"];
      } else if (user?.groups?.some(group => group?.code === "groupWPE")) {
        newExerciseIds = ["wp5", "wp1", "wp2"];
      } else {
        newExerciseIds = ["wp3"];
      }

      setExercise(newExerciseIds);
    }
  }, []);

  console.log("exercises:", exerciseIds);
  console.log("First exercise:", exerciseIds[currentExercise]);

  return (
    <>
      {user &&
        (user.groups.some(group => group.code === "groupWPA") ? (
          <h1>Bienvenido grupo A </h1>
        ) : user.groups.some(group => group.code === "groupWPB") ? (
          <h1>Bienvenido grupo B </h1>
        ) : user.groups.some(group => group.code === "groupWPC") ? (
          <h1>Bienvenido grupo C </h1>
        ) : user.groups.some(group => group.code === "groupWPD") ? (
          <h1>Bienvenido grupo D </h1>
        ) : user.groups.some(group => group.code === "groupWPE") ? (
          <h1>Bienvenido grupo E </h1>
        ) : (
          <h1>otro grupo</h1>
        ))}
      <LoadContent code={exerciseIds[currentExercise]}></LoadContent>
      <ButtonGroup>
        <Link href="showContent">
          <Button onClick={() => nextExercise()}> Comenzar!</Button>
        </Link>
      </ButtonGroup>
    </>
  );
}
