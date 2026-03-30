import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import { getEffortCounts } from "./helpers/efficiencyHelpers";
import { VscCircleLarge, VscCircleLargeFilled } from "react-icons/vsc";

type DotProps = BoxProps;

type EffortDotsProps = {
  n: number;
  estimated: number;
};

const dotColor = { base: "#659a5f", _dark: "teal.500" } as const;

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
    <>
      {Array.from({ length: done }).map((_, i) => (
        <SolidDot key={`done-${i}`} />
      ))}
      {Array.from({ length: needed }).map((_, i) => (
        <HollowDot key={`need-${i}`} />
      ))}
    </>
  );
};
