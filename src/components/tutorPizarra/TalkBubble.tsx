import { Box, Text, BoxProps } from "@chakra-ui/react";

interface TalkBubbleProps extends BoxProps {
  children: React.ReactNode;
  textColor?: string; // 🔹 NUEVO
}

const TalkBubble = ({ children, textColor, ...props }: TalkBubbleProps) => {
  return (
    <Box
      position="relative"
      bg="orange.50"
      border="3px solid"
      borderColor="blue.100"
      borderRadius="lg"
      p={6}
      mb={8}
      ml="20px"
      boxShadow="lg"
      _before={{
        content: '""',
        position: "absolute",
        left: "-9px",
        top: "45px",
        width: "16px",
        height: "16px",
        bg: "orange.50",
        borderLeft: "3px solid",
        borderBottom: "2px solid",
        borderColor: "blue.100",
        transform: "rotate(45deg)",
      }}
      {...props}
    >
      <Text
        fontWeight="bold"
        fontSize="lg"
        color={textColor ?? "gray.700"} // 🔹 NUEVO
        textAlign="left"
        whiteSpace="pre-wrap" // 👈 aquí
        position="relative"
        zIndex={1}
      >
        {children}
      </Text>
    </Box>
  );
};

export default TalkBubble;
