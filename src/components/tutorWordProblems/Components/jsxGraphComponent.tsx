import React from "react";
import { Button } from "@chakra-ui/react";
import { graphComponents, GraphMeta, Hint, linearFitMeta, selectPointerMeta } from "../types.d";
import { SelectionPoint } from "./selectionPoint";
import { LinearFit } from "./linearFit";

interface Props{
  meta: GraphMeta
  hints : Hint[]
}

const JSXGraphComponent = ( {meta, hints}:Props) => {
  


  return (
    <>
      {meta.component === graphComponents.selectPoint 
        ? <SelectionPoint meta={meta.metaComponent as selectPointerMeta} hints={hints} ></SelectionPoint>
        : meta.component === graphComponents.linearFit
        ? <LinearFit meta={meta.metaComponent as linearFitMeta} hints={hints}></LinearFit>
        : <h1>OTRO COMPONENTE GRAFICO</h1>
        
      }
   
    </>
  );
};

export default JSXGraphComponent;
