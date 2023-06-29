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
    <Box>
      <Image
        src={`/img/${images[currentImageIndex]}`}
        alt={`Image ${currentImageIndex}`}
        loading="lazy"
        width="1440px"
        height="500px"
        objectFit="contain"
        objectPosition="center"
      />
      <Flex justifyContent="center" mt={10}>
        <Button onClick={handlePrevious} marginRight={2} disabled={currentImageIndex === 0}>
          Anterior
        </Button>
        <Button onClick={handleNext} disabled={currentImageIndex === images.length - 1}>
          Siguiente{" "}
        </Button>
      </Flex>
    </Box>
  );
};

export default Carousel;
