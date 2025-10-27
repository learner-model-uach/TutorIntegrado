import React, { useEffect } from "react";
//import type { ExLog } from "../components/LogicTutor/Tools/ExcerciseType2";
import defaultExercise from "./jsons/pot1.json";
import { ChakraProvider } from "@chakra-ui/react";
import SquareButton from "./BotonCuadrado copy";
import Pestanas from "./Pestanas";
import RespuestaFin from "./RespuestaFin";
import { useAction } from "../../utils/action";

interface PizarraProps {
  exercise?: any;
  topicId: string;
}

const Pizarra: React.FC<PizarraProps> = ({ exercise, topicId = "pot1" }) => {
  const exerciseData = exercise ?? defaultExercise;

  const startAction = useAction({});
  useEffect(() => {
    startAction({
      verbName: "loadContent",
      contentID: exerciseData?.code,
      topicID: topicId, //mandar topico correcto
      extra: {
        tutor: ["PIZARRA"],
        contentID: exerciseData?.code,
      },
    });
  }, []);

  //const cnt = Inter1 as ExLog; //REVISAR TIPO DE LA VARIABLE DEL EJERCICIO

  return (
    <div>
      <ChakraProvider>
        <Pestanas
          tabContents={[SquareButton, RespuestaFin]}
          //tabContents={["SquareButton","RespuestaFin"]}
          exerciseData={exerciseData}
          topicID={topicId}
        />
      </ChakraProvider>
    </div>
  );
};
export default Pizarra;
