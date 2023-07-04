import { Alert,AlertIcon,AlertTitle, AlertDescription, Collapse, ScaleFade } from "@chakra-ui/react"
import {AlertStatus} from '../types.d'

interface AlertProps{
  title?: string
  status?:  AlertStatus
  //children: React.ReactNode
  text: String
  alertHidden?: boolean
}

const ResAlert = ({title, status= AlertStatus.success, alertHidden= false , text}: AlertProps)=>{
  return(
    <Collapse in={!alertHidden} animateOpacity>    
      <Alert margin={2} status={status}>
        <AlertIcon/>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          {text}
        </AlertDescription>
      </Alert>
    </Collapse>
  )
}

export default ResAlert