
import { Button, Divider, List, ListItem} from "@chakra-ui/react"
import React, { useState } from "react"
import type { SelectionMeta } from "../types"

interface Props{
  meta: SelectionMeta
}
const getBackgroundColor = (meta: SelectionMeta, index: number) => {
  const { userSelectedAnswer, correctAnswer } = meta
  console.log("INDEX---->", index)
  console.log("UserSelected",userSelectedAnswer)
  console.log("correctAnser",correctAnswer)

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

  const handleClick = (answerIndex: number, event: React.MouseEvent<HTMLElement>) =>{
    const isCorrectUserAnswer = answerIndex === question.correctAnswer

    isCorrectUserAnswer 
      ? event.currentTarget.style.backgroundColor = "#C6F6D4" 
      : event.currentTarget.style.backgroundColor= "#FED6D7"
    setQuestion(
      {...question, 
        isCorrectUserAnswer: isCorrectUserAnswer, 
        userSelectedAnswer: answerIndex})
  }

  return(
    <List padding="0">
      {props.meta.answers.map((answer,index) =>{
        return(
        <ListItem key={index}  >
          <Button 
            disabled={question.isCorrectUserAnswer}  
            onClick={(e)=> {handleClick(index, e)}} 
            justifyContent="left" 
            variant='ghost' 
            width='100%'>
            {answer}
          </Button>
          <Divider/>
        </ListItem>
        )
      })}

    </List>

  
  )
}

export default AnswerSelection