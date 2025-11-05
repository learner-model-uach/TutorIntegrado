// /pages/quickPlay.tsx — versión Chakra v1
import React, { useEffect, useState } from "react";
import { Button, VStack, Image, Text, ScaleFade, Center } from "@chakra-ui/react";
import Plain from "../components/lvltutor/Plain";
import Pizarra from "../components/tutorPizarra/tutorPizarra";
import { sessionState } from "../components/SessionState";
import type { ExType } from "../components/lvltutor/Tools/ExcerciseType";
import TypeText from "../components/tutorPizarra/TypeText";

// ⬇️ Grupos de ejercicios
import { exerciseGroups } from "../components/tutorPizarra/exercisesConfig";

const QuickPlay = () => {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Lista de ejercicios activos para el grupo elegido
  const exercises = selectedGroup !== null ? exerciseGroups[selectedGroup] : [];

  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!exercises.length) return;

    const [exerciseJSON] = exercises[currentIndex];

    // Inicializar sessionState (Solver2)
    sessionState.currentContent = {
      id: exerciseJSON.code,
      code: exerciseJSON.code,
      label: exerciseJSON.title,
      description: exerciseJSON.text,
      kcs: exerciseJSON.steps.flatMap((step: any) => step.KCs || []),
      json: exerciseJSON,
      state: {},
    };

    // Callback para avanzar
    sessionState.callback = () => {
      if (currentIndex < exercises.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        console.log("¡Se completaron todos los ejercicios!");
        setIsFinished(true);
      }
    };
    sessionState.callbackType = "tutor";
  }, [currentIndex, selectedGroup]);

  // Pantalla de selección de grupo
  if (selectedGroup === null) {
    return (
      <VStack gap={4} mt={10}>
        {exerciseGroups.map((_, index) => (
          <Button
            key={index}
            onClick={() => {
              setSelectedGroup(index);
              setCurrentIndex(0);
              setIsFinished(false);
            }}
            colorScheme="blue"
          >
            Iniciar Ejercicios Grupo {index + 1}
          </Button>
        ))}
      </VStack>
    );
  }

  // Datos del ejercicio actual
  const [exerciseJSON, motorType] = exercises[currentIndex];

  // Pantalla de “fin de ejercicios”
  if (selectedGroup !== null && isFinished) {
    return (
      <ScaleFade in={isFinished} initialScale={0.9}>
        <Center minH="70vh" bg="white" flexDir="column">
          <Image
            src="/img/mateo4.png"
            alt="Mateo"
            w="200px"
            h="200px"
            objectFit="contain"
            mt="100px"
            mb="30px"
          />
          <Text fontSize="lg" textAlign="center">
            <TypeText
              text="¡Felicidades! Has completado todos los ejercicios. Muchas gracias por tu participación xd."
              speed={15}
            />
          </Text>
          <Text fontSize="lg" textAlign="center">
            Por favor ingresa a este enlace para una breve encuesta sobre tu experiencia:
          </Text>
          <Text fontSize="lg" textAlign="center" mt="10px" mb="30px">
            <a
              href="https://forms.gle/BZ2HiwW6pRjTFJM46"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              https://forms.gle/BZ2HiwW6pRjTFJM46
            </a>
          </Text>
        </Center>
      </ScaleFade>
    );
  }

  // Render del ejercicio
  return (
    <div>
      {motorType === 1 ? (
        <Plain key={currentIndex} topicId="17" steps={exerciseJSON as ExType} />
      ) : (
        <Pizarra key={currentIndex} exercise={exerciseJSON} topicId="pot1" />
      )}
    </div>
  );
};

export default QuickPlay;
