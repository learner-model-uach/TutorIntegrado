import {
  Box,
  Button,
  ButtonGroup,
  Circle,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";
//import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import type { Hint } from "../types";
import Latex from "react-latex-next";
import { useAction } from "../../../utils/action";
import { useStore } from "../store/store";

interface Props {
  hints: Hint[];
  currentHint: number;
  totalHints: number;
  nextHint: () => void;
  prevHint: () => void;
  disabledPrevButton: boolean;
  disabledNextButton: boolean;
  numEnabledHints: number;
  resetNumHintsActivated: () => void;
}
const HintButton = ({
  hints,
  currentHint,
  totalHints,
  nextHint,
  prevHint,
  disabledPrevButton,
  disabledNextButton,
  numEnabledHints = 0,
  resetNumHintsActivated,
}: Props) => {
  const bg = useColorModeValue("white", "#2B4264");
  const popoverColor = useColorModeValue("dark", "white");
  const borderColor = useColorModeValue("dark", "#2B4264");

  const reportAction = useAction();
  const { currentQuestionIndex, currentStepIndex, currentTopicId, currentContetId } = useStore();

  const handleClick = () => {
    numEnabledHints !== 0 &&
      reportAction({
        verbName: "requestHint",
        stepID: "[" + currentQuestionIndex + "," + currentStepIndex + "]",
        contentID: currentContetId,
        topicID: currentTopicId,
        hintID: "" + hints[currentHint].hintId,
        extra: {
          source: "open",
          hint: hints[currentHint].hint,
        },
      });
    resetNumHintsActivated();
  };
  return (
    <Popover placement="bottom" closeOnBlur={true}>
      <PopoverTrigger>
        <Button
          color={numEnabledHints !== 0 ? "red" : undefined}
          colorScheme="teal"
          size="sm"
          variant="outline"
          onClick={handleClick}
        >
          Ayuda &nbsp;
          <Circle bg={numEnabledHints !== 0 ? "red" : "gray"} color="white" size="15px">
            {" "}
            {numEnabledHints}
          </Circle>
        </Button>
      </PopoverTrigger>
      <PopoverContent color={popoverColor} bg={bg} borderColor={borderColor}>
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          {" "}
          Pista:
        </PopoverHeader>
        <PopoverArrow bg={bg} />
        <PopoverCloseButton />
        <PopoverBody>
          {hints[currentHint] && (
            <Box width="auto" overflow="auto">
              <Latex>{hints[currentHint]?.hint}</Latex>
            </Box>
          )}
        </PopoverBody>
        <PopoverFooter
          border="0"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pb={4}
        >
          <Box fontSize="sm">
            Pista {currentHint + 1} de {totalHints}
          </Box>
          <ButtonGroup size="sm">
            <Button variant="outline" onClick={prevHint} isDisabled={disabledPrevButton}>
              <BsCaretLeftFill color={popoverColor} />
            </Button>
            <Button variant="outline" onClick={nextHint} isDisabled={disabledNextButton}>
              <BsCaretRightFill color={popoverColor} />
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default HintButton;
