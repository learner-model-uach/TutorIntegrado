import { Alert,AlertIcon,AlertTitle, AlertDescription } from "@chakra-ui/react"
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
    <Alert margin={2} status={status} hidden={alertHidden} >
      <AlertIcon/>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {text}
      </AlertDescription>
    </Alert>
  )
}

export default ResAlert