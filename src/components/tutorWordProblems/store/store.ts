import { create } from "zustand";
import type { Question } from "../types";

type Store = {
  currentQuestionIndex: number;
  currentStepIndex: number;
  questions: Question[];
  unlockNextStep: () => void;
  setCurrentStep: (n: number) => void;
  setCurrentQues: (n: number) => void;
  setQuestions: (questions: Question[]) => void;
};

type ExerciseStore = {
  currentExercise: number;
  exerciseIds: string[];
  exerciseCode: string;
  nextExercise: () => void;
  setExercise: (exercise: string[]) => void;
  setExerciseCode: (code: string) => void;
};

export const useStore = create<Store>(set => ({
  currentQuestionIndex: 0,
  currentStepIndex: 0, // Ningún paso desbloqueado inicialmente
  questions: [],
  setCurrentStep: n => set(() => ({ currentStepIndex: n })),
  setCurrentQues: n => set(() => ({ currentQuestionIndex: n })),
  unlockNextStep: () =>
    set(state => {
      const nextStepIndex = state.currentStepIndex + 1;
      if (nextStepIndex < state.questions[state.currentQuestionIndex].steps.length) {
        state.questions[state.currentQuestionIndex].steps[nextStepIndex].isBlocked = false;
        return { currentStepIndex: nextStepIndex, questions: state.questions };
      } else {
        // Si el paso actual es el último paso de la pregunta, desbloquea la siguiente pregunta
        const nextQuestionIndex = state.currentQuestionIndex + 1;
        if (nextQuestionIndex < state.questions.length) {
          state.questions[nextQuestionIndex].isBlocked = false;
          return {
            currentQuestionIndex: nextQuestionIndex,
            currentStepIndex: 0,
            questions: state.questions,
          };
        }
      }
      return state;
    }),
  setQuestions: ques => set(() => ({ questions: ques })),
}));

export const useExerciseStore = create<ExerciseStore>(set => ({
  currentExercise: 0,
  exerciseIds: [],
  exerciseCode: "", // Nuevo estado para almacenar el código del ejercicio actual

  setExercise: data => set(() => ({ exerciseIds: data })),
  nextExercise: () =>
    set(state => {
      const nextIndexExcercise = state.currentExercise + 1;

      if (nextIndexExcercise < state.exerciseIds.length) {
        return {
          currentExercise: nextIndexExcercise,
          exerciseIds: state.exerciseIds,
        };
      } else {
        return state;
      }
    }),
  setExerciseCode: code => set(() => ({ exerciseCode: code })), // Nueva función para actualizar el código del ejercicio
}));
