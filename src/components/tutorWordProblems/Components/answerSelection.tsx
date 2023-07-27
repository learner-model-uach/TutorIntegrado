
import { CheckIcon, CloseIcon } from "@chakra-ui/icons"
import { Box, Button, ButtonGroup, Checkbox, Divider, Flex, List, ListItem, Text} from "@chakra-ui/react"
import React, { useState } from "react"
import ResAlert from "../Alert/responseAlert"
import HintButton from "../Hint/hint"
import { useAlert } from "../hooks/useAlert"
import { useHint } from "../hooks/useHint"
import type { Hint, SelectionMeta } from "../types"
import {AlertStatus} from '../types.d'
interface Props{
  meta: SelectionMeta
  hints: Hint[]
  correctMsg: string
}
// Alternative selection component
const SelectionComponent = ({meta,hints, correctMsg} : Props)=>{
  const [selectionMeta, setSelectionMeta] = useState(meta) // State containing the meta info

  const {
    alertTitle,
    alertStatus,
    alertMsg,
    alertHidden,
    showAlert} = useAlert("",AlertStatus.info,"",true,3000)
    
  const {
    unlockedHints,
    currentHint,
    totalHints, 
    disabledPrevButton, 
    disabledNextButton, 
    numHintsActivated,
    prevHint,
    nextHint,
    unlockHint,
    resetNumHintsActivated} = useHint(hints,1)// aca me quede

  // Function that controls the selection of an alternative
  const handleClick = (answerIndex: number, event: React.MouseEvent<HTMLElement>) =>{
    // We compare if the selected alternative is correct
    const isCorrectUserAnswer = answerIndex === selectionMeta.idCorrectAnswers
     
    if (isCorrectUserAnswer){ // Update color, message and type of alert
      showAlert("😃", AlertStatus.success,correctMsg, null)
    }else{
      showAlert("😕 ",AlertStatus.error,"Respuesta incorrecta!!")      
      unlockHint(answerIndex)
    }
    //setAlertHidden(false) // we make the alert visible
    setSelectionMeta( // Update of the question fields
      {...selectionMeta, 
        isCorrectUserAnswer: isCorrectUserAnswer, 
        userSelectedAnswer: answerIndex})
  }
  return(
    <Flex flexDirection="column" width="100%">
      <List >
        {selectionMeta.answers.map((answer,index) =>{
          return(
          <ListItem paddingBottom={1} key={index}  >
            
            <Button 
              border="1px"
              borderColor="gray.100"
              bgColor={getBackgroundColor(selectionMeta,index)}
              disabled={selectionMeta.isCorrectUserAnswer}  
              onClick={(e)=> {handleClick(index, e)}} 
              justifyContent="left" 
              variant='ghost'
              width='100%'
              height='auto'
              whiteSpace="normal" // Permite que el texto se ajuste en varias líneas
              overflow="hidden"
              textOverflow="ellipsis" // comportamiento al desbordar el componente
              textAlign="left" // Alinea el texto a la izquierda
              display="block" // Asegura que el botón tenga el ancho completo del contenedor
              minH='44px'
              maxW="100%" // Evita que el botón se desborde de su contenedor
              >
                <Flex alignItems="center">

                  <Checkbox 
                    key={index} 
                    icon={selectionMeta.idCorrectAnswers === index ? <CheckIcon w={3} h={3}/> : <CloseIcon w={2} h={2}/>} 
                    isReadOnly={true} 
                    isChecked={selectionMeta.userSelectedAnswer === index}
                    colorScheme={ selectionMeta.idCorrectAnswers === index ? "green": "red"} 
                    paddingRight={4}
                  />
                  <Text marginY={2}>
                    {answer.value}
                  </Text>
                </Flex>
            </Button>
            
          </ListItem>
          )
        })}
      </List>
      <ButtonGroup size='lg' display='flex' justifyContent='flex-end' paddingTop={2}>
        <HintButton 
          hints={unlockedHints} 
          currentHint={currentHint} 
          totalHints={totalHints} 
          prevHint={prevHint} 
          nextHint={nextHint} 
          disabledPrevButton={disabledPrevButton} 
          disabledNextButton={disabledNextButton}
          numEnabledHints= {numHintsActivated}
          resetNumHintsActivated={resetNumHintsActivated}
        ></HintButton>
      </ButtonGroup>
      <ResAlert title={alertTitle} status={alertStatus} text={alertMsg} alertHidden = {alertHidden}  />

    </Flex>
  )
}
export default SelectionComponent

const getBackgroundColor = (meta: SelectionMeta, index: number) => {
  const { userSelectedAnswer, idCorrectAnswers } = meta;

  // Si el usuario no ha seleccionado respuesta
  if (userSelectedAnswer == null) return "transparent";

  // Si la respuesta es correcta
  if (index === idCorrectAnswers) {
    // Si el usuario seleccionó la respuesta correcta
    if (index === userSelectedAnswer) return "#C6F6D4"; // Colorear de verde
    return "transparent"; // Mantener transparente
  }
  // Si la respuesta es incorrecta
  if (index === userSelectedAnswer) return "#FED6D7"; // Colorear de rojo

  return "transparent";
};

