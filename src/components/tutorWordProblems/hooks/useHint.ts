import { useEffect, useState } from "react";
import type { Hint } from "../types.d";

export const useHint = (hints: Hint[]) => {
  const [indUnlockedHint, setIndUnlockedHint] = useState(1);
  const [unlockedHints, setUnlockedHints] = useState<Hint[]>([hints[0]]);
  const [currentHint, setCurrentHint] = useState(0);
  const [totalHints, setTotalHints] = useState(hints.length);
  const [disabledPrevButton, setDisabledPrevButton] = useState(true);
  const [disabledNextButton, setDisabledNextButton] = useState(false);
  const [numHintsActivated, setNumHintsActivated] = useState(1); // Nuevo estado para el número de hints activados
  const [unlockedAnswerIds, setUnlockedAnswerIds] = useState<number[]>([]);
  const genericHints = hints.filter(hint => !hint.associatedAnswer);
  const specificHints = hints.filter(hint => hint.associatedAnswer);

  useEffect(() => {
    setIndUnlockedHint(1);
    setUnlockedHints([hints[0]]);
    setCurrentHint(0);
    setTotalHints(hints.length);
    setNumHintsActivated(1);
    setUnlockedAnswerIds([]);
    setDisabledPrevButton(true);
    setDisabledNextButton(false);
  }, [hints]);

  useEffect(() => {
    setTotalHints(unlockedHints.length);
  }, [unlockedHints]);

  useEffect(() => {
    // evaluated when to disable the next and previous buttons of the Hints
    currentHint <= 0 ? setDisabledPrevButton(true) : setDisabledPrevButton(false);
    currentHint >= totalHints - 1 ? setDisabledNextButton(true) : setDisabledNextButton(false);
  }, [currentHint, totalHints]);

  const nextHint = () => {
    currentHint < totalHints - 1 && setCurrentHint(currentHint + 1);
  };

  const prevHint = () => {
    currentHint > 0 && setCurrentHint(currentHint - 1);
  };

  const unlockHint = (answerId?: number) => {
    // Solo se desbloquea un nuevo hint si no hay uno activo (numHintsActivated === 0)
    // Esto evita que se acumulen los hint cuando el estudiante se equivoca repetidamente y no utiliza los hints
    if (numHintsActivated === 0) {
      if (answerId !== undefined && !unlockedAnswerIds.includes(answerId)) {
        const hintToUnlock = specificHints.find(hint =>
          hint.associatedAnswer.some(idAssAnswer => idAssAnswer === answerId),
        );
        if (hintToUnlock) {
          setUnlockedHints(prevUnlockedHints => [...prevUnlockedHints, hintToUnlock]);
          setUnlockedAnswerIds(prevUnlockedAnswerIds => [...prevUnlockedAnswerIds, answerId]);
          setNumHintsActivated(prevNumHintsActivated => prevNumHintsActivated + 1); // Incrementar el número de hints activados
          setCurrentHint(totalHints);
          return;
        }
      }
      const nextGenericHint =
        indUnlockedHint < genericHints.length ? genericHints[indUnlockedHint] : null;
      if (nextGenericHint) {
        // si hay un hint a mostrar
        setIndUnlockedHint(indUnlockedHint + 1); // actualizamos el indice para el siguiente hint
        setUnlockedHints(prevUnlockedHints => [...prevUnlockedHints, nextGenericHint]); //agregamos el hint desbloqueado
        setNumHintsActivated(prevNumHintsActivated => prevNumHintsActivated + 1); // Incrementar el número de hints activados
        setCurrentHint(totalHints); // establecemos el hint a mostrar como el ultimo desbloqueado
      }
    }
  };
  const resetNumHintsActivated = () => {
    setNumHintsActivated(0);
  };
  return {
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
  };
};
