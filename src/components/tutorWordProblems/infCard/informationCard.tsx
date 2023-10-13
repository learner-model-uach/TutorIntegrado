import { Box, Image, useMediaQuery } from "@chakra-ui/react";
import Latex from "react-latex-next";

interface cardInfoProps {
  text: string;
  srcImg?: string;
  bgColor: string;
  hideCard: boolean;
}

export const CardInfo = ({ text, srcImg, bgColor, hideCard }: cardInfoProps) => {
  const [isDesktop] = useMediaQuery("(min-width: 768px)");

  return (
    <Box bgColor={bgColor} hidden={hideCard} mb={1} rounded={5}>
      <Box overflow="hidden" width="100%" maxW="100%" whiteSpace="normal" padding="3">
        <Latex>{text}</Latex>
        {srcImg && (
          <Box
            display="flex"
            mx="auto"
            width={isDesktop ? "50%" : "100%"} // Tamaño fijo en modo escritorio, responsivo en móvil
            maxW="100%"
            marginY={5}
          >
            <Image src={`/img/${srcImg}`} alt="Imagen" maxWidth="100%" height="auto" />
          </Box>
        )}
      </Box>
    </Box>
  );
};
