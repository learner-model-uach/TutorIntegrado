import { Box, Button, ButtonGroup, Flex } from "@chakra-ui/react"
import type { Hint, MathComponentMeta } from "../types"
import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
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

  const checkAnswer = () => {
    const correctAnswers = answers.filter(answ =>{ // Se filtran las respuestas correctas
      return correctAnswer.find(correctId => correctId === answ.id)
    })
    answerState.forEach(userAnswer  => { // Respuesta ingresada por el estudiante
      correctAnswers.forEach(corrAnswer => {
        if (corrAnswer.placeholderId === userAnswer.placeholderId){
           if (corrAnswer.value === userAnswer.value ){
            mfe.setPromptState(userAnswer.placeholderId,"correct",true)
            showAlert("😃", AlertStatus.success,correctMsg, null)
          } else if (userAnswer.value === ''){
            mfe.setPromptState(userAnswer.placeholderId,"undefined", false)
            showAlert("", AlertStatus.warning, "Debes completar todos los recuadros!")
          } else {
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
    // check if all placeholder have correct status
    const allCorrect = answerState.map(answer => mfe.getPromptState(answer.placeholderId)[0] === "correct").every(Boolean); 
    setDisabledButton(allCorrect); // set disabled status
  };

  const handleMathFieldChange = (latex, promptsValues) => {
    // ... hacer algo con mfeInstance
    console.log("promptsValues--->", promptsValues)
    const entries = Object.entries(promptsValues) as [string,string][]
    setAnswer(entries.map(([placeholderId,value])=>({placeholderId,value})))
  };
  return(
    <Flex flexDirection='column' >
      <Box width='100%' textAlign='center' mb={4} >
        <MathField 
          readOnly={readonly}
          mfe = {mfe} 
          value={expression} 
          onChange={handleMathFieldChange}>  
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