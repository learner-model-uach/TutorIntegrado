import { BsFillInfoCircleFill } from "react-icons/bs";
import {
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Box,
  VStack,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAction } from "../utils/action";
import { sessionState } from "../components/SessionState";

//interface para poder definir la estuctura de datos en el usestate
interface helpitems {
  colA: string;
  colB: string;
}

//tanto los arreglos de MQ y ASCII pueden ser separados a un json
//MQ
const itemValuesmq = [
  { colA: "Suma", colB: "a+b" },
  { colA: "Resta", colB: "a-b" },
  { colA: "Multiplicacion", colB: "\\cdot a*b" },
  { colA: "Division", colB: "\\frac o a/b" },
  { colA: "Exponente", colB: "a^b" },
  { colA: "Raiz cuadrada", colB: "\\sqrt" },
];
const ejemplosmq = [
  { colA: "Ejemplos", colB: "" },
  { colA: "7-4+2=5", colB: "7-(4+2)=1" },
  { colA: "1^2*3=3", colB: "1^(2*3)=1" },
];
//Ascii
const itemValues = [
  { colA: "Suma", colB: "a+b" },
  { colA: "Resta", colB: "a-b" },
  { colA: "Multiplicacion", colB: "a*b" },
  { colA: "Division", colB: "a/b" },
  { colA: "Exponente", colB: "a^b" },
  { colA: "Raiz cuadrada", colB: "raiz(b)" },
];
const ejemplos = [
  { colA: "Ejemplos", colB: "" },
  { colA: "7-4+2=5", colB: "7-(4+2)=1" },
  { colA: "1^2*3=3", colB: "1^(2*3)=1" },
];

const AyudaMQ = ({ exType }: { exType?: string }) => {
  //seleccion del tipo de ayuda por defecto mostrara ascii
  const [iVal, setIVal] = useState<Array<helpitems>>([{ colA: "no", colB: "ha" }]);
  const [ej, setEj] = useState<Array<helpitems>>([{ colA: "cargado", colB: "nada" }]);

  useEffect(() => {
    if (exType?.localeCompare("mq") == 0) {
      setIVal(itemValuesmq);
      setEj(ejemplosmq);
    } else if (exType?.localeCompare("ascii") == 0) {
      setIVal(itemValues);
      setEj(ejemplos);
    } else {
      setIVal(itemValues);
      setEj(ejemplos);
    }
  }, []);

  return (
    <Box>
      <VStack>
        <Heading size="m">Ayuda para ingreso de operaciones</Heading>
        <Box>
          {iVal.map((item, i) => (
            <HStack key={"AHSB" + i} spacing="75px">
              <Box key={"AB1B" + i} w="100px">
                {item.colA}
              </Box>
              <Box key={"AB2B" + i} w="100px">
                {item.colB}
              </Box>
            </HStack>
          ))}
        </Box>
        <Heading size="m">Importante el uso de parentesis</Heading>
        <Box>
          {ej.map((item, i) => (
            <HStack key={"EHSB" + i} spacing="75px">
              <Box key={"EB1B" + i} w="100px">
                {item.colA}
              </Box>
              <Box key={"EB2B" + i} w="100px">
                {item.colB}
              </Box>
            </HStack>
          ))}
        </Box>
      </VStack>
    </Box>
  );
};

const Info = ({ exType }: { exType?: string }) => {
  const action = useAction();
  const content = sessionState.currentContent.id;
  const topic = sessionState.topic;
  const handleClick = () => {
    action({
      verbName: "DisplayHelp",
      contentID: content,
      topicID: topic,
    });
  };
  return (
    <Box p="4" alignItems="center" justifyContent="center" margin={"auto"}>
      <Popover onOpen={handleClick}>
        <PopoverTrigger>
          <IconButton
            //onClick={or here}
            variant="outline"
            colorScheme="teal"
            aria-label="Call Sage"
            fontSize="20px"
            icon={<BsFillInfoCircleFill />}
          />
        </PopoverTrigger>
        <PopoverContent position="fixed" top={0} right={0} zIndex={9999}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>{exType ? <AyudaMQ exType={exType} /> : <AyudaMQ />}</PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
export default Info;
