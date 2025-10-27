// RecSuperior.tsx — versión Chakra v1
import React from "react";
import { Box, Text, Tooltip } from "@chakra-ui/react";
import Latex from "react-latex-next";

interface RecSuperiorProps {
  expressions: string[];
  currentStep: number;
  stepTitles: string[];
}

const RecSuperior: React.FC<RecSuperiorProps> = ({
  expressions,
  currentStep,
  stepTitles,
}) => {
  return (
    <Box
      bg="black"
      backgroundImage="url('/img/pizarra.jpg')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      border="15px solid black"
      borderColor="#5c4033"
      borderRadius="sm"
      p={3}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="33vh"
      mb={1.5}
    >
      {/* Carga local de fuentes solo para este componente */}
      <style>{`
        @font-face {
          font-family: 'ChalkdusterLocal';
          src: url('/fonts/Chalkduster.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'HalfTermLocal';
          src: url('/fonts/HalfTerm.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        .chalk-local .katex {
          font-family: 'ChalkdusterLocal', 'Segoe Script', cursive !important;
          color: white !important;
          text-shadow: 0 0 3px rgba(255,255,255,0.7);
        }
        .halfTerm-local .katex {
          font-family: 'HalfTermLocal';
          color: white !important;
          text-shadow: 0 0 5px rgba(255,255,255,0.7);
        }
      `}</style>

      {expressions.slice(0, currentStep + 1).map((expression, index) => {
        const title = stepTitles?.[index];
        const tooltipLabel =
          title === "Respuesta final"
            ? "Respuesta final"
            : `Paso ${index + 1}: ${title ?? ""}`;

        return (
          <Box key={index} position="relative" mb={2} width="100%">
            {/* Expresión centrada */}
            <Box display="flex" justifyContent="center">
              <Text fontSize="xl" mb={-5} color="white" className="chalk-local">
                <Latex>{`$$${expression}$$`}</Latex>
              </Text>

              {/* Ícono con tooltip (v1) */}
              {title && (
                <Tooltip
                  label={tooltipLabel}
                  placement="right"
                  openDelay={0}
                  closeDelay={0}
                  hasArrow
                  bg="gray.500"
                  color="white"
                >
                  <Text
                    as="span"
                    fontSize="lg"
                    position="absolute"
                    top="60%"
                    right="30%"
                    transform="translateY(-50%)"
                    mt={1}
                    cursor="pointer"
                    color="whiteAlpha.800"
                    ml={5}
                    aria-label={`Paso ${index + 1}: ${title}`}
                  >
                    ℹ️
                  </Text>
                </Tooltip>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default RecSuperior;
