import { Box, Container } from "@chakra-ui/react"
import type { MathComponentMeta } from "../types"
import dynamic from "next/dynamic"

const MathField = dynamic(() => import("./tools/mathLive"),{
  ssr:false
})



interface Props {
  meta: MathComponentMeta
}

const mathComponent = ({meta}: Props) => {
  const {expression, } = meta
  return(
    <Container>
      <MathField readOnly value={meta.expression} onChange={(e)=>{
        
        console.log("evento mathfield---->",e)}}></MathField>
    </Container>
  )
}

export default mathComponent