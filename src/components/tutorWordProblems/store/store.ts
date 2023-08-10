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
