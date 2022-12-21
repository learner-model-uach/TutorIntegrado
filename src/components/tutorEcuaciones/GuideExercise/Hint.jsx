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
} from "../../../types";
export const Hint = ({
  hints,
  firstTimeHint,
  setNewHintAvaliable,
  newHintAvaliable,
  answerId,
  nStep,
  setIntro,
}) => {
  const initialFocusRef = useRef();

  const [disabledHint, setDisabledHint] = useState(firstTimeHint);

  const [count, setCount] = useState(-1);
  const [hintsAvaliableList, setHintsAvaliableList] = useState([]);
  const [allHints, setAllHints] = useState(hints);
  const [shake, setShake] = useState(false);
  const [lastHint, setLastHint] = useState({});
  const [countNotification, setCountNotication] = useState(0);

  useEffect(() => {
    setCount(hintsAvaliableList.length - 1);
    setLastHint(getHint(answerId));
    if (lastHint) {
      setShake(newHintAvaliable);
      setTimeout(() => setShake(false), 2000);
    }
    if (newHintAvaliable) {
      setCountNotication(1);
    }
  }, [newHintAvaliable]);

  useEffect(() => {
    setDisabledHint(firstTimeHint);
  }, [firstTimeHint]);

  const getHint = (idAnswer) => {
    if (allHints != undefined) {
      let filterHint = allHints.find((hint) => {
        return hint.answers.includes(idAnswer);
      });

      filterHint = filterHint
        ? filterHint
        : allHints.find((hint) => hint.generic);

      return filterHint;
    }
    return null;
  };

  const handOnClickNext = (e) => {
    setCount(count + 1);
  };

  const handOnClickBack = (e) => {
    setCount(count - 1);
  };

  const handOnClickHint = (e) => {
    setCountNotication(0);
    if (lastHint && newHintAvaliable) {
      if (nStep === 0) {
        const newStep = {
          target: ".panel1",
          content: "Ahora resuelve correctamente este paso.",
          hideCloseButton: true,
          disableOverlayClose: true,
          spotlightClicks: true,
        };

        setIntro((prev) => ({
          ...prev,
          steps: [...prev.steps, newStep],
          stepIndex: 6,
        }));
      }
      setHintsAvaliableList((prev) => [...prev, lastHint]);
      setAllHints((prev) => prev.filter((hint) => hint.id !== lastHint.id));
      setCount((prev) => prev + 1);
      setNewHintAvaliable(false);
    }
  };

  return (
    <Popover
      initialFocusRef={initialFocusRef}
      placement="bottom"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <div className="hint-guide">
          <Button
            className={
              shake
                ? `${styles["notification"]} ${styles["shake"]}`
                : styles["notification"]
            }
            disabled={disabledHint}
            onClick={handOnClickHint}
            colorScheme={HINT_BUTTOM_COLOR}
          >
            {HINT_BUTTOM_NAME}
            {countNotification > 0 && (
              <span className={styles["badge"]}>{countNotification}</span>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent color="white" bg="blue.800" borderColor="blue.800">
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          {HEADER_POPOVER_HINT}
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Flex>
            <TeX>
              {hintsAvaliableList.length > 0 && hintsAvaliableList[count].text}
            </TeX>
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
            {count != 0 && (
              <Button
                colorScheme={POPOVER_BACK_BUTTOM_COLOR}
                onClick={handOnClickBack}
              >
                {HINT_BACK_BUTTOM}
              </Button>
            )}
            {count + 1 != hintsAvaliableList.length && (
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
