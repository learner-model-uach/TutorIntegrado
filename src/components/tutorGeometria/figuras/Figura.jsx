import React from "react";
import { TrianguloRectangulo } from "./TrianguloRectangulo";
import { Circulo, Rectangulo, Triangulo } from "./Areas";
import { Paralelas, TrianguloParalela, Sombras, Escala } from "./Thales";

// Elige el dibujo según `figura.tipo`. Los tipos nuevos se agregan aquí.
const tipos = {
  trianguloRectangulo: TrianguloRectangulo,
  circulo: Circulo,
  rectangulo: Rectangulo,
  triangulo: Triangulo,
  paralelas: Paralelas,
  trianguloParalela: TrianguloParalela,
  sombras: Sombras,
  escala: Escala,
};

export const Figura = ({ figura, pasoActual, resuelto }) => {
  const Dibujo = tipos[figura?.tipo];
  if (!Dibujo) return null;
  const foco = figura.pasos?.[pasoActual] ?? [];
  return <Dibujo figura={figura} foco={resuelto ? [] : foco} resuelto={resuelto} />;
};

export const tieneFigura = exercise => !!tipos[exercise?.figura?.tipo];
