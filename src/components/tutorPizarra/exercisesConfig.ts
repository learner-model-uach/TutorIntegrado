// components/exercisesConfig.ts
// Requiere "resolveJsonModule": true en tsconfig (ya lo tienes)

// Importa los JSON de ejercicios
import exercise1 from "./jsons/pnc3b02.json";
import exercise2 from "./jsons/pnc3b05.json";
import exercise3 from "./jsons/pnc3b08.json";
import exercise4 from "./jsons/raNum5.json";
import exercise5 from "./jsons/raNum9.json";
import exercise6 from "./jsons/raNum14.json";
import exercise7 from "./jsons/fracc2.json";
import exercise8 from "./jsons/fracc16.json";
import exercise9 from "./jsons/fracc20.json";
import exercise10 from "./jsons/fracc12.json"; // Ejemplo adicional

//Nombres tipados:

//export const j1 = exercise1;
export const j1 = exercise10; //ejercicio prueba
export const j2 = exercise2;
export const j3 = exercise3;
export const j4 = exercise4;
export const j5 = exercise5;
export const j6 = exercise6;
export const j7 = exercise7;
export const j8 = exercise8;
export const j9 = exercise9;

export type MotorType = 1 | 2; // 1: Solver2 (Plain), 2: Pizarra

// Mapa opcional (por si alguna vez quieres iterar por nombre)
export const all = { j1, j2, j3, j4, j5, j6, j7, j8, j9 } as const;

// El mismo arreglo de arreglos que tenías, pero aquí centralizado:
export const exerciseGroups: ReadonlyArray<ReadonlyArray<readonly [any, MotorType]>> = [
  [
    [j1, 2],
    [j1, 2],
  ], //array de prueba
  //  [[j1, 1], [j4, 2], [j7, 1], [j2, 2], [j5, 1]],
  [
    [j3, 2],
    [j6, 1],
    [j8, 2],
    [j5, 1],
    [j1, 2],
  ],
  [
    [j9, 1],
    [j4, 2],
    [j2, 1],
    [j6, 2],
    [j3, 1],
  ],
  [
    [j5, 2],
    [j1, 1],
    [j7, 2],
    [j3, 1],
    [j8, 2],
  ],
  [
    [j6, 1],
    [j9, 2],
    [j1, 1],
    [j4, 2],
    [j2, 1],
  ],
  [
    [j7, 2],
    [j5, 1],
    [j2, 2],
    [j8, 1],
    [j6, 2],
  ],
  [
    [j3, 1],
    [j8, 2],
    [j4, 1],
    [j1, 2],
    [j9, 1],
  ],
  [
    [j4, 2],
    [j2, 1],
    [j5, 2],
    [j9, 1],
    [j3, 2],
  ],
  [
    [j8, 1],
    [j1, 2],
    [j6, 1],
    [j7, 2],
    [j5, 1],
  ],
  [
    [j2, 2],
    [j9, 1],
    [j4, 2],
    [j3, 1],
    [j7, 2],
  ],
] as const;
