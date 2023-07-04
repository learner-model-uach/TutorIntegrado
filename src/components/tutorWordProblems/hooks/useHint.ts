import { useEffect, useState } from "react";
import type { Hint } from "../types";


export const useHint = (hints:Hint[]) =>{

  const [displayHints, setDisplayHints] = useState<Hint[]>(hints)
  const [currentHint, setCurrentHint] = useState(0)
  const [totalHints, setTotalHints] = useState(hints.length)
  const [disabledPrevButton, setDisabledPrevButton] = useState(true)
  const [disabledNextButton, setDisabledNextButton] = useState(false)


  useEffect(()=>{ // evaluated when to disable the next and previous buttons of the Hints
    currentHint<=0 
      ? setDisabledPrevButton(true) 
      : setDisabledPrevButton(false)
    currentHint>=totalHints-1 
      ? setDisabledNextButton(true)
      : setDisabledNextButton(false)
  },[currentHint])

  const  nextHint = ()=>{
    console.log("Siguiente Hint")
    currentHint< (totalHints-1) && setCurrentHint(currentHint+1)
  }

  const prevHint = () =>{
    console.log("Hint previo")
    currentHint>0 && setCurrentHint(currentHint-1)
    
  }

  return{
    displayHints,
    currentHint,
    totalHints,
    disabledPrevButton,
    disabledNextButton,
    nextHint,
    prevHint
  }
}