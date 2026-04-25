import React, { useEffect, useRef, useState } from "react";
import TeX from "@matejmazur/react-katex";
import styles from "./Hint.module.css";

import { Popover, Button, Flex, ButtonGroup } from "@chakra-ui/react";
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
  firstTimeHint, // unlock or lock hint button
  setNewHintAvaliable, // remove
  newHintAvaliable, // it is true if the user clicked the correct button
  answerId, // id the answer
  nStep, // "stepId" field defined in the exercise
  code, // "code" field defined in the exercise
  setHintsShow, // number of times a hint has been shown
}) => {
  const startAction = useAction({});

  const [allHints, setAllHints] = useState([]); // all the hints of the step
  const [countHint, setCountHint] = useState(-1); // index of the element of hintsAvaliableList that the user can currently see
  const [countNotification, setCountNotication] = useState(0);
  const [disabledHint, setDisabledHint] = useState(firstTimeHint); // configure if the button is disabled or not
  const [hintsAvaliableList, setHintsAvaliableList] = useState([]); // accumulated hints displayed to the user
  const [isOpen, setIsOpen] = useState(false);
  const [shake, setShake] = useState(false);

  const hintIndex = useRef(-1); // this is used to keep the index of the possible answers that the user is seeing
  const newHintIndex = useRef(-1); // index of the new hint to add to the list of available hints
  const hintsAvaliable = useRef(false); // true if there is a new hint to show the user, otherwise false
  const lastHint = useRef(false); // true if the user saw the last hint associated with the user's response, otherwise false
  const firtsHint = useRef(false); // is true if it is the first hint of the user's response, otherwise false
  const pressBoton = useRef(false); // true if the hint button is pressed, otherwise false

  useEffect(() => {
    setAllHints(Array.isArray(hints) ? hints : []);
    setIsOpen(false);
    setCountHint(-1);
    setHintsAvaliableList([]);
    hintIndex.current = -1;
    newHintIndex.current = 0;
    lastHint.current = false;
    hintsAvaliable.current = false;
    firtsHint.current = false;
    pressBoton.current = false;
  }, [answerId, nStep, hints]);

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
    if (firstTimeHint) {
      setIsOpen(false);
    }
  }, [firstTimeHint]);

  const handOnClickNext = e => {
    const nextHint = allHints[hintIndex.current + 1];
    if (!nextHint) return;

    hintIndex.current += 1;
    startAction({
      verbName: "requestHint",
      stepID: nStep,
      contentID: code,
      hintID: nextHint.id,
      extra: { open: "next" },
    });
    setCountHint(prev => prev + 1);
  };

  const handOnClickBack = e => {
    const previousHint = allHints[hintIndex.current - 1];
    if (!previousHint) return;

    hintIndex.current -= 1;
    startAction({
      verbName: "requestHint",
      stepID: nStep,
      contentID: code,
      hintID: previousHint.id,
      extra: { open: "prev" },
    });
    setCountHint(prev => prev - 1);
  };

  const handOnClickHint = e => {
    setCountNotication(0);

    let newHint = allHints[newHintIndex.current];
    if (!newHint) {
      setIsOpen(false);
      return;
    }

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
      hintID: newHint.id,
      extra: { open: "new" },
    });
  };

  const currentHint = countHint >= 0 ? hintsAvaliableList[countHint] : undefined;
  const currentHintText = typeof currentHint?.text === "string" ? currentHint.text : "";
  const hasPreviousHint = countHint !== 0 && hintsAvaliableList.length > 0;
  const hasNextHint = countHint + 1 !== hintsAvaliableList.length && hintsAvaliableList.length > 0;

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open && !disabledHint)}
      positioning={{ placement: "bottom" }}
      closeOnBlur={false}
      closeOnInteractOutside={false}
    >
      <Popover.Trigger asChild>
        <Button
          className={
            shake ? `${styles["notification"]} ${styles["shake"]}` : styles["notification"]
          }
          disabled={disabledHint || allHints.length === 0}
          onClick={handOnClickHint}
          colorPalette={HINT_BUTTOM_COLOR}
        >
          {HINT_BUTTOM_NAME}
          {countNotification > 0 && <span className={styles["badge"]}>{countNotification}</span>}
        </Button>
      </Popover.Trigger>

      <Popover.Positioner>
        <Popover.Content
          color="white"
          bg="blue.800"
          borderColor="blue.800"
          width={230}
          boxShadow="lg"
          css={{ "--popover-bg": "var(--chakra-colors-blue-800)" }}
        >
          <Popover.Arrow>
            <Popover.ArrowTip bg="blue.800" borderColor="blue.800" />
          </Popover.Arrow>
          <Popover.CloseTrigger />
          <Popover.Header pt={4} fontWeight="bold" border="0">
            {HEADER_POPOVER_HINT}
          </Popover.Header>

          <Popover.Body>
            <Flex>
              <TeX>{currentHintText}</TeX>
            </Flex>
          </Popover.Body>

          {(hasPreviousHint || hasNextHint) && (
            <Popover.Footer
              border="0"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              pb={4}
            >
              <ButtonGroup size="sm">
                {hasPreviousHint && (
                  <Button colorPalette={POPOVER_BACK_BUTTOM_COLOR} onClick={handOnClickBack}>
                    {HINT_BACK_BUTTOM}
                  </Button>
                )}
                {hasNextHint && (
                  <Button
                    colorPalette={POPOVER_NEXT_BUTTOM_COLOR}
                    onClick={handOnClickNext}
                    autoFocus
                  >
                    {HINT_NEXT_BUTTOM}
                  </Button>
                )}
              </ButtonGroup>
            </Popover.Footer>
          )}
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
};
