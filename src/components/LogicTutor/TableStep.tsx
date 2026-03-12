import React, { useState } from "react";
import { Button, Box, Alert, Table, Center, Stack } from "@chakra-ui/react";
import { useColorModeValue } from "../ui/color-mode";

import type { ExLog, textAlign } from "./Tools/ExcerciseType2";
import Hint from "../Hint";
import Latex from "react-latex-next";
import { useAction } from "../../utils/action";

function BotonAlternar({ valores, setValor }) {
  const [indice, setIndice] = useState(0); // Estado para almacenar el índice del valor actual

  // Función para cambiar el valor del botón cuando se hace clic
  const handleClick = () => {
    // Obtenemos el índice del próximo valor (alternando entre 0 y 1)
    const siguienteIndice = indice === 0 ? 1 : 0;
    // Actualizamos el índice
    setIndice(siguienteIndice);
    // Actualizamos el valor
    setValor(valores[siguienteIndice]);
  };

  return (
    <Button colorScheme="blue" size="sm" onClick={handleClick}>
      {valores[indice]}
    </Button>
  );
}
const TableStep = ({
  exc,
  nStep,
  setCompleted,
  topic,
}: {
  exc: ExLog;
  nStep: number;
  setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  topic: string;
}) => {
  const [valor, setValor] = useState(exc.steps[nStep].button[0][0]);
  const [valor1, setValor1] = useState(exc.steps[nStep].button[1][0]);
  const [valor2, setValor2] = useState(exc.steps[nStep].button[2][0]);
  const [valor3, setValor3] = useState(exc.steps[nStep].button[3][0]);
  const userAnswers = [valor, valor1, valor2, valor3];
  const [hints, setHints] = useState(0);
  const [_, setLastHint] = useState(false);
  const [error, setError] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [isCorrectValue, setIsCorrectValue] = useState(false);
  const textColor = useColorModeValue("dark", "white");
  const bg = useColorModeValue("#2B4264", "#1A202C");
  const [attempts, setAttempts] = useState(0);
  const action = useAction();
  const evaluar = () => {
    let respuesta = false;
    const isCorrect = userAnswers.every(
      (userAnswer, index) => userAnswer === exc.steps[nStep].answers[0].answer[index],
    );
    //console.log(isCorrect);

    isCorrect
      ? (setIsCorrectValue(true), (respuesta = true), setCompleted(true))
      : (setFirstTime(false), setError(true));
    setAttempts(attempts + 1);
    action({
      verbName: "tryStep",
      stepID: "" + exc.steps[nStep].stepId,
      contentID: exc.code,
      topicID: topic,
      result: respuesta ? 1 : 0,
      kcsIDs: exc.steps[nStep].KCs,
      extra: {
        response: [userAnswers],
        attempts: attempts,
        hints: hints,
      },
    });
  };

  return (
    <>
      <Center>
        <Latex>{"$$" + exc.steps[nStep].expression + "$$"}</Latex>
      </Center>
      {exc.steps[nStep].table?.tableCaption && (
        <Box marginY={5} shadow="sm" rounded="lg" w="auto" overflowX="auto">
          <Table.Root striped size="sm" borderColor={textColor}>
            <Table.Caption>
              <Latex>{exc.steps[nStep].table?.tableCaption}</Latex>
            </Table.Caption>

            <Table.Header bg={bg}>
              <Table.Row>
                {exc.steps[nStep].table?.header?.map((head, index) => (
                  <Table.ColumnHeader
                    key={index}
                    textAlign={head?.align as textAlign}
                    color="white"
                    fontWeight="bold"
                    textTransform="none"
                  >
                    <Latex>{"$" + head?.value + "$"}</Latex>
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {exc.steps[nStep].table?.rows?.map((row, index) => (
                <Table.Row key={index}>
                  {row?.data?.map((value, i) => (
                    <Table.Cell key={i} textAlign={exc.steps[nStep].table?.alignRows}>
                      {value === "a" ? (
                        <Center>
                          <BotonAlternar valores={exc.steps[nStep].button[0]} setValor={setValor} />
                        </Center>
                      ) : value === "b" ? (
                        <Center>
                          <BotonAlternar
                            valores={exc.steps[nStep].button[1]}
                            setValor={setValor1}
                          />
                        </Center>
                      ) : value === "c" ? (
                        <Center>
                          <BotonAlternar
                            valores={exc.steps[nStep].button[2]}
                            setValor={setValor2}
                          />
                        </Center>
                      ) : value === "d" ? (
                        <Center>
                          <BotonAlternar
                            valores={exc.steps[nStep].button[3]}
                            setValor={setValor3}
                          />
                        </Center>
                      ) : (
                        <Latex strict>{value}</Latex>
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
      <Stack gap={4} m={2} direction="row" justifyContent={"center"}>
        {!isCorrectValue && (
          <>
            <Button colorScheme="blue" size="sm" onClick={() => evaluar()}>
              Enviar
            </Button>
            <Hint
              hints={exc.steps[nStep].hints}
              contentId={exc.code}
              topicId={topic}
              stepId={exc.steps[nStep].stepId}
              matchingError={exc.steps[nStep].matchingError}
              response={userAnswers}
              error={error}
              setError={setError}
              hintCount={hints}
              setHints={setHints}
              setLastHint={setLastHint}
            ></Hint>
          </>
        )}
      </Stack>
      {firstTime ? null : !isCorrectValue ? (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>
              Tu respuesta no es la esperada, inténtalo de nuevo.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ) : (
        <Alert.Root status="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{exc.steps[nStep].correctMsg}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
    </>
  );
};

export default TableStep;
