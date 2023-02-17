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
  nStep, // "stepId" field defined in the exercise
  code, // "code" field defined in the exercise
  setHintsShow // number of times a hint has been shown
}) => {
  const startAction = useAction({});
  const initialFocusRef = useRef();

  const [allHints, setAllHints] = useState([]); // all the hints of the step
  const [countHint, setCountHint] = useState(-1); // index of the element of hintsAvaliableList that the user can currently see
  const [countNotification, setCountNotication] = useState(0);
  const [disabledHint, setDisabledHint] = useState(firstTimeHint); // configure if the button is disabled or not
  const [hintsAvaliableList, setHintsAvaliableList] = useState([]); // accumulated hints displayed to the user
  const [shake, setShake] = useState(false);
  const hintIndex = useRef(-1); // this is used to keep the index of the possible answers that the user is seeing
  const hintsAssociatedAnswer = useRef([]); // all hints associated with this idAnswer (both non-generic and generic)
  const [updateAssociatedAnswer, setUpdateAssociatedAnswer] = useState(false);
  
  useEffect(() => {
    setCountHint(-1);
    setAllHints(hints);
    setHintsAvaliableList([]);
    hintIndex.current = -1;
	
	// function setAllHints() must be executed every time the user changes
	// answer (the id of the answer defined in the exercise is used, if
	// there is no answer defined in the exercise then it defaults to 0,
	// this is to guarantee that it shows the generic answers, and this is
	// defined in the three panel components that are parents of this
	// component) or advances one step in the exercise and
	// hintsAssociatedAnswer needs to update the data every time the user
	// changes answer or advances one step in the exercise, but
	// hintsAssociatedAnswer must be updated after setAllHints()
	// has been updated (since getAllHints uses allHints), to
	// avoid this race condition this updateAssociatedAnswer is used.
	setUpdateAssociatedAnswer(true);
  }, [answerId, nStep]);
  
  // ensures that allHints is defined before executing getAllHints
  // (avoid race condition)
  useEffect(() => {
    hintsAssociatedAnswer.current = getAllHints(answerId);
	setUpdateAssociatedAnswer(false);
  }, [updateAssociatedAnswer]);
  
  useEffect(() => {
    if (getHint(answerId)) {
      setDisabledHint(firstTimeHint);
      setShake(newHintAvaliable);
      setTimeout(() => setShake(false), 2000);
      if (newHintAvaliable) {
        setCountNotication(1);
      };
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
  
  // returns all hints that can be associated with the user's
  // response (both non-generic and generic).
  const getAllHints = (idAnswer) => {
    if (allHints != undefined) {
      let filterHint = allHints.filter(hint => {
        return hint.answers.includes(idAnswer);
      });
      if (filterHint != undefined) {
        filterHint = filterHint.concat(allHints.filter(hint => hint.generic && !filterHint.includes(hint)));
	  }
	  else {
        filterHint = filterHint.concat(allHints.filter(hint => hint.generic));
	  }
      return filterHint;
    }
    return null;
  }
  
  // The following three functions modify the index with which,
  // together with the getAllHints function, they are used to
  // choose the id of the answer that the user is seeing.
  const nextHintIndex = () => {
    hintIndex.current += 1;
  }

  const backHintIndex = () => {
    hintIndex.current -= 1;
  }
  
  const openHintIndex = () => {
    hintIndex.current += 1;
  }

  const handOnClickNext = (e) => {
    nextHintIndex();
    startAction({
      verbName: "requestHint",
      stepID: nStep,
      contentID: code,
      hintID: hintsAssociatedAnswer.current[hintIndex.current].id,
      extra: { open: "next" },
    });
	setCountHint((prev) => prev + 1);
  };

  const handOnClickBack = (e) => {
    backHintIndex();
    startAction({
      verbName: "requestHint",
      stepID: nStep,
      contentID: code,
      hintID: hintsAssociatedAnswer.current[hintIndex.current].id,
      extra: { open: "prev" },
    });
	setCountHint((prev) => prev - 1);
  };

  const handOnClickHint = (e) => {
    setCountNotication(0);

	let newHint = getHint(answerId);
    if(newHint) {
	  if (newHintAvaliable) {
        setHintsAvaliableList(prev => [...prev, newHint]);
        setAllHints(prev => prev.filter(hint => hint.id !== newHint.id));
		openHintIndex();
        setCountHint((prev) => prev + 1)
	  }
      setHintsShow((prev) => prev + 1);
      setNewHintAvaliable(false);  
    }
	
	startAction({
      verbName: "requestHint",
      stepID: nStep,
      contentID: code,
      hintID: hintsAssociatedAnswer.current[hintIndex.current].id,
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