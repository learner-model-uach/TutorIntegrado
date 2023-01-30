import { Button } from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import TeX from "@matejmazur/react-katex";
import styles from "./Hint.module.css";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Flex,
  ButtonGroup,
} from "@chakra-ui/react";
import {
  HINT_NEXT_BUTTOM,
  HINT_BACK_BUTTOM,
  HEADER_POPOVER_HINT,
  HINT_BUTTOM_NAME,
  HINT_BUTTOM_COLOR,
  POPOVER_BACK_BUTTOM_COLOR,
  POPOVER_NEXT_BUTTOM_COLOR,
} from "../types";
import { useAction } from "../../../utils/action";

export const Hint = ({
  hints, // all hints
  firstTimeHint,
  setNewHintAvaliable,
  newHintAvaliable,
  answerId, // id the answer
  nStep, // "stepId" field defined in the json file
  code, // "code" field defined in the json file
  setHintsShow // number of times a hint has been shown
}) => {
  const startAction = useAction({});
  const initialFocusRef = useRef();

  const [allHints, setAllHints] = useState(hints); // all the hints of the step
  const [count, setCount] = useState(-1); // count of matchingError
  const [countHint, setCountHint] = useState(-1); // counts the number of accumulated hints displayed to the user
  const [countNotification, setCountNotication] = useState(0);
  const [disabledHint, setDisabledHint] = useState(firstTimeHint); // configure if the button is disabled or not
  const [hintsAvaliableList, setHintsAvaliableList] = useState([]); // accumulated hints displayed to the user
  const [shake, setShake] = useState(false);
  
  useEffect(() => {
    setCount(-1); // number of hints shown to the user
    setCountHint(-1); // number of hints available to display to the user
    setAllHints(hints);
    setHintsAvaliableList([]);
  }, [answerId]);
  
  useEffect(() => {
    if (getHint(answerId)) {
      setDisabledHint(firstTimeHint);
      setShake(newHintAvaliable);
      setTimeout(() => setShake(false), 2000);
      if (newHintAvaliable) {
        setCountNotication(1);
      }
    }
  }, [newHintAvaliable]);

  const getHint = (idAnswer) => {
    if (allHints != undefined) {
      let filterHint = allHints.find(hint => {
        return hint.answers.includes(idAnswer);
      });
      filterHint = filterHint ? filterHint : allHints.find(hint => hint.generic);
      return filterHint;
    }
    return null;
  };

  const handOnClickNext = (e) => {
    startAction({
      verbName: "requestHint",
      stepID: nStep,
      contentID: code,
      hintID: count + 1,
      extra: { open: "next" },
    });
    setCount((prev) => prev + 1);
    setCountHint((prev) => prev + 1);
  };

  const handOnClickBack = (e) => {
    startAction({
      verbName: "requestHint",
      stepID: nStep,
      contentID: code,
      hintID: count - 1,
      extra: { open: "prev" },
    });
    setCount((prev) => prev - 1);
    setCountHint((prev) => prev - 1);
  };

  const handOnClickHint = (e) => {
    setCountNotication(0);
    if (newHintAvaliable) {
      startAction({
        verbName: "requestHint",
        stepID: nStep,
        contentID: code,
        hintID: count + 1,
        extra: { open: "new" },
      });
      let newHint = getHint(answerId);
      if(newHint) {
        setHintsAvaliableList(prev => [...prev, newHint]);
        setAllHints(prev => prev.filter(hint => hint.id !== newHint.id));
        setCountHint(prev => prev + 1);
      }
      setCount(prev => prev + 1);
      setNewHintAvaliable(false);
      setHintsShow((prev) => prev + 1);
    }
  };

  return (
    <Popover initialFocusRef={initialFocusRef} placement="left" closeOnBlur={false}>
      <PopoverTrigger>
        <Button
          className={
            shake ? `${styles["notification"]} ${styles["shake"]}` : styles["notification"]
          }
          disabled={disabledHint}
          onClick={handOnClickHint}
          colorScheme={HINT_BUTTOM_COLOR}
        >
          {HINT_BUTTOM_NAME}
          {countNotification > 0 && <span className={styles["badge"]}>{countNotification}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent color="white" bg="blue.800" borderColor="blue.800">
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          {HEADER_POPOVER_HINT}
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Flex>
            <TeX>{hintsAvaliableList.length > 0 && hintsAvaliableList[countHint].text}</TeX>
          </Flex>
        </PopoverBody>
        <PopoverFooter
          border="0"
          d="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={4}
        >
          <ButtonGroup size="sm">
            {countHint != 0 && (
              <Button colorScheme={POPOVER_BACK_BUTTOM_COLOR} onClick={handOnClickBack}>
                {HINT_BACK_BUTTOM}
              </Button>
            )}
            {countHint + 1 != hintsAvaliableList.length && (
              <Button
                colorScheme={POPOVER_NEXT_BUTTOM_COLOR}
                ref={initialFocusRef}
                onClick={handOnClickNext}
              >
                {HINT_NEXT_BUTTOM}
              </Button>
            )}
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};