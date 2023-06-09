import { Alert,AlertIcon,AlertTitle, AlertDescription } from "@chakra-ui/react"
import type { ReactChildren } from "react"

interface AlertProps{
  title?: string
  status?:  AlertStatus
  children: React.ReactNode
}
export enum AlertStatus {
  success = "success",
  error = "error",
  warning = "warning",
  info = "info"
}
const ResAlert = ({title, status= AlertStatus.success, children}: AlertProps)=>{
  return(
    <Alert status={status} hidden >
      <AlertIcon/>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {children}
      </AlertDescription>
    </Alert>
  )
}

export default ResAlert