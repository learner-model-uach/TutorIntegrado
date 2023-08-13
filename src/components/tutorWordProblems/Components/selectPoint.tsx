import { AlertStatus, facePoint, Hint, selectPointerMeta } from "../types.d";
import { useEffect, useState, useRef } from "react";
import { Box, ButtonGroup, Flex, useMediaQuery } from "@chakra-ui/react";
import ResAlert from "../Alert/responseAlert";
import { useAlert } from "../hooks/useAlert";
import { useBoard } from "../hooks/useBoard";
import HintButton from "../Hint/hint";
import { useHint } from "../hooks/useHint";
import { useStore } from "../store/store";

interface Props {
  meta: selectPointerMeta;
  hints: Hint[];
}
export const SelectPoint = ({ meta, hints }: Props) => {
  const selectedPointRef = useRef(null); // Ref para el punto seleccionado

  const [answerCorrect, setAnswerCorrect] = useState(false);
  const [isScreenLarge] = useMediaQuery("(min-width: 768px)");
  const { correctPoint, data } = meta;
  const [userAnswer, setUserAnswer] = useState([]);
  const { alertTitle, alertStatus, alertMsg, alertHidden, showAlert } = useAlert(
    "",
    AlertStatus.info,
    "",
    false,
    3000,
  );
  const { boardId, boardRef, bgBoardColor, disableBoard } = useBoard("jxgbox", meta.graphSettings);
  const { unlockNextStep } = useStore();
  const {
    unlockedHints,
    currentHint,
    totalHints,
    disabledPrevButton,
    disabledNextButton,
    numHintsActivated,
    nextHint,
    prevHint,
    unlockHint,
    resetNumHintsActivated,
  } = useHint(hints);
  //al utilizar useEffect S/D se ejecuta una unica vez despues del primer renderizado del componente
  useEffect(() => {
    // inicialización de datos
    data.forEach(point => {
      const isStatic = point?.isStatic ?? true;
      const face = point?.face ?? facePoint.circle;
      const p = boardRef.current.create("point", point.coord, {
        name: point?.name,
        color: point?.color,
        face: face,
        fixed: isStatic,
      });
      p.on("down", () => {
        setUserAnswer(p.coords.usrCoords);

        selectedPointRef.current = p; // Guarda el punto seleccionado en el estado
      });
    });
  }, []);

  useEffect(() => {
    if (userAnswer.length !== 0 && !answerCorrect) {
      const answer = userAnswer.slice(-2);
      const isCorrect = answer.every((element, index) => element === correctPoint[index]);
      if (isCorrect) {
        setAnswerCorrect(true);
        showAlert("😃", AlertStatus.success, "Muy bien!", null);

        if (boardRef.current) {
          disableBoard();

          //boardRef.current.create("point",[correctPoint[0], correctPoint[1]], {face: facePoint.cross})
          //JXG.JSXGraph.freeBoard(boardRef.current)
        }

        unlockNextStep();
      } else {
        showAlert("😕", AlertStatus.error, "Respuesta Incorrecta");
        unlockHint();
      }
    }
  }, [userAnswer]);

  return (
    <Flex flexDirection="column" alignContent="center" flexWrap="wrap" width="100%" maxW="100%">
      <Box
        bgColor={bgBoardColor}
        rounded="2xl"
        shadow="lg"
        overflow="hidden"
        width={isScreenLarge ? "500px" : "100%"}
        height={isScreenLarge ? "500px" : "100%"}
        pb={isScreenLarge ? undefined : "100%"}
        position="relative"
        maxW={isScreenLarge ? "500px" : undefined}
        maxH={isScreenLarge ? "500px" : undefined}
      >
        <div
          id={boardId}
          style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
        ></div>
      </Box>

      <ButtonGroup size="lg" display="flex" justifyContent="flex-end" paddingTop={5}>
        <HintButton
          hints={unlockedHints}
          currentHint={currentHint}
          totalHints={totalHints}
          prevHint={prevHint}
          nextHint={nextHint}
          disabledPrevButton={disabledPrevButton}
          disabledNextButton={disabledNextButton}
          numEnabledHints={numHintsActivated}
          //interactiveHint={activeLine(metaSelectPointHint.activeLine.point1,metaSelectPointHint.activeLine.point2)}
          resetNumHintsActivated={resetNumHintsActivated}
        ></HintButton>
      </ButtonGroup>
      <ResAlert title={alertTitle} status={alertStatus} alertHidden={alertHidden} text={alertMsg} />
    </Flex>
  );
};
