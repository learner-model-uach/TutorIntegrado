import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import { getEffortCounts } from "./helpers/efficiencyAndEffortHelpers";
import { VscCircleLarge, VscCircleLargeFilled } from "react-icons/vsc";

type DotProps = BoxProps;

type EffortDotsProps = {
  n: number;
  estimated: number;
};

const dotColor = { base: "#129a8c", _dark: "teal.500" } as const;

const HollowDot = (props: DotProps) => (
  <Box
    as="span"
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    color={dotColor}
    {...props}
  >
    <VscCircleLarge size="0.9em" />
  </Box>
);

const SolidDot = (props: DotProps) => (
  <Box
    as="span"
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    color={dotColor}
    {...props}
  >
    <VscCircleLargeFilled size="0.9em" />
  </Box>
);

export const EffortDots: React.FC<EffortDotsProps> = ({ n, estimated }) => {
  const { done, needed } = getEffortCounts(n, estimated);
  return (
    <Box
      as="span"
      display="inline-flex"
      flexWrap="wrap"
      justifyContent="flex-end"
      maxW="9em"
      rowGap="1"
      verticalAlign="middle"
    >
      {Array.from({ length: done }).map((_, i) => (
        <SolidDot key={`done-${i}`} />
      ))}
      {Array.from({ length: needed }).map((_, i) => (
        <HollowDot key={`need-${i}`} />
      ))}
    </Box>
  );
};
