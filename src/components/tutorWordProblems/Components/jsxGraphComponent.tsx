import { graphComponents, GraphMeta, Hint, linearFitMeta, selectPointerMeta } from "../types.d";
import { SelectPoint } from "./selectPoint";
import { LinearFit } from "./linearFit";

interface Props {
  meta: GraphMeta;
  hints: Hint[];
}

const JSXGraphComponent = ({ meta, hints }: Props) => {
  return (
    <>
      {meta.component === graphComponents.selectPoint ? (
        <SelectPoint meta={meta.metaComponent as selectPointerMeta} hints={hints}></SelectPoint>
      ) : meta.component === graphComponents.linearFit ? (
        <LinearFit meta={meta.metaComponent as linearFitMeta} hints={hints}></LinearFit>
      ) : (
        <h1>OTRO COMPONENTE GRAFICO</h1>
      )}
    </>
  );
};

export default JSXGraphComponent;
