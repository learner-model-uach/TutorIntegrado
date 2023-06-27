import { Box, Button } from "@chakra-ui/react"
import {BsQuestionCircle} from 'react-icons/bs'
import type { MathComponentMeta } from "../types"
import dynamic from "next/dynamic"
import { useMemo, useRef, useState } from "react"
import { MathfieldElement } from "mathlive"
import ResAlert from "../Alert/responseAlert"
import { useAlert } from "../hooks/useAlert"
import { AlertStatus } from "../types.d"

const MathField = dynamic(() => import("./tools/mathLive"),{
  ssr:false
})

interface Props {
  meta: MathComponentMeta
}
interface Answer {
  placeholderId: string;
  value: string;
}

const MathComponent = ({meta}: Props) => {
  const {expression, readonly, answers, correctAnswer} = meta
  const [answerState,setAnswer] = useState<Answer[]>([])
  const [disabledButton, setDisabledButton] = useState(false)
  const mfe = useMemo(() => new MathfieldElement, [])

  const {
    alertTitle, 
    alertStatus, 
    alertMsg, 
    alertHidden, 
    showAlert
  } = useAlert("Titulo", AlertStatus.info,"mensaje de la alerta",false,3000)

  const checkAnswer = () => {
    const correctAnswers = answers.filter(answ =>{ // Respuestas correctas
      return correctAnswer.find(correctId => correctId === answ.id)
    })
    answerState.forEach(userAnswer  => { // Respuesta ingresada por el estudiante
  
      correctAnswers.forEach(corrAnswer => {
        if (corrAnswer.placeholderId === userAnswer.placeholderId){
           if (corrAnswer.value === userAnswer.value ){
            console.log("Correcto!!!")
            mfe.setPromptState(userAnswer.placeholderId,"correct",true)
            showAlert("😃", AlertStatus.success,"Respuesta correcta")
            
           
            
          } else if (userAnswer.value === ''){
            console.log("VACIO!!!")
            mfe.setPromptState(userAnswer.placeholderId,"undefined", false)
            showAlert("", AlertStatus.warning, "No ingresaste respuesta en placeholder: "+userAnswer.placeholderId)
          } else {
            console.log("INCORRECTO!!")
            mfe.setPromptState(userAnswer.placeholderId,"incorrect",false)
            showAlert("😕", AlertStatus.error,"Respuesta Incorrecta")  

          }
        }
      })

    })
    
    answerState.forEach(answer =>{
      console.log("prompt State ----->",mfe.getPromptState(answer.placeholderId))

    })

 
    const allCorrect = answerState.map(answer => mfe.getPromptState(answer.placeholderId)[0] === "correct").every(Boolean); // check if all placeholder have correct status
    setDisabledButton(allCorrect); // set disabled status
    //console.log("prompts---->",mfe.getPrompts())
    //mfe.setPromptState('a',"correct",true)
    //showAlert("nuevo titulo", AlertStatus.error,"nuevo msg",3000)
    // Utilizar mfeInstance para realizar acciones en la instancia de MathfieldElement
    /*
    if (mfeInstance && prompts) {
      mfeInstance.setPromptState(prompts[0], "correct", true);
    }
    */
  };
  const handleClickHint = () =>{

    showAlert("hint",AlertStatus.warning,"msg hint",3000)
  }
  const handleMathEditorChange = (latex, promptsValues) => {

    // ... hacer algo con mfeInstance
    console.log("promptValues-->",promptsValues)
    const entries = Object.entries(promptsValues) as [string,string][]
    console.log("entries ------>",entries)
    setAnswer(entries.map(([placeholderId,value])=>({placeholderId,value})))
  };
  return(
    <>    
      <MathField 
        readOnly={readonly}
        mfe = {mfe} 
        value={expression} 
        onChange={handleMathEditorChange}>
      </MathField>

      <Box display='flex' flexDirection='row' justifyContent='end' gap="2" paddingTop='5' alignItems="center" >
        <Button colorScheme="teal" size="sm" onClick={checkAnswer} disabled={disabledButton}>Aceptar</Button>
        <Button rightIcon={<BsQuestionCircle/>} colorScheme="teal" size="sm" variant="outline" onClick={handleClickHint}>Hint</Button>
      </Box>
      <ResAlert title={alertTitle} status={alertStatus} text={alertMsg} alertHidden={alertHidden}  />
    </>
  )
}

export default MathComponent