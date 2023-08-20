import { Box, Button, ButtonGroup, Divider, ListItem, Text, UnorderedList } from "@chakra-ui/react";
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
      //console.log("exercises:", exerciseIds);
      //console.log("First exercise:", exerciseIds[currentExercise]);
    }
  }, []);

  return (
    <Box w="90%" marginX="auto">
      {user &&
        (user.groups.some(group => group.code === "groupWPA") ? (
          <Text fontSize="2xl" fontWeight="semibold">
            Perteneces al Grupo A{" "}
          </Text>
        ) : user.groups.some(group => group.code === "groupWPB") ? (
          <Text fontSize="2xl" fontWeight="semibold">
            Perteneces al Grupo B{" "}
          </Text>
        ) : user.groups.some(group => group.code === "groupWPC") ? (
          <Text fontSize="2xl" fontWeight="semibold">
            Perteneces al Grupo C{" "}
          </Text>
        ) : user.groups.some(group => group.code === "groupWPD") ? (
          <Text fontSize="2xl" fontWeight="semibold">
            Perteneces al Grupo D{" "}
          </Text>
        ) : user.groups.some(group => group.code === "groupWPE") ? (
          <Text fontSize="2xl" fontWeight="semibold">
            Perteneces al Grupo E{" "}
          </Text>
        ) : (
          <h1>otro grupo</h1>
        ))}
      <Divider></Divider>
      <br />
      <Text fontWeight="semibold"> Instrucciones generales:</Text>
      <br />
      <UnorderedList>
        <ListItem fontWeight="semibold"> Paso 1: Comenzar resolución de ejercicios</ListItem>
        <Text>
          Para comenzar a resolver los ejercicios presiona el boton{" "}
          <Button size="xs" _focus={{}}>
            Comenzar
          </Button>
          . Esto cargara el primer ejercicio que debes resolver
        </Text>

        <ListItem fontWeight="semibold">Paso 2: Completar el Cuestionario</ListItem>
        <Text>
          Una vez que hayas terminado de resolver el primer ejercicio, procede a responder el
          cuestionario en la hoja N° 2.
        </Text>

        <ListItem fontWeight="semibold">Paso 3: Avanzar al Segundo Ejercicio</ListItem>
        <Text>
          Después de completar el cuestionario, presiona el botón{" "}
          <Button size="xs" _focus={{}}>
            Sigueinte
          </Button>{" "}
          que se encuentra al final de cada ejercicio. Esto te llevará al siguiente ejercicio que
          debes resolver.
        </Text>

        <ListItem fontWeight="semibold">Paso 4: Completar el Cuestionario</ListItem>
        <Text>
          Una vez que hayas terminado de resolver el segundo ejercicio, responde el cuestionario en
          la hoja N° 3.
        </Text>

        <ListItem fontWeight="semibold">Paso 5: Avanzar al Tercer Ejercicio</ListItem>
        <Text>
          Después de responder al cuestionario, vuelve a presionar el botón{" "}
          <Button size="xs" _focus={{}}>
            Siguiente
          </Button>
          . Esto te permitirá cargar el tercer y último ejercicio.
        </Text>

        <ListItem fontWeight="semibold">Paso 6: Completar el cuestionario</ListItem>
        <Text>
          Al finalizar la resolución del tercer ejercicio, completa el cuestionario en la hoja N° 4.
        </Text>

        <ListItem fontWeight="semibold">Paso 7: Responder cuestionario general</ListItem>
        <Text>Finalmente, responde el cuestionario que abarca las hojas N° 5 a N° 7.</Text>
      </UnorderedList>
      <br />
      <br />
      <Divider></Divider>
      <Text>
        Obs: Puedes regresar a esta página en cualquier momento seleccionando el Tópico Ejercicios
        en Contexto. Ten en cuenta que al hacerlo, perderás el progreso del ejercicio que estés
        resolviendo en ese momento. No obstante, puedes retomar el ejercicio presionando nuevamente
        el botón{" "}
        <Button size="xs" _focus={{}}>
          Comenzar
        </Button>{" "}
        y avanzar con el botón{" "}
        <Button size="xs" _focus={{}}>
          Siguiente
        </Button>{" "}
        hasta el ejercicio que estabas resolviendo.
      </Text>
      <Text>
        {" "}
        <br />
        Cuanto estés listo para empezar a resolver los ejercicios presiona el botón Comenzar
        <br />
        <br />
      </Text>
      {isCompleted && <LoadContent code={exerciseIds[currentExercise]}></LoadContent>}
      <ButtonGroup>
        <Link href="showContent">
          <Button colorScheme="facebook"> Comenzar!</Button>
        </Link>
      </ButtonGroup>
    </Box>
  );
}
