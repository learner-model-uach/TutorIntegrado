import React, { useState } from 'react';
import {
  Button,
  Box,
  Stack,
  Alert,
  AlertIcon,
  useColorModeValue,
  Table,
  TableCaption,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";


import type {ExLog, textAlign}   from '../lvltutor/Tools/ExcerciseType2';
import Hint from '../Hint';
import Latex from 'react-latex-next';
import { useAction } from '../../utils/action';
import { sessionState } from '../SessionState';

const TableStep = ({ exc, nStep,  setCompleted }: { exc: ExLog; nStep: number;  setCompleted: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [valor, setValor] = useState('');
  const [valor1, setValor1] = useState('');
  const [valor2, setValor2] = useState('');
  const [valor3, setValor3] = useState('');
  const userAnswers = [valor, valor1, valor2, valor3];
  const [hints, setHints] = useState(0)
  const [lastHint, setLastHint] = useState(false);
  const [error,setError] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [isCorrectValue, setIsCorrectValue] = useState(false);
  const textColor = useColorModeValue("dark", "white");
  const bg = useColorModeValue("#2B4264", "#1A202C");
  const [attempts, setAttempts] = useState(0)
  const action = useAction()
  const evaluar = () => {
    let respuesta = false
    const isCorrect = userAnswers.every((userAnswer, index) => userAnswer === exc.steps[nStep].answers[0].answer[index]);
    console.log(isCorrect);

    isCorrect 
      ? (
        setIsCorrectValue(true),
        respuesta = true,
        setCompleted(true)
      )
      :(
        setHints(hints+1),
        setFirstTime(false),
        setError(true)
        )
        setAttempts(attempts + 1);
        action({
          verbName: "tryStep",
          stepID: "" + exc.steps[nStep].stepId,
          contentID: exc.code,
          topicID: sessionState.topic,
          result: respuesta?1:0,
          kcsIDs: exc.steps[nStep].KCs,
          extra: {
            response: [userAnswers],
            attempts: attempts,
            hints: exc.steps[nStep].hints,
          },
        });
  };

  return (
        <>
          {exc.steps[nStep].table?.tableCaption && (
            <Box marginY={5} shadow="sm" rounded="lg" w="auto" overflowX="auto">
              <Table variant="striped" size="sm" borderColor={textColor}>
                <TableCaption>
                  <Latex>{exc.steps[nStep].table?.tableCaption}</Latex>
                </TableCaption>
                <Thead bgColor={bg}>
                  <Tr>
                    {exc.steps[nStep].table?.header?.map((head, index) => (
                      <Th
                        key={index}
                        textAlign={head?.align as textAlign}
                        color="white"
                        fontWeight="bold"
                      >
                        <Latex>{head?.value}</Latex>
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {exc.steps[nStep].table?.rows?.map((row, index) => (
                    <Tr key={index}>
                      {row?.data?.map((value, i) => {
                        return (
                          <Td key={i} textAlign={exc.steps[nStep].table?.alignRows}>
                            {value === 'a' ? (
                              <RadioGroup onChange={setValor} value={valor}>
                                <Stack direction="row">
                                  <Radio value="V">V</Radio>
                                  <Radio value="F">F</Radio>
                                </Stack>
                              </RadioGroup>
                            ) : value === 'b' ? (
                              <RadioGroup onChange={setValor1} value={valor1}>
                                <Stack direction="row">
                                  <Radio value="V">V</Radio>
                                  <Radio value="F">F</Radio>
                                </Stack>
                              </RadioGroup>
                            ) : value === 'c' ? (
                              <RadioGroup onChange={setValor2} value={valor2}>
                                <Stack direction="row">
                                  <Radio value="V">V</Radio>
                                  <Radio value="F">F</Radio>
                                </Stack>
                              </RadioGroup>
                            ) : value === 'd' ? (
                              <RadioGroup onChange={setValor3} value={valor3}>
                                <Stack direction="row">
                                  <Radio value="V">V</Radio>
                                  <Radio value="F">F</Radio>
                                </Stack>
                              </RadioGroup>
                            ) : (
                              <Latex strict>{value}</Latex>
                            )}
                          </Td>
                        );
                      })}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
          <Button colorScheme="teal" size="sm" onClick={() => evaluar()}>
            Enviar
          </Button>
          {firstTime ? null : !isCorrectValue?
                         <Alert status='error'>
                            <AlertIcon />
                                Tu respuesta no es la esperada intentalo denuevo.
                        </Alert>
                        :                         <Alert status='success'>
                        <AlertIcon />
                            {exc.steps[nStep].correctMsg}
                    </Alert>
                    }
           <Hint
            hints={exc.steps[nStep].hints}
            contentId={exc.code}
            topicId={exc.type}
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

export default TableStep;
