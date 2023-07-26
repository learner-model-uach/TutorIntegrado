import { Box, Button, ButtonGroup, Flex } from "@chakra-ui/react"
import type { Hint, MathComponentMeta } from "../types"
import dynamic from "next/dynamic"
import { useCallback, useMemo, useRef, useState } from "react"
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
  const [answerState,setAnswer] = useState<Answer[]>([]) // utilizar useState provoca que cuando cambie el valor de los placeholders el componente se vuelva a renderizar, provocando el re-renderizado de mathLive
  const answerStateRef = useRef<Answer[]>([]); // Utilizamos useRef para mantener una referencia mutable a answerState

  const [disabledButton, setDisabledButton] = useState(false)
  const mfe = useMemo(() => new MathfieldElement, [])

  const {
    alertTitle, 
    alertStatus, 
    alertMsg, 
    alertHidden, 
    showAlert
  } = useAlert("Titulo", AlertStatus.info,"mensaje de la alerta",false,3000)

  const {
    unlockedHints,
    currentHint,
    totalHints, 
    nextHint,
    prevHint, 
    disabledPrevButton, 
    disabledNextButton,
    numHintsActivated,
    unlockHint,
    resetNumHintsActivated} = useHint(hints,1)

  const checkAnswer = () => {
    let isEmpty = true
    try{
      const correctAnswers = answers.filter(answ =>{ // Se filtran las respuestas correctas
        return correctAnswer.find(correctId => correctId === answ.id)
      })
      answerStateRef.current.forEach(userAnswer  => { // Respuesta ingresada por el estudiante
        correctAnswers.forEach(corrAnswer => {
          if (corrAnswer.placeholderId === userAnswer.placeholderId){
            if (corrAnswer.value === userAnswer.value ){
              mfe.setPromptState(userAnswer.placeholderId,"correct",true)
              isEmpty = false
              
            } else if (userAnswer.value === ''){
              mfe.setPromptState(userAnswer.placeholderId,"undefined", false)
              isEmpty = true
              showAlert("", AlertStatus.warning, "Debes completar todos los recuadros!")

            } else {
              isEmpty = false
              mfe.setPromptState(userAnswer.placeholderId,"incorrect",false)
              
              // TODO: Activar hint
            
            }
          }
        })
      })
      answerStateRef.current.forEach(answer =>{
        console.log("prompt State ----->",mfe.getPromptState(answer.placeholderId))

      })
      // check if all placeholder have correct status
      const allCorrect = answerStateRef.current.map(answer => mfe.getPromptState(answer.placeholderId)[0] === "correct").every(Boolean); 
      if(allCorrect){
        showAlert("😃", AlertStatus.success,correctMsg, null)
        setDisabledButton(allCorrect); // set disabled status
      }else{
        if(!isEmpty){
          showAlert("😕", AlertStatus.error,"Respuesta Incorrecta")  

          unlockHint()
        }
      }
    }
    catch (error){
      console.log(error)
    }
    
  };
  
  const handleMathFieldChange = (latex, promptsValues) => {
    // ... hacer algo con mfeInstance
    console.log("promptsValues--->", promptsValues)
    const entries = Object.entries(promptsValues) as [string, string][];
    
    answerStateRef.current = entries.map(([placeholderId, value]) => ({
      placeholderId,
      value,
    }));


    console.log("answer->", answerStateRef.current)
    //const entries = Object.entries(promptsValues) as [string,string][]
    //setAnswer(entries.map(([placeholderId,value])=>({placeholderId,value})))

    
  }
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
            hints={unlockedHints} 
            currentHint={currentHint} 
            totalHints={totalHints} 
            prevHint={prevHint}
            nextHint={nextHint}
            disabledPrevButton={disabledPrevButton}
            disabledNextButton={disabledNextButton}
            numEnabledHints = {numHintsActivated}
            resetNumHintsActivated={resetNumHintsActivated}
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