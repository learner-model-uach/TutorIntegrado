
import { useState, useEffect } from "react";
import { AlertStatus } from "../types.d";

export const useAlert = (
    initialTitle: string, 
    initialStatus: AlertStatus = AlertStatus.success, 
    msg: string,
    initialAlertHidden: boolean = false,
    timerDuration:number  // Establece el temporizador para todas las alertas que no se definan individualmente
  ) => {
  const [alertTitle, setTitle] = useState(initialTitle);
  const [alertStatus, setStatus] = useState(initialStatus);
  const [alertMsg, setMsg] = useState(msg)
  const [alertHidden, setAlertHidden] = useState(initialAlertHidden);
  const [alertTimer, setAlertTimer] = useState(timerDuration)

  useEffect(() => {
    if (alertTimer) {
      const timer = setTimeout(() => {
        console.log("Valor de alertTimer", alertTimer)
        alertTimer !== null && setAlertHidden(true);
      }, alertTimer);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [alertHidden]);

  const showAlert = ( // funcion que despliega la alerta
    newTitle: string,
    newStatus: AlertStatus,
    newMsg: string,
    newTimer?: number | null // permite establecer temporizador especifico para una alerta, si es null la alerta no tiene temporizador
  ) => {
    setTitle(newTitle);
    setStatus(newStatus);
    setMsg(newMsg)
    setAlertHidden(false);
    newTimer !== undefined && setAlertTimer(newTimer)
  };

  return {
    alertTitle,
    alertStatus,
    alertMsg,
    alertHidden,
    showAlert,
  };
};