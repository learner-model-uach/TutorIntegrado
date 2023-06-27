
import { useState, useEffect } from "react";
import { AlertStatus } from "../types.d";



export const useAlert = (
    initialTitle: string, 
    initialStatus: AlertStatus = AlertStatus.success, 
    msg: string,
    initialAlertHidden: boolean = false,
    timerDuration:number) => {
  const [alertTitle, setTitle] = useState(initialTitle);
  const [alertStatus, setStatus] = useState(initialStatus);
  const [alertMsg, setMsg] = useState(msg)
  const [alertHidden, setAlertHidden] = useState(initialAlertHidden);
  const [alertTimer, setAlertTimer] = useState(timerDuration)

  useEffect(() => {
    if (alertTimer) {
      const timer = setTimeout(() => {
        setAlertHidden(true);
      }, alertTimer);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [alertHidden]);

  const showAlert = (
    newTitle: string,
    newStatus: AlertStatus,
    newMsg: string,
    newTimer?: number
  ) => {
    setTitle(newTitle);
    setStatus(newStatus);
    setMsg(newMsg)
    setAlertHidden(false);
    newTimer && setAlertTimer(newTimer)
  };

  return {
    alertTitle,
    alertStatus,
    alertMsg,
    alertHidden,
    showAlert,
  };
};