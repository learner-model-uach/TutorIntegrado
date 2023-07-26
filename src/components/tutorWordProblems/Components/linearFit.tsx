import { Box, Button, ButtonGroup, Flex, useMediaQuery } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import ResAlert from "../Alert/responseAlert"
import HintButton from "../Hint/hint"
import { useAlert } from "../hooks/useAlert"
import  { useBoard } from "../hooks/useBoard"
import { useHint } from "../hooks/useHint"
import { AlertStatus, Hint, linearFitMeta, slider } from "../types.d"


interface Props{
  meta : linearFitMeta
  hints: Hint[]
}
export const LinearFit = ({meta, hints}: Props) =>{
  const [isScreenLarge] = useMediaQuery("(min-width: 768px)")
  const {data, linearFunction, correctAnswer} = meta
  const {m,b} = linearFunction
  const {boardId, boardRef,disableBoard} = useBoard("linearFitBoard",meta.graphSettings)
  const mSliderRef = useRef(null)
  const bSliderRef = useRef(null)
  const [disabledButton, setDisabledButton] = useState(false)

  const {
    alertTitle
    ,alertStatus,
    alertMsg, 
    alertHidden, 
    showAlert} = useAlert("",AlertStatus.info,"",false,3000)

  const {
    unlockedHints, 
    currentHint,
    totalHints,
    disabledPrevButton,
    disabledNextButton,
    numHintsActivated,
    nextHint,
    prevHint,
    unlockHint,
    resetNumHintsActivated} = useHint(hints,1)

  useEffect(()=>{
    data.forEach(point =>{
      const isStatic = point?.isStatic ?? true
      const facePoint = point?.face ?? "circle"
      const p = boardRef.current.create("point",point.coord,{name: point?.name,color: point?.color, fixed: isStatic, face: facePoint  })
      p.on("down", ()=>{
        console.log("coordenadas---->",p.coords.usrCoords)
        //setUserAnswer(p.coords.usrCoords)
      })
    })
 
   if(m.slider && b.slider){
    console.log("m y b son slider")
    const mSlider = createSlider(m.slider)
    const bSlider = createSlider(b.slider)

    mSliderRef.current = mSlider
    bSliderRef.current = bSlider

    const mval = function(){return mSlider.Value()}
    const bval = function(){return bSlider.Value()}
    const linF = function(x){return mval()*x + bval()}

    var G = boardRef.current.create('functiongraph',[linF], {strokeWidth: 2});
   } else if (m.slider && !b.slider){
    console.log("m es slider")
    const mSlider = createSlider(m.slider)
    mSliderRef.current = mSlider
    const mval = function(){return mSlider.Value()}
    const linF = function(x){return mval()*x + b?.value}
    const G = boardRef.current.create('functiongraph',[linF], {strokeWidth: 2});

   } else if (!m.slider && b.slider){
    const bSlider = createSlider(b.slider)
    bSliderRef.current = bSlider
    const bval = function(){return bSlider.Value()}
    const linF = function(x){return m?.value*x + bval()}
   }
  },[])


  const createSlider = (sliderInfo: slider ) => {
    // Si es un objeto slider, creamos el slider en el board
    return boardRef.current.create("slider", [
      sliderInfo.startPoint,
      sliderInfo.endPoint,
      [sliderInfo.min, sliderInfo.initialValue, sliderInfo.max]
    ], {
      snapWidth: sliderInfo.snapWidth,
      precision: sliderInfo.precision,
      ticks: { drawLabels: false },
      name: sliderInfo.name
    });
    
  };


  const checkAnswer = ()=>{
    const mvalue = mSliderRef.current ? mSliderRef.current.Value() : undefined
    const bvalue = bSliderRef.current ? bSliderRef.current.Value() : undefined

    const mIsCorrect =
    mvalue === undefined 
      ? true // si es undefined => no es un Slider y se retorna true (no hay nada que comprobar)
      : checkSliderValue(mvalue, correctAnswer.mCorrect as [number, number]);

  const bIsCorrect =
    bvalue === undefined 
      ? true 
      : checkSliderValue(bvalue, correctAnswer.bCorrect as [number, number]);



  if (mIsCorrect && bIsCorrect) {
    console.log("¡Respuesta correcta en ambos casos!");
    showAlert("😃", AlertStatus.success,"Muy bien!", null)
    setDisabledButton(true)
    disableBoard()
  } else {
    console.log("Respuesta incorrecta");
    showAlert("😕", AlertStatus.error,"Respuesta Incorrecta")
    unlockHint()
  }
  }

  const checkSliderValue = (
    sliderValue: number,
    correctRange: [number, number] 
  ) => {
    return correctRange[0] <= sliderValue && sliderValue <= correctRange[1];
  };

  const handleHintClick = () =>{
    boardRef.current.create("functiongraph",[function(x){return -0.8583*x+1963.8}],{strokeWidth:2})
  }


  return(
    <Flex flexDirection="column" alignContent="center" flexWrap="wrap" width="100%" maxW="100%">
      <Box  
          rounded="2xl"
          shadow="lg"
          overflow="hidden"
          width={isScreenLarge ? "500px" : "100%"}
          height={isScreenLarge ? "500px" : "100%"}
          pb={isScreenLarge ? undefined : "100%"}
          position="relative"
          maxW={isScreenLarge ? "500px" : undefined}
          maxH={isScreenLarge ? "500px" : undefined}
      >
        <div id={boardId} style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}></div>
      </Box>

      <ButtonGroup size='lg' display='flex' justifyContent='flex-end' paddingTop={5}>
        <Button onClick={checkAnswer} disabled={disabledButton} colorScheme="teal" size="sm" >Aceptar</Button>
        <HintButton 
            hints={unlockedHints} 
            currentHint={currentHint} 
            totalHints={totalHints} 
            prevHint={prevHint}
            nextHint={nextHint}
            disabledPrevButton={disabledPrevButton}
            disabledNextButton={disabledNextButton}
            interactiveHint={handleHintClick}
            numEnabledHints= {numHintsActivated}
            resetNumHintsActivated={resetNumHintsActivated}
        ></HintButton>

      </ButtonGroup>
      <ResAlert title={alertTitle} status={alertStatus} alertHidden={alertHidden} text={alertMsg}></ResAlert>
    </Flex>
  )
}