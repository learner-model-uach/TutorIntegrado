
import { Button, ButtonGroup, Divider, List, ListItem} from "@chakra-ui/react"
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
    displayHints,
    currentHint,
    totalHints, 
    disabledPrevButton, 
    disabledNextButton, 
    prevHint,
    nextHint} = useHint(hints,1)// aca me quede

  // Function that controls the selection of an alternative
  const handleClick = (answerIndex: number, event: React.MouseEvent<HTMLElement>) =>{
    // We compare if the selected alternative is correct
    const isCorrectUserAnswer = answerIndex === selectionMeta.correctAnswer
     
    if (isCorrectUserAnswer){ // Update color, message and type of alert
      showAlert("😃", AlertStatus.success,correctMsg, null)
    }else{
      showAlert("😕 ",AlertStatus.error,"Respuesta incorrecta!!")
    }
    //setAlertHidden(false) // we make the alert visible
    setSelectionMeta( // Update of the question fields
      {...selectionMeta, 
        isCorrectUserAnswer: isCorrectUserAnswer, 
        userSelectedAnswer: answerIndex})
  }
  return(
    <>
      <List padding="0">
        {selectionMeta.answers.map((answer,index) =>{
          return(
          <ListItem margin={1} key={index}  >
            <Button 
              bgColor={getBackgroundColor(selectionMeta,index)}
              disabled={selectionMeta.isCorrectUserAnswer}  
              onClick={(e)=> {handleClick(index, e)}} 
              justifyContent="left" 
              variant='ghost' 
              width='100%'>
              {answer.id +". "+ answer.value}
            </Button>
            <Divider/>
          </ListItem>
          )
        })}
      </List>
      <ButtonGroup size='lg' display='flex' justifyContent='flex-end' paddingTop={2}>
        <HintButton 
          hints={displayHints} 
          currentHint={currentHint} 
          totalHints={totalHints} 
          prevHint={prevHint} 
          nextHint={nextHint} 
          disabledPrevButton={disabledPrevButton} 
          disabledNextButton={disabledNextButton}
        ></HintButton>
      </ButtonGroup>
      <ResAlert title={alertTitle} status={alertStatus} text={alertMsg} alertHidden = {alertHidden}  />

    </>
  )
}
export default SelectionComponent

const getBackgroundColor = (meta: SelectionMeta, index: number) => {
  const { userSelectedAnswer, correctAnswer } = meta;

  // Si el usuario no ha seleccionado respuesta
  if (userSelectedAnswer == null) return "transparent";

  // Si la respuesta es correcta
  if (index === correctAnswer) {
    // Si el usuario seleccionó la respuesta correcta
    if (index === userSelectedAnswer) return "#C6F6D4"; // Colorear de verde
    return "transparent"; // Mantener transparente
  }
  // Si la respuesta es incorrecta
  if (index === userSelectedAnswer) return "#FED6D7"; // Colorear de rojo

  return "transparent";
};

