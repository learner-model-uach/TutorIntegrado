import { Alert, Box, Container, Flex, Text } from '@chakra-ui/react'
import Latex from 'react-latex-next';


interface cardInfoProps {
  text: string
  srcImg?: string
  bgColor: string
  hideCard: boolean
}

export const CardInfo = ({text,srcImg, bgColor,hideCard}:cardInfoProps) =>{

  return(
    <Alert overflowX="auto" status='warning' bgColor={bgColor} hidden={hideCard}  mb={1} rounded={5}>
      <Flex flexDirection="column">
        
        <Latex>{text}</Latex>
      </Flex>
    </Alert>
  )
}