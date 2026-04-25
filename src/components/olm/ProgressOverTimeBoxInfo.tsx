import { Box, Highlight, Image, Text } from "@chakra-ui/react";

type ProgressOverTimeBoxInfoProps = {
  message: string;
  highlightQuery?: string[];
};

export default function ProgressOverTimeBoxInfo({
  message,
  highlightQuery = [],
}: ProgressOverTimeBoxInfoProps) {
  return (
    <Box
      mb={4}
      w="80%"
      mx="auto"
      px="4"
      py="3"
      borderRadius="md"
      // bg={{ base: "teal.100", _dark: "teal.900" }}
      bg={{ base: "orange.50", _dark: "teal.900" }}
      borderWidth="1px"
      // borderColor={{ base: "teal.200", _dark: "teal.700" }}
      borderColor={{ base: "orange.emphasized", _dark: "teal.700" }}
    >
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "90px 1fr" }}
        alignItems="center"
        gap={4}
      >
        <Box display={{ base: "none", md: "flex" }} justifyContent="center">
          <Image src="/img/head.svg" alt="Mateo" maxW="70px" h="auto" />
        </Box>
        <Text color={{ base: "{indigo.900}", _dark: "white" }} fontWeight="medium">
          <Highlight
            query={highlightQuery}
            styles={{
              px: "0.5",
              borderRadius: "sm",
              bg: { base: "orange.muted", _dark: "teal.800" },
              color: { base: "orange.fg", _dark: "teal.200" },
              fontWeight: "semibold",
            }}
          >
            {message}
          </Highlight>
        </Text>
      </Box>
    </Box>
  );
}
