import {Box, Button, ButtonGroup, Circle, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, useColorModeValue } from "@chakra-ui/react"
import {ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'
import type { Hint } from "../types"

interface Props{
  hints : Hint[]
  currentHint: number
  totalHints: number
  nextHint: () => void
  prevHint: () => void
  disabledPrevButton : boolean
  disabledNextButton : boolean
  
}
const HintButton = ({hints,currentHint, totalHints,nextHint,prevHint, disabledPrevButton, disabledNextButton}: Props) => {
  const bg = useColorModeValue("white","#2B4264")
  const popoverColor = useColorModeValue("dark","white")
  const borderColor = useColorModeValue("dark","#2B4264")

  const handleClick = () =>{}
  return (
    <Popover placement="bottom" closeOnBlur={false}>
      <PopoverTrigger>
        <Button  colorScheme="teal" size="sm" variant="outline" onClick={handleClick}>
          
          Ayuda &nbsp;
          <Circle size='15px' bg='gray' color='white'>0</Circle>
          
          </Button>
      </PopoverTrigger>
      <PopoverContent color={popoverColor} bg={bg} borderColor={borderColor} >
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          Pista:
        </PopoverHeader>
        <PopoverArrow bg={bg} />
        <PopoverCloseButton/>
        <PopoverBody>
          {hints[currentHint].hint}
        </PopoverBody>
        <PopoverFooter
          border='0'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          pb={4}
        >
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