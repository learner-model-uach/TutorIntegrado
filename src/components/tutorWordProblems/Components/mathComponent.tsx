import { Box, Button, ButtonGroup, Center, Flex } from "@chakra-ui/react"
import {BsQuestionCircle} from 'react-icons/bs'
import type { Hint, MathComponentMeta, Step } from "../types"
import dynamic from "next/dynamic"
import { useMemo, useRef, useState } from "react"
import { MathfieldElement } from "mathlive"
import ResAlert from "../Alert/responseAlert"
import { useAlert } from "../hooks/useAlert"
import { AlertStatus } from "../types.d"
import HintButton from "../Hint/hint"
import { useHint } from "../hooks/useHint"

const MathField = dynamic(() => import("./tools/mathLive"),{
  ssr:false
})

interface Props {
  
  meta: MathComponentMeta
  hints: Hint[]
  correctMsg?: string
}
interface Answer {
  placeholderId: string;
  value: string;
}

const MathComponent = ({meta, hints, correctMsg}: Props) => {
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

  const {displayHints,currentHint,totalHints, nextHint,prevHint, disabledPrevButton, disabledNextButton} = useHint(hints,1)
  console.log("HINTS--->", hints)
  console.log(displayHints)

  const checkAnswer = () => {
    const correctAnswers = answers.filter(answ =>{ // Se filtran las respuestas correctas
      return correctAnswer.find(correctId => correctId === answ.id)
    })
    answerState.forEach(userAnswer  => { // Respuesta ingresada por el estudiante
  
      correctAnswers.forEach(corrAnswer => {
        if (corrAnswer.placeholderId === userAnswer.placeholderId){
           if (corrAnswer.value === userAnswer.value ){
            console.log("Correcto!!!")
            mfe.setPromptState(userAnswer.placeholderId,"correct",true)
            showAlert("😃", AlertStatus.success,correctMsg, null)
            
           
            
          } else if (userAnswer.value === ''){
            console.log("VACIO!!!")
            mfe.setPromptState(userAnswer.placeholderId,"undefined", false)
            showAlert("", AlertStatus.warning, "Debes completar todos los recuadros!")
          } else {
            
            console.log("CorrAnswer--->",corrAnswer)
            console.log("UserAnswer--->",userAnswer)
            mfe.setPromptState(userAnswer.placeholderId,"incorrect",false)
            showAlert("😕", AlertStatus.error,"Respuesta Incorrecta")  
            
            // TODO: Activar hint
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

  const handleMathEditorChange = (latex, promptsValues) => {

    // ... hacer algo con mfeInstance
    console.log("promptValues-->",promptsValues)
    const entries = Object.entries(promptsValues) as [string,string][]
    console.log("entries ------>",entries)
    setAnswer(entries.map(([placeholderId,value])=>({placeholderId,value})))
  };
  return(
    <Flex flexDirection='column' >
      <Box width='100%' textAlign='center' mb={4} >
        <MathField 
          readOnly={readonly}
          mfe = {mfe} 
          value={expression} 
          onChange={handleMathEditorChange}>
          
        </MathField>
        
      </Box>    
      <Flex justifyContent="flex-end">

        <ButtonGroup size="lg" display="flex" justifyContent="flex-end">
          <Button colorScheme="teal" size="sm" onClick={checkAnswer} disabled={disabledButton}>Aceptar</Button>
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

      </Flex>
      <Box width='100%'>

        <ResAlert title={alertTitle} status={alertStatus} text={alertMsg} alertHidden={alertHidden}  />
      </Box>
    </Flex>


  )
}

export default MathComponent