
import { Button, Divider, List, ListItem} from "@chakra-ui/react"
import React, { useState } from "react"
import ResAlert from "../Alert/responseAlert"
import { useAlert } from "../hooks/useAlert"
import type { SelectionMeta } from "../types"
import {AlertStatus} from '../types.d'
interface Props{
  meta: SelectionMeta
}
// Alternative selection component
const SelectionComponent = (props : Props)=>{
  const [question, setQuestion] = useState(props.meta) // State containing the question
  /*
  const [alertMsg,setAlertMsg] = useState("") // State containing the alert message
  const [alertHidden, setAlertHidden] = useState(true) // State containing the state (show or hide) of the alert
  const [alertType,setAlertType] = useState<AlertStatus>() // State containing the type of alert (correct, error, warning)
  */

  const {alertTitle,alertStatus,alertMsg,alertHidden,showAlert} = useAlert("",AlertStatus.info,"",true,3000)
  // Function that controls the selection of an alternative
  const handleClick = (answerIndex: number, event: React.MouseEvent<HTMLElement>) =>{
    // We compare if the selected alternative is correct
    const isCorrectUserAnswer = answerIndex === question.correctAnswer
     

    if (isCorrectUserAnswer){ // Update color, message and type of alert
      //event.currentTarget.style.backgroundColor = "#C6F6D4"
      /*
      setAlertMsg("Respuesta correcta")
      setAlertType(AlertStatus.success)
      */
      showAlert("😃", AlertStatus.success,"Respuesta correcta")
    }else{
      //event.currentTarget.style.backgroundColor= "#FED6D7"
      /*
      setAlertMsg("Respuesta incorrecta!!")
      setAlertType(AlertStatus.error)
      */ 
      showAlert("😕 ",AlertStatus.error,"Respuesta incorrecta!!")
    }
    //setAlertHidden(false) // we make the alert visible
    setQuestion( // Update of the question fields
      {...question, 
        isCorrectUserAnswer: isCorrectUserAnswer, 
        userSelectedAnswer: answerIndex})
  }
  return(
    <>
      <List padding="0">
        {props.meta.answers.map((answer,index) =>{
          return(
          <ListItem margin={1} key={index}  >
            <Button 
              bgColor={getBackgroundColor(question,index)}
              disabled={question.isCorrectUserAnswer}  
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

