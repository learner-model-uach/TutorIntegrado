'use client';

import { Box, Button, ButtonGroup, Flex } from "@chakra-ui/react";
import type { Hint, MathComponentMeta } from "../types";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathfieldElement } from "mathlive";
import * as CEpkg from "@cortex-js/compute-engine";
import ResAlert from "../Alert/responseAlert";
import { useAlert } from "../hooks/useAlert";
import { AlertStatus } from "../types";
import HintButton from "../Hint/hint";
import { useHint } from "../hooks/useHint";
import { useStore } from "../store/store";
import { useAction } from "../../../utils/action";

const MathField = dynamic(() => import("./tools/mathLive"), { ssr: false });

interface Props {
  meta: MathComponentMeta;
  hints: Hint[];
  correctMsg?: string;
}

interface Answer {
  placeholderId: string;
  value: string;
}

// Normaliza decimales con coma -> punto
const normalizeLatex = (latex: string) => latex.replace(/(\d+),(\d+)/g, "$1.$2");

// Resolver universal de la clase ComputeEngine (named / default / nested)
function resolveComputeEngineCtor(mod: any) {
  if (!mod) return null;
  if (typeof mod.ComputeEngine === "function") return mod.ComputeEngine; // named export
  if (mod.default) {
    if (typeof mod.default === "function") return mod.default; // default class
    if (typeof mod.default.ComputeEngine === "function") return mod.default.ComputeEngine; // default: { ComputeEngine }
  }
  return null;
}

