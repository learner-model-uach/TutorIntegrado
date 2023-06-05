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

export const HintEqSystem = ({
  hints, // all hints
  firstTimeHint,
  setNewHintAvaliable,
  newHintAvaliable,
  answerId, // id the answer
  nStep, // "stepId" field defined in the exercises
  code, // "code" field defined in the exercises
  setHintsShow, // number of times a hint has been shown
}) => {
  /*
    The following answers are considered different A = B, A = C, C = B,
    this means that the hints available to the user will be reset every
    time the user changes one of the equality values, this can cause the
    first hint to repeat itself, for example for A = B and A = C they
    could have the same hint the first time.

    The hints shown to the user will have the following order, first the
    hints associated with the answer on the left, then the hints
    associated with the answer on the right, and finally the generic
    hints: for example, for A = B, first the hints associated
    with answer A will be displayed, then the hints associated
    with answer B and finally the generic hints.
  */

  const startAction = useAction({});
  const initialFocusRef = useRef();

  const [allHints, setAllHints] = useState(hints);
  const [countHint, setCountHint] = useState(-1); // counts the number of accumulated hints displayed to the user
  const [countNotification, setCountNotication] = useState(0);
  const [disabledHint, setDisabledHint] = useState(firstTimeHint);
  const [hintsAvaliableList, setHintsAvaliableList] = useState([]);
  const [shake, setShake] = useState(false);
  const hintIndex = useRef(-1); // this is used to keep the index of the possible answers that the user is seeing
  const newHintIndex = useRef(-1); // index of the new hint to add to the list of available hints
  const hintsAvaliable = useRef(false); // true if there is a new hint to show the user, otherwise false
  const lastHint = useRef(false); // true if the user saw the last hint associated with the user's response, otherwise false
  const firtsHint = useRef(false); // is true if it is the first hint of the user's response, otherwise false
  const pressBoton = useRef(false); // true if the hint button is pressed, otherwise false

  useEffect(() => {
    setAllHints(hints);
    setCountHint(-1);
    setHintsAvaliableList([]);
    hintIndex.current = -1;
    newHintIndex.current = 0;
    lastHint.current = false;
    hintsAvaliable.current = false;
    firtsHint.current = false;
    pressBoton.current = false;

    // useEffect uses answerId[0] and answerId[1] and not an array,
    // since an array is an object, and for javascript two objects
    // could be different (because they have different references),
    // so useEffect would be executed even if the array looks the same
  }, [answerId[0], answerId[1], nStep]);

  // handles shaking the hint button
  useEffect(() => {
    // a hint was requested for the first time
    if (!firtsHint.current && newHintAvaliable) {
      firtsHint.current = true;
    }

    // if a hint was already requested for the first
    // time and the last hint is still not displayed
    if (firtsHint.current) {
      if (!lastHint.current) {
        hintsAvaliable.current = true;
      }
    }

    // when hints are requested and there are hints to be displayed
    if (hintsAvaliable.current && newHintAvaliable) {
      setShake(hintsAvaliable.current);
      setTimeout(() => setShake(false), 2000);

      // if the hint button was pressed then the
      // notification is not activated
      if (!pressBoton.current) {
        setCountNotication(1);
      }
    }

    // all hints are or were shown
    if (newHintIndex.current === allHints.length - 1) {
      if (lastHint.current) {
        hintsAvaliable.current = false; // there are no more hints to show
      }
      lastHint.current = true; // the last hint was shown
    }

    // allows you to activate the notification the
    // next time the user presses the correct button
    pressBoton.current = false;
  }, [newHintAvaliable]);

  // the hint button unlocks when the user has entered an
  // answer and presses the correct button and locks the hint
  // button when the user has completed the step
  useEffect(() => {
    setDisabledHint(firstTimeHint);
  }, [firstTimeHint]);

  const handOnClickNext = e => {
    hintIndex.current += 1;
    startAction({
      verbName: "requestHint",
      stepID: nStep,
      contentID: code,
      hintID: allHints[hintIndex.current].id,
      extra: { open: "next" },
    });
    setCountHint(prev => prev + 1);
  };

  const handOnClickBack = e => {
    hintIndex.current -= 1;
    startAction({
      verbName: "requestHint",
      stepID: nStep,
      contentID: code,
      hintID: allHints[hintIndex.current].id,
      extra: { open: "prev" },
    });
    setCountHint(prev => prev - 1);
  };

  const handOnClickHint = e => {
    setCountNotication(0);

    let newHint = allHints[newHintIndex.current];

    if (!hintsAvaliableList.includes(newHint)) {
      if (newHintAvaliable) {
        setHintsAvaliableList(prev => [...prev, newHint]);

        // when the user presses the hint button and there is
        // a new hint available, then the new available hint
        // is displayed which is also the last hint up to that moment
        hintIndex.current = newHintIndex.current;
        if (newHintIndex.current < allHints.length - 1) {
          newHintIndex.current += 1;
        }

        // what is displayed to the user and what is sent
        // in the action is the same hint (the bottom is the index)
        setCountHint(hintIndex.current);
      }
      setHintsShow(prev => prev + 1);
    }
    pressBoton.current = true; // turn off the notification
    setNewHintAvaliable(false);
    startAction({
      verbName: "requestHint",
      stepID: nStep,
      contentID: code,
      hintID: allHints[hintIndex.current].id,
      extra: { open: "new" },
    });
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
      <PopoverContent color="white" bg="blue.800" borderColor="blue.800" width={230}>
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
