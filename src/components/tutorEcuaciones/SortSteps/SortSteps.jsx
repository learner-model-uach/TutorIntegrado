import { useState, useCallback, useEffect, useContext } from "react";
import update from "immutability-helper";
import { Heading, Text, Button, Stack, Link } from "@chakra-ui/react";
import { shuffleCard } from "../utilities";
import { Flex } from "@chakra-ui/react";
import { FeedbackOrderCards } from "../Feedbacks/FeedbackOrderCards";
import { useDrop } from "react-dnd";
import { CardsOrderSteps } from "../DragDrop/CardsOrderSteps";
import {
  NEXT_EXERCISE_BUTTOM_NAME,
  NEXT_STEP_BUTTOM_NAME,
  CHECK_ORDER_BUTTOM_NAME,
  CORRECT_ANSWER_COLOR,
  INCORRECT_ANSWER_COLOR,
  BOX,
  HEADER_ORDER_STEPS,
  BACKGROUND_COLOR_ORDER_STEPS,
} from "../types";
import { useAction } from "../../../utils/action";
import ExerciseContext from "../context/exercise/exerciseContext";
import { useRouter } from "next/router";

export const SortSteps = ({
  steps,
  setNextPhase,
  linkNext,
  idExercise,
  setIdExercise,
}) => {
  const [cards, setCards] = useState([]);
  const [correctOrder, setCorrectOrder] = useState(false);
  const [cardColor, setCardColor] = useState([]);
  const startAction = useAction({});
  const exerciseContext = useContext(ExerciseContext);
  const { content } = exerciseContext;
  const { push } = useRouter();
  useEffect(() => {
    if (steps) {
      const getTextCards = steps.map((step) => {
        return { id: step.n_step, text: step.left_text };
      });
      shuffleCard(getTextCards);
      setCards(getTextCards);
    }
  }, [steps]);

  const findCard = useCallback(
    (id) => {
      const card = cards.filter((c) => `${c.id}` === id)[0];
      return {
        card,
        index: cards.indexOf(card),
      };
    },
    [cards]
  );

  const moveCard = useCallback(
    (id, atIndex) => {
      const { card, index } = findCard(id);
      setCards(
        update(cards, {
          $splice: [
            [index, 1],
            [atIndex, 0, card],
          ],
        })
      );
    },
    [findCard, cards, setCards]
  );

  const [, drop] = useDrop(() => ({ accept: BOX }));

  const renderCard = (card, index, color) => {
    return (
      <CardsOrderSteps
        key={card.id}
        index={index}
        id={`${card.id}`}
        text={card.text}
        moveCard={moveCard}
        findCard={findCard}
        color={color}
      />
    );
  };

  const correctOrderHandler = (e) => {
    const isCorrect = cards.map((card, id) => {
      if (card.id === id) {
        return CORRECT_ANSWER_COLOR;
      } else {
        return INCORRECT_ANSWER_COLOR;
      }
    });
    setCardColor(isCorrect);

    if (isCorrect.some((color) => color === INCORRECT_ANSWER_COLOR)) {
      startAction({
        verbName: "checkOrder",
        result: 0,
        extra: { order: cards },
        contentID: content,
      });
    } else {
      setCorrectOrder(true);
      startAction({
        verbName: "checkOrder",
        result: 1,
        extra: { order: cards },
        contentID: content,
      });
    }
  };

  const handlerNextExercise = (e) => {
    e.preventDefault();
    startAction({
      verbName: "nextContent",
    });
    setIdExercise((prev) => (idExercise % 14) + 1);
    push(`/exercise/${(idExercise % 14) + 1}`);
  };

  return (
    <Stack style={{ width: "100%" }}>
      <Heading
        marginBottom="10px"
        as="h2"
        size={{ base: "xs", sm: "sm", md: "md" }}
        justifyContent="center"
        textAlign="center"
      >
        {HEADER_ORDER_STEPS}
      </Heading>
      <Stack style={{ justifyContent: "center", margin: "auto" }}>
        <Stack style={{ backgroundColor: BACKGROUND_COLOR_ORDER_STEPS }}>
          <Flex ref={drop} style={{ justifyContent: "center" }}>
            <Stack
              fontSize={{
                base: "10px",
                sm: "12px",
                md: "14px",
                lg: "16px",
                xl: "20px",
              }}
            >
              {cards.map((card, i) => {
                return (
                  <Flex key={i}>
                    <Text margin="auto" marginLeft={"0.5rem"}>
                      {i}
                    </Text>
                    {renderCard(card, i, cardColor[i])}
                  </Flex>
                );
              })}
            </Stack>
          </Flex>
        </Stack>
        <Stack>
          <Flex style={{ justifyContent: "center" }}>
            <Button onClick={correctOrderHandler} colorScheme="blue">
              {CHECK_ORDER_BUTTOM_NAME}
            </Button>
          </Flex>
          {correctOrder && (
            <Stack>
              <Flex textAlign="center">
                <FeedbackOrderCards />
              </Flex>
              <Flex justifyContent="center">
                {linkNext ? (
                  <Link href={`/exercise/${(idExercise % 14) + 1}`}>
                    <Button
                      onClick={handlerNextExercise}
                      colorScheme="twitter"
                      marginRight="12px"
                      fontSize={{
                        base: "11px",
                        sm: "13px",
                        lg: "16px",
                      }}
                    >
                      {NEXT_EXERCISE_BUTTOM_NAME}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => setNextPhase(false)}
                    colorScheme="twitter"
                  >
                    {NEXT_STEP_BUTTOM_NAME}
                  </Button>
                )}
              </Flex>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
