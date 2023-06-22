import { Alert,AlertIcon,AlertTitle, AlertDescription } from "@chakra-ui/react"
import type { ReactChildren } from "react"

interface AlertProps{
  title?: string
  status?:  AlertStatus
  children: React.ReactNode
  alertHidden?: boolean
}
export enum AlertStatus {
  success = "success",
  error = "error",
  warning = "warning",
  info = "info"
}
const ResAlert = ({title, status= AlertStatus.success, alertHidden= false , children}: AlertProps)=>{
  return(
    <Alert margin={2} status={status} hidden={alertHidden} >
      <AlertIcon/>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {children}
      </AlertDescription>
    </Alert>
  )
}

export default ResAlert