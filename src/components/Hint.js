import React, { useState, useEffect } from "react";
import { Button, Popover, Portal, Center, Badge, Box } from "@chakra-ui/react";
import { toaster } from "./ui/toaster";
import { useAction } from "../utils/action";
import { MathComponent } from "./MathJax";
import { FaQuestion } from "react-icons/fa";
import MQStaticMathField from "../utils/MQStaticMathField";

// Componente de navegación extraído (Sintaxis Chakra UI v3)
export const HintNavigation = ({ list, currentIndex, onPrev, onNext }) => {
  if (!list?.length) return null;

  const currentItem = list[currentIndex];
  if (!currentItem) return null;

  return (
    <Popover.Body>
      <br />
      {currentItem.hint}
      <Center>
        {currentItem.expression ? (
          <MQStaticMathField exp={currentItem.expression} currentExpIndex={true} />
        ) : null}
      </Center>
      <br />
      <Center>
        {list[currentIndex - 1] && (
          <Button 
            onClick={onPrev} 
            colorPalette="cyan" 
            variant="outline" 
            size="sm"
            mr={2} // Reemplaza el espacio en blanco con margen nativo de Chakra
          >
            atrás
          </Button>
        )}
        {list[currentIndex + 1] && (
          <Button 
            onClick={onNext} 
            colorPalette="cyan" 
            variant="outline" 
            size="sm"
          >
            siguiente
          </Button>
        )}
      </Center>
    </Popover.Body>
  );
};

const Hint = ({
  hints, //all hints
  stepId, //id for send data
  contentId, //contentId for send data
  topicId,
  matchingError, //list of list
  response, //list of response
  error,
  setError,
  hintCount,
  setHints,
  setLastHint,
}) => {
  const [i, setI] = useState(0); //i es el último hint desbloqueado
  const [list] = useState(hints?.length ? [hints[0]] : []);
  const [j, setJ] = useState(0); //j es el hint que se despliega con los botones
  const [firstError, setFirstError] = useState(false);
  const [count, setCount] = useState(0); // count for matchingError
  const action = useAction();

useEffect(() => {
  if ((hints?.length ?? 0) + count === list.length && list.length > 0) {
    setLastHint(true);
  }
}, [(hints?.length ?? 0) + count === list.length, setLastHint]);

  const ayuda = () => {
    const responseStudent =
      typeof response[0] == "object"
        ? response.map(e => e.current.value.replace(/[*]| /g, "").toLowerCase())
        : response; //array clean
    const correct = responseStudent.map(e => true); //array of true
    const listMatchingError = matchingError.map(e => {
      //return array of boolean (true if matchingError)
      let listBool = [];
      for (let k = 0; k < e.error.length; k++) {
        if (e.error[k] === responseStudent[k] || e.error[k] === "*") {
          listBool = [...listBool, true];
        } else {
          listBool = [...listBool, false];
        }
      }
      return listBool;
    });

    const validate = element => JSON.stringify(element) === JSON.stringify(correct);
    const repite = list.map(e => {
      //return array of boolean (true if matchingError)
      let listBool = [];
      if (e.error) {
        for (let k = 0; k < e.error.length; k++) {
          if (e.error[k] === responseStudent[k] || e.error[k] === "*") {
            listBool = [...listBool, true];
          } else {
            listBool = [...listBool, false];
          }
        }
      }
      return listBool;
    });

    if (listMatchingError.some(validate) & error) {
      //if matchingError and error
      if ((list.length == 1 + count) & !repite.some(validate) & !firstError) {
        //if matching error is before to first hint and not repite
        list.pop();
        list.push(
          matchingError[
            listMatchingError.findIndex(
              element => JSON.stringify(element) === JSON.stringify(correct),
            )
          ],
        );
        setCount(count + 1);
      } else if (!repite.some(validate) && hints.length + count > list.length) {
        //if matchingError is not first
        list.push(
          matchingError[
            listMatchingError.findIndex(
              element => JSON.stringify(element) === JSON.stringify(correct),
            )
          ],
        );
        setI(i + 1);
        setJ(i + 1);
        setCount(count + 1);
      }
    } else if ((hints.length + count > list.length) & error & firstError) {
      //if not first error and not matching error
      list.push(hints[i + 1 - count]);
      setI(i + 1);
      setJ(i + 1);
    } else if (!firstError) {
      //if firstError and not matchingError
      if (list[0] != hints[0]) {
        list.push(hints[0]);
        setI(i + 1);
        setJ(i + 1);
      }
      setFirstError(true);
    }
    setError(false);
    action({
      verbName: "requestHint",
      stepID: "" + stepId,
      contentID: contentId,
      topicID: topicId,
      hintID: "" + list[[list.length - 1]].hintId, //last element hintId of list of hints avalibles
      extra: {
        source: "Open",
        lastHint: hints.length + count == list.length ? true : false,
      },
    });
  };

  const siguiente = () => {
    if (list[j + 1] != null) {
      setJ(j + 1);
      action({
        verbName: "requestHint",
        stepID: "" + stepId,
        contentID: contentId,
        topicID: topicId,
        hintID: "" + list[j + 1].hintId,
        extra: {
          source: "next",
          lastHint: hints.length + count == list.length ? true : false,
        },
      });
    }
  };

  const atras = () => {
    if (list[j - 1] != null) {
      setJ(j - 1);
      action({
        verbName: "requestHint",
        stepID: "" + stepId,
        contentID: contentId,
        topicID: topicId,
        hintID: "" + list[j - 1].hintId,
        extra: {
          source: "prev",
          lastHint: hints.length + count == list.length ? true : false,
        },
      });
    }
  };

  return (
    <div>
      <Popover.Root
        onOpenChange={({ open }) => {
          if (open) {
            setHints(h => h + 1);
          }
        }}
      >
        <Popover.Trigger asChild>
          <Button
            onClick={ayuda}
            colorPalette="cyan"
            variant="outline"
            h="8"
            size="sm"
            gap="2"
            alignItems="center"
          >
            Pista
            {error && i < hints.length + count - 1 ? (
              <Badge
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                boxSize="1.25rem"
                color="white"
                bg="tomato"
                borderRadius="full"
                lineHeight="1"
                flexShrink={0}
              >
                1
              </Badge>
            ) : (
              <Badge
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                boxSize="1.25rem"
                color="white"
                bg="gray"
                borderRadius="full"
                lineHeight="1"
                flexShrink={0}
              >
                0
              </Badge>
            )}
          </Button>
        </Popover.Trigger>

        <Portal>
          <Popover.Positioner>
            <Popover.Content>
              <Popover.Arrow />
              <Popover.CloseTrigger />
              {/* Aquí renderizamos el subcomponente limpio */}
              <HintNavigation 
                list={list} 
                currentIndex={j} 
                onPrev={atras} 
                onNext={siguiente} 
              />
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </div>
  );
};

export default Hint;