import { HStack, Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { clampPercent } from "./helpers/mathHelpers";
import type { OlmProgressBarProps } from "./types";

function useAnimatedPercent(target: number, active: boolean, duration = 500) {
  const [value, setValue] = useState(active ? target : 0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }

    let frameId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * progress));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [active, duration, target]);

  return value;
}

function Bar({ percent, groupPercent = 0, showGroupPercent = false }: OlmProgressBarProps) {
  const p = clampPercent(percent);
  const g = clampPercent(groupPercent);
  const groupOnTop = g <= p;

  return (
    <HStack maxWidth="sm" w="full" gap="2" align="center">
      <Box
        role="progressbar"
        aria-valuenow={p}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso del usuario"
        flex="1"
        borderRadius="full"
        height="16px"
        borderWidth="1px"
        borderColor={"#129a8c"}
        p="2px"
      >
        <Box
          position="relative"
          w="full"
          h="full"
          bg={{ base: "#e1f8f5", _dark: "teal.100" }}
          borderRadius="full"
          overflow="hidden"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            h="100%"
            w={showGroupPercent ? `${g}%` : "0%"}
            bg="#d8d8d8d5"
            borderRadius="full"
            zIndex={groupOnTop ? 1 : 0}
            transition="width 500ms ease"
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            h="100%"
            w={`${p}%`}
            bg={{ base: "#129a8c", _dark: "teal.500" }}
            borderRadius="full"
            zIndex={groupOnTop ? 0 : 1}
          />
        </Box>
      </Box>
    </HStack>
  );
}

function Value({ percent, groupPercent = 0, showGroupPercent = false }: OlmProgressBarProps) {
  const p = clampPercent(percent);
  const g = clampPercent(groupPercent);
  const animatedGroupPercent = useAnimatedPercent(g, showGroupPercent);

  return (
    <Text fontSize="sm" fontWeight="bold" whiteSpace="nowrap">
      <Box as="span" color={{ base: "#129a8c", _dark: "teal.500" }}>
        {p}%
      </Box>
      {showGroupPercent && (
        <>
          <Box as="span" color={{ base: "gray.200", _dark: "gray.400" }}>
            {" | "}
          </Box>
          <Box as="span" color={{ base: "gray.500", _dark: "gray.200" }}>
            {animatedGroupPercent}%
          </Box>
        </>
      )}
    </Text>
  );
}

export default function OlmProgress(props: OlmProgressBarProps) {
  return (
    <HStack maxWidth="sm" w="full" gap="2" align="center">
      <Bar {...props} />
      <Value {...props} />
    </HStack>
  );
}
OlmProgress.Bar = Bar;
OlmProgress.Value = Value;
