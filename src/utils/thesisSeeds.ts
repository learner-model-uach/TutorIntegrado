export interface ExerciseItem {
  id: string;
  title: string;
  instruction: string;
  targetLatex: string;
  topic: string;
}

export type InputMode = "teclado" | "pizarra";

export interface SeedAssignment {
  seedId: number;
  description: string;
  exerciseModes: {
    exerciseId: string;
    mode: InputMode;
  }[];
}

// 6 Ejercicios estándar para la investigación de tesis
export const EXPERIMENT_EXERCISES: ExerciseItem[] = [
  {
    id: "ex-1",
    title: "Ejercicio 1: Ecuación Lineal Simple",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "3x + 5 = 14",
    topic: "Ecuaciones",
  },
  {
    id: "ex-2",
    title: "Ejercicio 2: Multiplicación de Binomios",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "(2x + 3)(x - 5)",
    topic: "Productos Notables",
  },
  {
    id: "ex-3",
    title: "Ejercicio 3: Fracción Algebraica",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "\\frac{x^2 - 4}{x - 2}",
    topic: "Fracciones",
  },
  {
    id: "ex-4",
    title: "Ejercicio 4: Expresión con Raíz Cuadrada",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "\\sqrt{16x^4}",
    topic: "Raíces",
  },
  {
    id: "ex-5",
    title: "Ejercicio 5: Ecuación Cuadrática",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "2x^2 + 5x - 3 = 0",
    topic: "Ecuaciones",
  },
  {
    id: "ex-6",
    title: "Ejercicio 6: Fracción con Ecuación",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "\\frac{3x}{2} + 4 = 10",
    topic: "Fracciones y Ecuaciones",
  },
];

// Mapeo de semillas (0 a 5) alternando Teclado y Pizarra Digital
export const SEED_ASSIGNMENTS: Record<number, SeedAssignment> = {
  0: {
    seedId: 0,
    description: "Semilla 0 (Alternado: Teclado primero)",
    exerciseModes: [
      { exerciseId: "ex-1", mode: "teclado" },
      { exerciseId: "ex-2", mode: "pizarra" },
      { exerciseId: "ex-3", mode: "teclado" },
      { exerciseId: "ex-4", mode: "pizarra" },
      { exerciseId: "ex-5", mode: "teclado" },
      { exerciseId: "ex-6", mode: "pizarra" },
    ],
  },
  1: {
    seedId: 1,
    description: "Semilla 1 (Alternado: Pizarra primero)",
    exerciseModes: [
      { exerciseId: "ex-1", mode: "pizarra" },
      { exerciseId: "ex-2", mode: "teclado" },
      { exerciseId: "ex-3", mode: "pizarra" },
      { exerciseId: "ex-4", mode: "teclado" },
      { exerciseId: "ex-5", mode: "pizarra" },
      { exerciseId: "ex-6", mode: "teclado" },
    ],
  },
  2: {
    seedId: 2,
    description: "Semilla 2 (Bloques 2x2: Teclado primero)",
    exerciseModes: [
      { exerciseId: "ex-1", mode: "teclado" },
      { exerciseId: "ex-2", mode: "teclado" },
      { exerciseId: "ex-3", mode: "pizarra" },
      { exerciseId: "ex-4", mode: "pizarra" },
      { exerciseId: "ex-5", mode: "teclado" },
      { exerciseId: "ex-6", mode: "pizarra" },
    ],
  },
  3: {
    seedId: 3,
    description: "Semilla 3 (Bloques 2x2: Pizarra primero)",
    exerciseModes: [
      { exerciseId: "ex-1", mode: "pizarra" },
      { exerciseId: "ex-2", mode: "pizarra" },
      { exerciseId: "ex-3", mode: "teclado" },
      { exerciseId: "ex-4", mode: "teclado" },
      { exerciseId: "ex-5", mode: "pizarra" },
      { exerciseId: "ex-6", mode: "teclado" },
    ],
  },
  4: {
    seedId: 4,
    description: "Semilla 4 (Mixto A)",
    exerciseModes: [
      { exerciseId: "ex-1", mode: "teclado" },
      { exerciseId: "ex-2", mode: "pizarra" },
      { exerciseId: "ex-3", mode: "pizarra" },
      { exerciseId: "ex-4", mode: "teclado" },
      { exerciseId: "ex-5", mode: "pizarra" },
      { exerciseId: "ex-6", mode: "teclado" },
    ],
  },
  5: {
    seedId: 5,
    description: "Semilla 5 (Mixto B)",
    exerciseModes: [
      { exerciseId: "ex-1", mode: "pizarra" },
      { exerciseId: "ex-2", mode: "teclado" },
      { exerciseId: "ex-3", mode: "teclado" },
      { exerciseId: "ex-4", mode: "pizarra" },
      { exerciseId: "ex-5", mode: "teclado" },
      { exerciseId: "ex-6", mode: "pizarra" },
    ],
  },
};

/**
 * Extrae el número de cuenta de nombres como 'hw01', 'hw02', 'hw12', etc.,
 * o del email/username del usuario, y calcula la semilla (número % 6).
 */
export function getSeedFromUser(usernameOrEmail?: string | null): {
  accountNum: number | null;
  seed: number;
  accountName: string;
} {
  if (!usernameOrEmail) {
    return { accountNum: null, seed: 0, accountName: "invitado" };
  }

  const cleanUser = usernameOrEmail.toLowerCase().trim();

  // Buscar coincidencia tipo hw01, hw02, hw12...
  const hwMatch = cleanUser.match(/hw0*(\d+)/i);
  if (hwMatch && hwMatch[1]) {
    const num = parseInt(hwMatch[1], 10);
    return {
      accountNum: num,
      seed: num % 6,
      accountName: cleanUser,
    };
  }

  // Buscar cualquier secuencia de dígitos si no empieza con 'hw'
  const digitsMatch = cleanUser.match(/(\d+)/);
  if (digitsMatch && digitsMatch[1]) {
    const num = parseInt(digitsMatch[1], 10);
    return {
      accountNum: num,
      seed: num % 6,
      accountName: cleanUser,
    };
  }

  // Fallback si no tiene números (semilla 0)
  return {
    accountNum: null,
    seed: 0,
    accountName: cleanUser,
  };
}
