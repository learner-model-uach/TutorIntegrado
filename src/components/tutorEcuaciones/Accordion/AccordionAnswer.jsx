import React from "react";
import TeX from "@matejmazur/react-katex";
import { Flex, Text, Box } from "@chakra-ui/react";
import { DRAG_TEXT, DRAG_FIXED, DRAG_FIXED_TWO, INPUT } from "../types";

export const AccordionAnswer = ({
  nStep,
  text,
  inputLabels,
  stepType,
  answer,
}) => {
  let newValue = "";
  if (answer && stepType === DRAG_TEXT) {
    newValue = answer.replace("\\text", "");
    newValue = newValue.replace(/^(.)|(.)$/g, "");
  }

  return (
    <div>
      <Flex>
        <Text
          fontSize={{ sm: "12px", md: "16px", base: "10px", xl: "18px" }}
          style={{}}
        >
          Paso {nStep}. {text}{" "}
        </Text>

        <Text
          style={{
            paddingLeft: "5px",
          }}
        >
          {inputLabels != null && answer && stepType === DRAG_FIXED_TWO && (
            <Box
              fontSize={{ sm: "10px", md: "13px", base: "9px" }}
              width={{
                base: "110px",
                md: "150px",
                lg: "180px",
                xl: "200px",
              }}
            >
              <TeX
                math={inputLabels
                  .concat(answer[0])
                  .concat("=")
                  .concat(answer[1])}
                as="figcaption"
                style={{
                  alignItems: "center",
                }}
              />
            </Box>
          )}
          {inputLabels != null &&
            answer &&
            (stepType === DRAG_FIXED ||
              stepType === INPUT ||
              stepType === DRAG_TEXT) && (
              <Box
                fontSize={{ sm: "12px", md: "15px", base: "9px" }}
                width={{
                  base: "100px",
                  sm: "125px",
                  md: "175px",
                  lg: "200px",
                  xl: "220px",
                }}
              >
                {stepType !== DRAG_TEXT ? (
                  <TeX
                    fontSize={{ base: "3px" }}
                    math={inputLabels.concat(answer)}
                    as="figcaption"
                    style={{
                      alignItems: "center",
                    }}
                  />
                ) : (
                  <Text>{inputLabels.concat(newValue)}</Text>
                )}
              </Box>
            )}
        </Text>
      </Flex>
    </div>
  );
};
