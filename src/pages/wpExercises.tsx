import { Box, Button, ButtonGroup, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../components/Auth";
import { LoadContent } from "../components/tutorWordProblems/LoadExercise";
import { useExerciseStore } from "../components/tutorWordProblems/store/store";

export default function WpExercises() {
  const { user } = useAuth();
  const { setExercise, exerciseIds, currentExercise, resetCurrectExercise } = useExerciseStore();
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    console.log("USER-->", user);
    resetCurrectExercise();
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
      setIsCompleted(true);
      console.log("exercises:", exerciseIds);
      console.log("First exercise:", exerciseIds[currentExercise]);
    }
  }, []);

  return (
    <Box w="70%" marginX="auto">
      {user &&
        (user.groups.some(group => group.code === "groupWPA") ? (
          <h1>Grupo A </h1>
        ) : user.groups.some(group => group.code === "groupWPB") ? (
          <h1>Grupo B </h1>
        ) : user.groups.some(group => group.code === "groupWPC") ? (
          <h1>Grupo C </h1>
        ) : user.groups.some(group => group.code === "groupWPD") ? (
          <h1>Grupo D </h1>
        ) : user.groups.some(group => group.code === "groupWPE") ? (
          <h1>Grupo E </h1>
        ) : (
          <h1>otro grupo</h1>
        ))}
      <Heading>¡Bienvenido {user?.name}!</Heading>
      <Text>
        {" "}
        <br /> Te damos la bienvenida a esta sesión de prueba. Tu participación es esencial para
        nosotros. Durante esta sesión, te presentaremos tres ejercicios matemátcos que te permitirán
        explorar y aplicar tus habilidades. Después de resolver cada ejercicio, te pediremos que
        respondas a una breve encuesta para obtener tus comentarios y opiniones.
        <br /> <br /> Una vez hayas completado los tres ejercicios y las encuestas correspondientes,
        te pediremos que respondas a una última encuesta general. <br /> <br /> Tu contribución nos
        ayudará a mejorar y perfeccionar nuestro contenido para futuros estudiantes. <br /> <br />{" "}
        ¡Gracias por participar!
      </Text>
      <Text>
        {" "}
        <br />
        Cuanto estes listo preciona el boton Comenzar
      </Text>
      {isCompleted && <LoadContent code={exerciseIds[currentExercise]}></LoadContent>}
      <ButtonGroup>
        <Link href="showContent">
          <Button> Comenzar!</Button>
        </Link>
      </ButtonGroup>
    </Box>
  );
}
