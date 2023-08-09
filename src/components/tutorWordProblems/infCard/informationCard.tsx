import { Alert, Box, Container, Flex, Image, Text, useMediaQuery } from '@chakra-ui/react'
import Latex from 'react-latex-next';


interface cardInfoProps {
  text: string
  srcImg?: string
  bgColor: string
  hideCard: boolean
}

export const CardInfo = ({text,srcImg, bgColor,hideCard}:cardInfoProps) =>{
  const [isDesktop] = useMediaQuery("(min-width: 768px)");

  return(
    <Alert overflowX="auto" status='warning' bgColor={bgColor} hidden={hideCard}  mb={1} rounded={5}>
      <Flex flexDirection="column">
        
        <Latex>{text}</Latex>
        {srcImg && 
          <Box 
            display="flex" 
            mx="auto"
            width={isDesktop ? "50%" : "100%"} // Tamaño fijo en modo escritorio, responsivo en móvil
            maxW="100%"
            
            marginY={5}
          >

            <Image src={srcImg} alt="Imagen" 
            
            maxWidth="100%" height="auto" />
          </Box> 
        }
      </Flex>
    </Alert>
  )
}