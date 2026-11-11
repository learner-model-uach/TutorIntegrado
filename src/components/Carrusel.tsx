import React, { useState } from "react";
import { Box, Image, Button, Flex } from "@chakra-ui/react";

export const Carousel = ({ images }: { images: string[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevious = (): void => {
    setCurrentImageIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = (): void => {
    setCurrentImageIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <Box width="full">
      <Flex width="full" justifyContent="center">
        <Image
          src={`/img/${images[currentImageIndex]}`}
          alt={`Image ${currentImageIndex}`}
          loading="lazy"
          width="auto"
          height="auto"
          maxWidth="full"
          maxHeight={{ base: "none", md: "65vh" }}
          objectFit="contain"
        />
      </Flex>
      <Flex justifyContent="center" mt={{ base: 4, md: 6 }}>
        <Button
          bg="stealblue.300"
          onClick={handlePrevious}
          marginRight={2}
          disabled={currentImageIndex === 0}
        >
          Anterior
        </Button>
        <Button
          bg="stealblue.300"
          onClick={handleNext}
          disabled={currentImageIndex === images.length - 1}
        >
          Siguiente{" "}
        </Button>
      </Flex>
    </Box>
  );
};

export default Carousel;
