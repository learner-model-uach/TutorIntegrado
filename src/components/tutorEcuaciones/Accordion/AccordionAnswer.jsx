import React from "react";
import TeX from "@matejmazur/react-katex";
import { Flex, Text, Box } from "@chakra-ui/react";
import { DRAG_TEXT, DRAG_FIXED, DRAG_FIXED_TWO, INPUT } from "../types";
import { FaHandPointRight } from "react-icons/fa";

export const AccordionAnswer = ({ nStep, text, inputLabels, stepType, answer }) => {
  let newValue = "";
  if (answer && stepType === DRAG_TEXT) {
    newValue = answer.replace("\\text", "").replace(/^(.)|(.)$/g, "");
  }

  return (
    <Box>
      <Flex>
        <Box pr={3} pt={1}>
          <FaHandPointRight />
        </Box>

        <Box fontSize={{ base: "10px", sm: "12px", md: "16px", xl: "18px" }}>
          {text}
        </Box>

        <Text pl="5px">
          {inputLabels != null && answer && stepType === DRAG_FIXED_TWO && (
            <Box
              fontSize={{ base: "9px", sm: "10px", md: "13px" }}
              w={{ base: "110px", md: "150px", lg: "180px", xl: "200px" }}
            >
              <TeX
                math={inputLabels.concat(answer[0]).concat("=").concat(answer[1])}
                as="figcaption"
                style={{ alignItems: "center" }}
              />
            </Box>
          )}

          {inputLabels != null &&
            answer &&
            (stepType === DRAG_FIXED || stepType === INPUT || stepType === DRAG_TEXT) && (
              <Box
                fontSize={{ base: "9px", sm: "12px", md: "15px" }}
                w={{ base: "100px", sm: "125px", md: "175px", lg: "200px", xl: "220px" }}
              >
                {stepType !== DRAG_TEXT ? (
                  <TeX
                    math={inputLabels.concat(answer)}
                    as="figcaption"
                    style={{ alignItems: "center" }}
                  />
                ) : (
                  <Text>{inputLabels.concat(newValue)}</Text>
                )}
              </Box>
            )}
        </Text>
      </Flex>
    </Box>
  );
};
