import { create } from "zustand";
import type { Question, wpExercise } from "../types";

type Store = {
  exerciseData: wpExercise | null;
  currentTopicId: string;
  currentContetId: string;
  currentQuestionIndex: number;
  currentStepIndex: number;
  questions: Question[];
  expandedIndices: number[]; // Nuevo estado para manejar los índices expandidos
  expandedStepIndices: number[][];
  completeContent: boolean;

  setExercise: (data: wpExercise) => void;
  setTopicId: (id: string) => void;
  setContentId: (id: string) => void;
  unlockNextStep: () => void;
  setCurrentStep: (n: number) => void;
  setCurrentQues: (n: number) => void;
  setQuestions: (questions: Question[]) => void;
  toggleQuestionExpansion: (index: number) => void; // Nueva función para alternar la expansión de preguntas
  toggleStepExpansion: (questionIndex: number, stepIndex: number) => void;
  setCompleteContent: (bool: boolean) => void;

  resetExpandedIndices: () => void;
  resetExpandedStepIndices: () => void;
};

type ExerciseStore = {
  currentExercise: number;
  exerciseIds: string[];
  exerciseCode: string;
  nextExercise: () => void;
  setExercise: (exercise: string[]) => void;
  setExerciseCode: (code: string) => void;
  resetCurrectExercise: () => void;
};

export const useStore = create<Store>(set => ({
  exerciseData: null,
  currentTopicId: "",
  currentContetId: "",
  currentQuestionIndex: 0,
  currentStepIndex: 0, // Ningún paso desbloqueado inicialmente
  questions: [],
  expandedIndices: [0], // Inicialmente, el índice de la primera pregunta
  expandedStepIndices: [],
  completeContent: false,
  setExercise: data => set(() => ({ exerciseData: data })),
  setTopicId: id => set(() => ({ currentTopicId: id })),
  setContentId: id => set(() => ({ currentContetId: id })),
  setCurrentStep: n => set(() => ({ currentStepIndex: n })),
  setCurrentQues: n => set(() => ({ currentQuestionIndex: n })),
  unlockNextStep: () =>
    set(state => {
      const nextStepIndex = state.currentStepIndex + 1;
      if (nextStepIndex < state.questions[state.currentQuestionIndex].steps.length) {
        state.questions[state.currentQuestionIndex].steps[nextStepIndex].isBlocked = false;
        const newExpandedStepIndices = [...state.expandedStepIndices];
        newExpandedStepIndices[state.currentQuestionIndex].push(nextStepIndex);

        return {
          currentStepIndex: nextStepIndex,
          questions: state.questions,
          expandedStepIndices: newExpandedStepIndices,
        };
      } else {
        // Si el paso actual es el último paso de la pregunta, desbloquea la siguiente pregunta
        const nextQuestionIndex = state.currentQuestionIndex + 1;
        if (nextQuestionIndex < state.questions.length) {
          state.questions[nextQuestionIndex].isBlocked = false;
          const newExpandedStepIndices = [...state.expandedStepIndices];
          newExpandedStepIndices[nextQuestionIndex] = [0]; // Agregar el primer paso de la siguiente pregunta

          return {
            currentQuestionIndex: nextQuestionIndex,
            currentStepIndex: 0,
            questions: state.questions,
            expandedIndices: [...state.expandedIndices, nextQuestionIndex], // Agregar el índice de la siguiente pregunta
            expandedStepIndices: newExpandedStepIndices, // Reiniciar los pasos expandidos al cambiar de pregunta
          };
        } else {
          // ya completo el ejercicio
          return {
            completeContent: true,
          };
        }
      }
    }),
  setQuestions: ques => set(() => ({ questions: ques })),
  toggleQuestionExpansion: index => {
    set(state => {
      if (state.expandedIndices.includes(index)) {
        return { expandedIndices: state.expandedIndices.filter(i => i !== index) };
      } else {
        return { expandedIndices: [...state.expandedIndices, index] };
      }
    });
  },
  toggleStepExpansion: (questionIndex, stepIndex) =>
    set(state => {
      const newExpandedStepIndices = [...state.expandedStepIndices];
      if (!newExpandedStepIndices[questionIndex]) {
        newExpandedStepIndices[questionIndex] = [];
      }

      newExpandedStepIndices[questionIndex] = newExpandedStepIndices[questionIndex].includes(
        stepIndex,
      )
        ? newExpandedStepIndices[questionIndex].filter(i => i !== stepIndex)
        : [...newExpandedStepIndices[questionIndex], stepIndex];

      return { expandedStepIndices: newExpandedStepIndices };
    }),
  setCompleteContent: bool => set(() => ({ completeContent: bool })),
  resetExpandedIndices: () => set(() => ({ expandedIndices: [0] })),
  resetExpandedStepIndices: () => set(() => ({ expandedStepIndices: [] })),
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
  resetCurrectExercise: () => set(() => ({ currentExercise: 0 })),
}));
