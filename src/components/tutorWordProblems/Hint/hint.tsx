import {
  Box,
  Button,
  ButtonGroup,
  Circle,
  Popover,
  Portal
} from "@chakra-ui/react";
import { useColorModeValue } from "../../ui/color-mode";
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
    <Popover.Root positioning={{ placement: "bottom" }}>
      <Popover.Trigger asChild>
        <Button
          color={numEnabledHints !== 0 ? "red" : undefined}
          colorPalette="teal"
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
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content color={popoverColor} bg={bg} borderColor={borderColor} css={{ "--popover-bg": bg }}>
            
            <Popover.Header pt={4} fontWeight="bold" border="0">
              {" "}
              Pista:
            </Popover.Header>
            <Popover.Arrow />
            <Popover.CloseTrigger />

            <Popover.Body>
              {hints[currentHint] && (
                <Box width="auto" overflow="auto">
                  <Latex>{hints[currentHint]?.hint}</Latex>
                </Box>
              )}
            </Popover.Body>

            <Popover.Footer
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
                <Button variant="outline" onClick={prevHint} disabled={disabledPrevButton}>
                  <BsCaretLeftFill color={popoverColor} />
                </Button>
                <Button variant="outline" onClick={nextHint} disabled={disabledNextButton}>
                  <BsCaretRightFill color={popoverColor} />
                </Button>
              </ButtonGroup>
            </Popover.Footer>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default HintButton;
