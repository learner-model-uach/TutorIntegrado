import { Stack } from "@chakra-ui/react";
import React, { Component, useEffect, useState } from "react";
import { Tutor } from "./Tutor";
import Joyride, {
  CallBackProps,
  STATUS,
  Step,
  StoreHelpers,
  ACTIONS,
  EVENTS,
} from "react-joyride";
import { isParseTreeNode } from "typescript";
export default function Tutorial() {
  const [intro, setIntro] = useState({
    run: false,
    backStep: false,
  });

  const CloseBtn = ({ ...props }) => {
    return (
      <button
        style={{ padding: 15, position: "absolute", right: 0, top: 0 }}
        {...props}
      >
        <svg
          width={"14px"}
          height={"14px"}
          viewBox="0 0 18 18"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid"
        >
          <g>
            <path
              d="M8.13911129,9.00268191 L0.171521827,17.0258467 C-0.0498027049,17.248715 -0.0498027049,17.6098394 0.171521827,17.8327545 C0.28204354,17.9443526 0.427188206,17.9998706 0.572051765,17.9998706 C0.71714958,17.9998706 0.862013139,17.9443526 0.972581703,17.8327545 L9.0000937,9.74924618 L17.0276057,17.8327545 C17.1384085,17.9443526 17.2832721,17.9998706 17.4281356,17.9998706 C17.5729992,17.9998706 17.718097,17.9443526 17.8286656,17.8327545 C18.0499901,17.6098862 18.0499901,17.2487618 17.8286656,17.0258467 L9.86135722,9.00268191 L17.8340066,0.973848225 C18.0553311,0.750979934 18.0553311,0.389855532 17.8340066,0.16694039 C17.6126821,-0.0556467968 17.254037,-0.0556467968 17.0329467,0.16694039 L9.00042166,8.25611765 L0.967006424,0.167268345 C0.745681892,-0.0553188426 0.387317931,-0.0553188426 0.165993399,0.167268345 C-0.0553311331,0.390136635 -0.0553311331,0.751261038 0.165993399,0.974176179 L8.13920499,9.00268191 L8.13911129,9.00268191 Z"
              fill={"black"}
            />
          </g>
        </svg>
      </button>
    );
  };

  const Tooltip = ({
    continuous,
    index,
    hideCloseButton,
    isLastStep,
    step,
    backProps,
    primaryProps,
    skipProps,
    tooltipProps,
    closeProps,
  }) => {
    return (
      <div
        style={{
          backgroundColor: " #fff",
          minWidth: " 290px",
          maxWidth: "420px",
          position: "relative",
          boxSizing: "border-box",
          padding: "15px",
          borderRadius: "5px",
        }}
        {...tooltipProps}
      >
        {isLastStep && index === 6 && <CloseBtn {...closeProps} />}
        {step.title && (
          <div style={{ color: " #f04", padding: "20px", margin: 0 }}>
            {step.title}
          </div>
        )}
        {step.content && (
          <div style={{ color: "#000", padding: "20px" }}>{step.content}</div>
        )}
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "flex-end",
            marginTop: " 15px",
          }}
        >
          {index > 0 && (
            <button
              style={{
                backgroundColor: "transparent",
                border: "0px none",
                borderRadius: "0px",
                color: "rgb(255, 0, 68)",
                cursor: "pointer",
                fontSize: "16px",
                lineHeight: 1,
                padding: "8px",
                appearance: "none",
                marginLeft: "auto",
                marginRight: "5px",
              }}
              {...backProps}
            >
              Atrás
            </button>
          )}
          {(!isLastStep || index === 9 || index === 6) && (
            <button
              style={{
                backgroundColor: "rgb(255, 0, 68)",
                border: "0px none",
                borderRadius: "4px",
                color: "rgb(255, 255, 255)",
                cursor: "pointer",
                fontSize: "16px",
                lineHeight: 1,
                padding: "8px",
                appearance: "none",
              }}
              {...primaryProps}
            >
              {index === 9 || (index === 6 && isLastStep)
                ? "Finalizar"
                : "Siguiente"}
            </button>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    setIntro({
      run: true,
      stepIndex: 0,
      steps: [
        {
          target: ".eq-exercise",
          content:
            "En la parte superior se presenta el ejercicio que debes resolver",
          hideCloseButton: true,
          spotlightClicks: true,
          disableOverlayClose: true,
          disableCloseOnEsc: true,
        },
        {
          target: ".box1",
          content:
            "Cada ejercicio es dividido en estos pasos desplegables que indican la acción debes realizar.",
          hideCloseButton: true,
          spotlightClicks: true,
          disableOverlayClose: true,
          disableCloseOnEsc: true,
        },

        {
          target: ".top-panel",
          content:
            "En la primera fila se encuentra el lugar donde debes depositar tu respuesta, además de los botones para corregir y solicitar pistas. ",
          spotlightClicks: true,
          hideCloseButton: true,
          disableOverlayClose: true,
          disableCloseOnEsc: true,
        },
        {
          target: ".answer-panel",
          content:
            "En esta fila se encuentran las posibles soluciones para el paso. Puedes arrastrar estas respuestas o realizar un doble clic sobre ellas, para depositarlas en la parte superior.",
          hideCloseButton: true,
          disableOverlayClose: true,
          disableCloseOnEsc: true,
        },
        {
          target: ".panel1",
          content:
            "Es tu turno, probemos escogiendo una solución incorrecta, toma a=-1, b=-5, c=-6 y presiona el botón corregir.  ",
          hideCloseButton: false,
          disableOverlayClose: true,
          spotlightClicks: true,
          placement: "bottom",
          disableBeacon: true,
          disableCloseOnEsc: true,
        },
      ],
    });
  }, []);

  const handleJoyrideCallback = (data) => {
    const { action, index, type, status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setIntro(() => ({ ...intro, run: false }));
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const stepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      if (index === 7 && action === ACTIONS.PREV) {
        setIntro({ ...intro, backStep: true, run: false });
        setTimeout(() => {
          setIntro({ ...intro, run: true, stepIndex: index - 1 });
        }, 1500);
      }
    }

    console.groupCollapsed(type);
    console.groupEnd();
  };

  const { run, steps, stepIndex } = intro;

  return (
    <div>
      <div>
        <Tutor id={0} setIntro={setIntro} stepIndex={stepIndex} intro={intro} />
      </div>
      <Joyride
        continuous={true}
        callback={handleJoyrideCallback}
        stepIndex={stepIndex}
        run={run}
        steps={steps}
        tooltipComponent={Tooltip}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        disableScrollParentFix={true}
      />
    </div>
  );
}