const MathComponent = ({ meta, hints, correctMsg }: Props) => {
  const { expression, readonly, answers, idCorrectAnswers } = meta;

  // CE disponible para checkAnswer
  const ceRef = useRef<any>(null);

  // Mantén una sola instancia de MathfieldElement
  const mfe = useMemo(() => new MathfieldElement(), []);

  // Estado de respuestas del usuario (sin re-render por cada tecleo)
  const answerStateRef = useRef<Answer[]>([]);
  const [disabledButton, setDisabledButton] = useState(false);

  const correctAnswers = answers.filter(a => idCorrectAnswers.includes(a.id));
  const otherAnswers = answers.filter(a => !idCorrectAnswers.includes(a.id));

  const { alertTitle, alertStatus, alertMsg, alertHidden, showAlert, resetAlert } = useAlert(
    "Titulo",
    AlertStatus.info,
    "mensaje de la alerta",
    false,
    3000,
  );

  const {
    unlockedHints,
    currentHint,
    totalHints,
    nextHint,
    prevHint,
    disabledPrevButton,
    disabledNextButton,
    numHintsActivated,
    unlockHint,
    resetNumHintsActivated,
  } = useHint(hints);

  const {
    unlockNextStep,
    currentContetId,
    currentQuestionIndex,
    currentStepIndex,
    currentTopicId,
    exerciseData,
  } = useStore();

  const reportAction = useAction();

  // Reinciar alertas y botón al cambiar de meta
  useEffect(() => {
    resetAlert();
    setDisabledButton(false);
  }, [meta]);

  // Registrar/obtener ComputeEngine de forma soportada por MathLive
  useEffect(() => {
    // 1) Si ya hay una CE registrada globalmente por MathLive, úsala
    let ce = (MathfieldElement as any).computeEngine ?? null;

    // 2) Si no existe, intenta construirla y REGISTRARLA a nivel estático
    if (!ce) {
      const CEClass = resolveComputeEngineCtor(CEpkg);
      if (CEClass) {
        try {
          ce = new CEClass();
          (MathfieldElement as any).computeEngine = ce; // 👈 registro correcto
        } catch (e) {
          // Si por alguna razón no es construible, ce seguirá null.
          // Evitamos romper el render; el botón quedará deshabilitado y verás el aviso.
          // console.warn("No se pudo instanciar ComputeEngine:", e);
        }
      }
    }

    ceRef.current = ce || null;
  }, []);

  // Handler de cambios del MathField (placeholders/prompts)
  // @ts-ignore - firma del onChange en tu wrapper
  const handleMathFieldChange = (latex: string, promptsValues: Record<string, string>) => {
    const entries = Object.entries(promptsValues) as [string, string][];
    answerStateRef.current = entries.map(([placeholderId, value]) => ({ placeholderId, value }));
  };

  const checkAnswer = () => {
    try {
      const ce = ceRef.current;
      if (!ce) {
        showAlert("", AlertStatus.info, "Inicializando motor matemático… inténtalo de nuevo.");
        return;
      }

      const isEmpty = answerStateRef.current.some(u => u.value === "");
      if (isEmpty) {
        showAlert("", AlertStatus.warning, "Debes completar todos los recuadros!");
        return;
      }

      let allCorrect = true;
      let genericHint = true;

      answerStateRef.current.forEach(userAnswer => {
        const parUserAnswer = ce.parse(normalizeLatex(userAnswer.value));

        const isCorrect = correctAnswers.find(
          corr =>
            corr.placeholderId === userAnswer.placeholderId &&
            parUserAnswer.isEqual(ce.parse(normalizeLatex(corr.value))),
        );

        if (isCorrect) {
          mfe.setPromptState(userAnswer.placeholderId, "correct", true);
        } else {
          allCorrect = false;
          mfe.setPromptState(userAnswer.placeholderId, "incorrect", false);

          const isOther = otherAnswers.find(
            o =>
              o.placeholderId === userAnswer.placeholderId &&
              parUserAnswer.isEqual(ce.parse(normalizeLatex(o.value))),
          );
          if (isOther) {
            genericHint = false;
            unlockHint(isOther.id);
          }
        }
      });

      reportAction({
        verbName: "tryStep",
        stepID: "[" + currentQuestionIndex + "," + currentStepIndex + "]",
        contentID: currentContetId,
        topicID: currentTopicId,
        result: allCorrect ? 1 : 0,
        kcsIDs: exerciseData.questions[currentQuestionIndex].steps[currentStepIndex].kcs,
        extra: { Response: answerStateRef.current },
        detail: "MathComponent",
      });

      if (allCorrect) {
        showAlert("😃", AlertStatus.success, correctMsg, null);
        setDisabledButton(true);
        unlockNextStep();
      } else {
        showAlert("😕", AlertStatus.error, "Respuesta Incorrecta");
        genericHint && unlockHint();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex flexDirection="column">
      <Box width="100%" textAlign="center" mb={4}>
        <MathField readOnly={readonly} mfe={mfe} value={expression} onChange={handleMathFieldChange} />
      </Box>

      {/* Aviso suave mientras la CE aún no está lista */}
      {!((MathfieldElement as any).computeEngine) && (
        <Box mt={2} color="orange.500" fontSize="sm">
          ⏳ Inicializando motor matemático…
        </Box>
      )}

      <Flex justifyContent="flex-end">
        <ButtonGroup size="lg" display="flex" justifyContent="flex-end">
          <Button
            colorScheme="teal"
            size="sm"
            onClick={checkAnswer}
            disabled={disabledButton || !ceRef.current}
          >
            Aceptar
          </Button>
          <HintButton
            hints={unlockedHints}
            currentHint={currentHint}
            totalHints={totalHints}
            prevHint={prevHint}
            nextHint={nextHint}
            disabledPrevButton={disabledPrevButton}
            disabledNextButton={disabledNextButton}
            numEnabledHints={numHintsActivated}
            resetNumHintsActivated={resetNumHintsActivated}
          />
        </ButtonGroup>
      </Flex>

      <Box width="100%">
        <ResAlert title={alertTitle} status={alertStatus} text={alertMsg} alertHidden={alertHidden} />
      </Box>
    </Flex>
  );
};

export default MathComponent;
