export interface ExerciseItem {
  id: string;
  title: string;
  instruction: string;
  targetLatex: string;
  topic: string;
}

export type InputMode = "teclado" | "pizarra";

export interface SeedStepConfig {
  exerciseId: string;
  mode: InputMode;
}

export interface SeedAssignment {
  seedId: number;
  description: string;
  sequence: SeedStepConfig[];
}

export interface SeedExerciseStep {
  exercise: ExerciseItem;
  mode: InputMode;
}

/**
 * 6 Ejercicios del experimento con progresión de complejidad:
 * - Ejercicios 1 a 3: Complejidad Baja a Mediana (Ecuación lineal, Producto notable, Fracción con exponente)
 * - Ejercicios 4 a 6: Complejidad Avanzada a Compleja (Raíz con potencias y fracción, Ecuación cuadrática, Expresión mixta combinada)
 */
export const EXPERIMENT_EXERCISES: ExerciseItem[] = [
  {
    id: "ex-1",
    title: "Ejercicio 1 (E1): Ecuación Lineal Simple",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "3x + 5 = 14",
    topic: "Álgebra Básica (Baja Complejidad)",
  },
  {
    id: "ex-2",
    title: "Ejercicio 2 (E2): Productos Notables",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "(2x + 3)(x - 5)",
    topic: "Productos Notables (Baja - Media Complejidad)",
  },
  {
    id: "ex-3",
    title: "Ejercicio 3 (E3): Fracción Algebraica con Potencias",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "\\frac{x^2 - 4}{x - 2}",
    topic: "Fracciones Algebraicas (Media Complejidad)",
  },
  {
    id: "ex-4",
    title: "Ejercicio 4 (E4): Radicación con Potencias y Fracción",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "\\sqrt{\\frac{16x^4}{9y^2}}",
    topic: "Raíces y Potencias (Complejidad Avanzada)",
  },
  {
    id: "ex-5",
    title: "Ejercicio 5 (E5): Ecuación Cuadrática Completa",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "2x^2 + 5x - 3 = 0",
    topic: "Ecuaciones Cuadráticas (Complejidad Avanzada)",
  },
  {
    id: "ex-6",
    title: "Ejercicio 6 (E6): Expresión Mixta con Fracción, Raíz y Potencias",
    instruction: "Copia la siguiente expresión en el campo de respuesta:",
    targetLatex: "\\frac{\\sqrt{x^2 + 16}}{2x - 1} = 3",
    topic: "Expresión Mixta Compleja (Alta Complejidad)",
  },
];

/**
 * Mapeo oficial de Semillas (Tabla 4 de la Memoria de Tesis)
 * Secuencias de ejercicios y modalidades (T = Teclado, P = Pizarra):
 * Semilla 0: E1T – E2P – E3T – E4P – E5T – E6P
 * Semilla 1: E1P – E2T – E3P – E4T – E5P – E6T
 * Semilla 2: E2P – E3T – E4P – E5T – E6P – E1T
 * Semilla 3: E2T – E3P – E4T – E5P – E6T – E1P
 * Semilla 4: E3T – E4P – E5T – E6P – E1T – E2P
 * Semilla 5: E3P – E4T – E5P – E6T – E1P – E2T
 */
export const SEED_ASSIGNMENTS: Record<number, SeedAssignment> = {
  0: {
    seedId: 0,
    description: "Semilla 0 (E1T – E2P – E3T – E4P – E5T – E6P)",
    sequence: [
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
    description: "Semilla 1 (E1P – E2T – E3P – E4T – E5P – E6T)",
    sequence: [
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
    description: "Semilla 2 (E2P – E3T – E4P – E5T – E6P – E1T)",
    sequence: [
      { exerciseId: "ex-2", mode: "pizarra" },
      { exerciseId: "ex-3", mode: "teclado" },
      { exerciseId: "ex-4", mode: "pizarra" },
      { exerciseId: "ex-5", mode: "teclado" },
      { exerciseId: "ex-6", mode: "pizarra" },
      { exerciseId: "ex-1", mode: "teclado" },
    ],
  },
  3: {
    seedId: 3,
    description: "Semilla 3 (E2T – E3P – E4T – E5P – E6T – E1P)",
    sequence: [
      { exerciseId: "ex-2", mode: "teclado" },
      { exerciseId: "ex-3", mode: "pizarra" },
      { exerciseId: "ex-4", mode: "teclado" },
      { exerciseId: "ex-5", mode: "pizarra" },
      { exerciseId: "ex-6", mode: "teclado" },
      { exerciseId: "ex-1", mode: "pizarra" },
    ],
  },
  4: {
    seedId: 4,
    description: "Semilla 4 (E3T – E4P – E5T – E6P – E1T – E2P)",
    sequence: [
      { exerciseId: "ex-3", mode: "teclado" },
      { exerciseId: "ex-4", mode: "pizarra" },
      { exerciseId: "ex-5", mode: "teclado" },
      { exerciseId: "ex-6", mode: "pizarra" },
      { exerciseId: "ex-1", mode: "teclado" },
      { exerciseId: "ex-2", mode: "pizarra" },
    ],
  },
  5: {
    seedId: 5,
    description: "Semilla 5 (E3P – E4T – E5P – E6T – E1P – E2T)",
    sequence: [
      { exerciseId: "ex-3", mode: "pizarra" },
      { exerciseId: "ex-4", mode: "teclado" },
      { exerciseId: "ex-5", mode: "pizarra" },
      { exerciseId: "ex-6", mode: "teclado" },
      { exerciseId: "ex-1", mode: "pizarra" },
      { exerciseId: "ex-2", mode: "teclado" },
    ],
  },
};

/**
 * Obtiene la secuencia completa de ejercicios y modalidades ordenada según la semilla
 */
export function getSeedExerciseSequence(seed: number): SeedExerciseStep[] {
  const seedConfig = SEED_ASSIGNMENTS[seed] || SEED_ASSIGNMENTS[0];
  const exerciseMap = new Map(EXPERIMENT_EXERCISES.map(ex => [ex.id, ex]));

  return seedConfig.sequence.map(step => ({
    exercise: exerciseMap.get(step.exerciseId) || EXPERIMENT_EXERCISES[0],
    mode: step.mode,
  }));
}

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
