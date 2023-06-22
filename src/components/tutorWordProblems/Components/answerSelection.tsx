
import { Button, Divider, List, ListItem} from "@chakra-ui/react"
import React, { useState } from "react"
import ResAlert, { AlertStatus } from "../Alert/responseAlert"
import type { SelectionMeta } from "../types"

interface Props{
  meta: SelectionMeta
}
const getBackgroundColor = (meta: SelectionMeta, index: number) => {
  const { userSelectedAnswer, correctAnswer } = meta


  // Si el usuario no ha seleccionado respueseta
  if (userSelectedAnswer == null) return 'transparent'
  // Si ya selecciono pero la respuesta es incorrecta
  if (index !== correctAnswer && index !== userSelectedAnswer) return 'transparent'
  // Si la respuesta es correcta
  if (index === correctAnswer) return 'green'
  // Si esta es la seleccion del usuario pero no es correcta
  if (index === userSelectedAnswer) return 'red'
  return 'transparent'
}

const AnswerSelection = (props : Props)=>{
  const [question, setQuestion] = useState(props.meta)
  const [alertMsg,setAlertMsg] = useState("")
  const [alertHidden, setAlertHidden] = useState(true)
  const [alertType,setAlertType] = useState<AlertStatus>()

  const handleClick = (answerIndex: number, event: React.MouseEvent<HTMLElement>) =>{
    const isCorrectUserAnswer = answerIndex === question.correctAnswer

    if (isCorrectUserAnswer){
      event.currentTarget.style.backgroundColor = "#C6F6D4"
      setAlertMsg("Respuesta correcta")
      setAlertType(AlertStatus.success)
    }else{
      event.currentTarget.style.backgroundColor= "#FED6D7"
      setAlertMsg("Respuesta incorrecta!!")
      setAlertType(AlertStatus.error)
    }
    setAlertHidden(false)
    setQuestion(
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
      <ResAlert alertHidden = {alertHidden} status={alertType}>
        {alertMsg}
      </ResAlert>
    </>

  
  )
}

export default AnswerSelection