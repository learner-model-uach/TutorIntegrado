// Pestanas.tsx — versión Chakra v1
import React, { useState } from "react";
import { Tabs, TabList, Tab, TabPanels, TabPanel, Heading, Text } from "@chakra-ui/react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

// Aceptamos componentes que luego instanciamos con props
type TabComp = React.ElementType<{ exerciseData: any; topicID: string }>;

interface PestanasProps {
  tabContents: TabComp[]; // [PasoAPasoComp, RespuestaFinalComp]
  exerciseData: any;
  topicID: string;
}

const tabStyles = {
  w: "xs",
  h: "4vh",
  bg: "gray.300",
  _selected: {
    color: "white",
    bg: "blue.600",
    borderColor: "blue.600",
  },
  _hover: {
    bg: "blue.100",
  },
};

const Pestanas: React.FC<PestanasProps> = ({ tabContents, exerciseData, topicID }) => {
  // v1: Tabs controladas por índice (0,1,...)
  const [tabIndex, setTabIndex] = useState(0 as 0 | 1);

  const enunciado = exerciseData?.steps?.[0]?.expression || "No hay enunciado disponible.";

  // Helper para instanciar componente con props comunes
  const render = (C?: TabComp) => (C ? <C exerciseData={exerciseData} topicID={topicID} /> : null);

  return (
    <div>
      <Heading as="h2" size="md" textAlign="center">
        <Text mb="-3">Expresión inicial del ejercicio:</Text>
        <Latex>{`$$` + enunciado + `$$`}</Latex>
      </Heading>

      {/* v1: Tabs con index/onChange, variant y colorScheme */}
      <Tabs
        index={tabIndex}
        onChange={i => setTabIndex(i as 0 | 1)}
        variant="enclosed"
        colorScheme="blue"
      >
        <TabList justifyContent="center" gap={2}>
          <Tab {...tabStyles}>Paso a Paso</Tab>
          <Tab {...tabStyles} isDisabled>
            Respuesta Final
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>{render(tabContents[0])}</TabPanel>
          <TabPanel>{render(tabContents[1])}</TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};


export default Pestanas;
