import { HStack, Text, Box, Progress } from "@chakra-ui/react";
import { getColorScheme } from "./tools";

const ProgressBar = ({ label, progress, color }) => {
  const valueColor = color ?? getColorScheme(progress);
  return (
    <HStack w="100%" justify="space-between">
      <HStack justify="space-between" w="100%">
        <Text>{label}</Text>
        <HStack w="80%" justify="space-between">
          <Box
            w={{ base: "70%", sm: "85%" }}
            bg="white"
            p={1}
            borderWidth="1px"
            borderColor="gray.300"
          >
            <Progress.Root value={progress} size="lg" colorPalette="gray">
              <Progress.Track bg="white">
                <Progress.Range bg={valueColor} />
              </Progress.Track>
            </Progress.Root>
          </Box>
          <Text
            fontWeight="bold"
            color={progress <= 50 ? "red.500" : progress < 70 ? "orange.400" : "green.300"}
          >
            {Math.round(progress) + " %"}
          </Text>
        </HStack>
      </HStack>
    </HStack>
  );
};

export default ProgressBar;
