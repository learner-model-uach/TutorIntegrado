import {Box, Button, ButtonGroup, Circle, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useColorModeValue } from "@chakra-ui/react"
import {ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'
import type { Hint } from "../types"
import Latex from "react-latex-next"

interface Props{
  hints : Hint[]
  currentHint: number
  totalHints: number
  nextHint: () => void
  prevHint: () => void
  disabledPrevButton : boolean
  disabledNextButton : boolean
  numEnabledHints: number
  resetNumHintsActivated: ()=> void
  
}
const HintButton = (
  {hints,
    currentHint, 
    totalHints,
    nextHint,
    prevHint, 
    disabledPrevButton, 
    disabledNextButton,
    numEnabledHints = 0,
    resetNumHintsActivated
  }: Props) => {
  const bg = useColorModeValue("white","#2B4264")
  const popoverColor = useColorModeValue("dark","white")
  const borderColor = useColorModeValue("dark","#2B4264")

  const handleClick = () =>{
    resetNumHintsActivated()
  }
  return (
    <Popover placement="bottom" closeOnBlur={false}>
      <PopoverTrigger>
        <Button color={numEnabledHints !== 0 ? "red": undefined}  colorScheme="teal" size="sm" variant="outline" onClick={handleClick}>
          Ayuda &nbsp;
          <Circle bg={numEnabledHints !== 0 ? "red": "gray"} color="white" size='15px' > {numEnabledHints}</Circle>
        </Button>
      </PopoverTrigger>
      <PopoverContent color={popoverColor} bg={bg} borderColor={borderColor} >
        <PopoverHeader pt={4} fontWeight="bold" border="0"> Pista:</PopoverHeader>
        <PopoverArrow bg={bg} />
        <PopoverCloseButton/>
        <PopoverBody>
          {
            hints[currentHint] &&
            <Box width="auto" overflow="auto">
              <Latex >{hints[currentHint]?.hint}</Latex>
            </Box>
          }
        </PopoverBody>
        <PopoverFooter border='0'display='flex' alignItems='center' justifyContent='space-between' pb={4}>
          <Box fontSize="sm" >Pista {currentHint+1} de {totalHints}</Box>
          <ButtonGroup size="sm">
            <Button variant="outline" onClick={prevHint} isDisabled={disabledPrevButton}>
              <ChevronLeftIcon color={popoverColor}/>
            </Button>
            <Button variant="outline" onClick={nextHint} isDisabled={disabledNextButton} >
              <ChevronRightIcon color={popoverColor} />
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}

export default HintButton