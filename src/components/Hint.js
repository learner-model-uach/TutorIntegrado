import React, { useState, useEffect } from "react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Center,
  Badge,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useAction } from "../utils/action";
import { MathComponent } from "mathjax-react";

import MQStaticMathField from "../utils/MQStaticMathField";

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
  const [list] = useState([hints[0]]);
  const [j, setJ] = useState(0); //j es el hint que se despliega con los botones
  const [firstError, setFirstError] = useState(false);
  const [count, setCount] = useState(0); // count for matchingError
  const action = useAction();
  const toast = useToast();

  useEffect(() => {
    if (hints.length + count == list.length) {
      setLastHint(true);
    }
  }, [hints.length + count == list.length, setLastHint]);

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
      <Popover
        onOpen={() => {
          setHints(++hintCount); /*cuenta hint cada vez que se despliege la ayuda */
        }}
      >
        <PopoverTrigger>
          <Button
            onClick={() => {
              ayuda();
            }}
            colorScheme="cyan"
            variant="outline"
            size="sm"
          >
            Pista &nbsp;
            {error && i < hints.length + count - 1 ? ( //en esta parte va la notificación de un nuevo hint
              <Badge boxSize="1.25em" color="white" bg="tomato" borderRadius="lg">
                1
              </Badge>
            ) : (
              <Badge boxSize="1.25em" color="white" bg="gray" borderRadius="lg">
                0
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <br />
            {list[j].hint}
            <Center>
              {list[j].expression ? (
                <MQStaticMathField exp={list[j].expression} currentExpIndex={true} />
              ) : null}
            </Center>
            <br />
            <Center>
              {list[j - 1] && (
                <Button onClick={atras} colorScheme="cyan" variant="outline" size="sm">
                  atrás
                </Button>
              )}
              &nbsp;&nbsp;&nbsp;
              {list[j + 1] && (
                <Button onClick={siguiente} colorScheme="cyan" variant="outline" size="sm">
                  siguiente
                </Button>
              )}
            </Center>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Hint;
