import { useEffect, useRef } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import type { Board, BoardAttributes } from "jsxgraph";
import JXG from "jsxgraph";
import type { settings } from "../types.d";

export const useBoard = (boardId: string, graphSettings: settings) => {
  const strokeWidthAxes = 1;
  const bgBoardColor = useColorModeValue("white", "whiteAlpha.900");
  const axisColor = useColorModeValue("black", "black");
  const boardRef = useRef<Board | null>(null);
  //const {data, correctPoint, graphSettings} = meta
  const boundingBox = graphSettings?.bounding
    ? ([
        graphSettings.bounding.X1,
        graphSettings.bounding.Y1,
        graphSettings.bounding.X2,
        graphSettings.bounding.Y2,
      ] as [number, number, number, number])
    : ([-5, 5, 5, -5] as [number, number, number, number]);
  const maxBoundingBox = graphSettings?.maxBounding
    ? ([
        graphSettings.maxBounding.X1,
        graphSettings.maxBounding.Y1,
        graphSettings.maxBounding.X2,
        graphSettings.maxBounding.Y2,
      ] as [number, number, number, number])
    : ([-Infinity, Infinity, Infinity, -Infinity] as [number, number, number, number]);
  const showOriginAxis = graphSettings?.originAxis ?? true;
  const xAxisSettings = graphSettings?.newAxis.xAxis;
  const yAxisSettings = graphSettings?.newAxis.yAxis;
  const activeZoom = graphSettings?.activeZoom ?? true;

  useEffect(() => {
    const board = JXG.JSXGraph.initBoard(boardId, {
      title: "TITULO DEL GRAFICO",
      logging: true,
      showCopyright: false,
      showFullscreen: false,
      showInfobox: true, // muestra informacion al pasar el mouse sobre los puntos
      boundingBox: boundingBox, // x1, y1, x2, y2
      maxBoundingBox: maxBoundingBox,
      pan: {
        // establece el compontamiento en dispositivos mobiles, requiere doble touch en el grafico para moverse dentro
        enabled: true,
        needTwoFingers: true,
      },
      browserPan: true,
      zoom: {
        enabled: activeZoom,
      },
      showZoom: activeZoom,
      axis: showOriginAxis,

      selection: {
        enabled: true,
        needShift: false,
        needCtrl: true,
        withLines: false,
        vertices: {
          visible: false,
        },
        fillColor: "#ffff00",
      },
    } as Partial<BoardAttributes>);

    if (!showOriginAxis && xAxisSettings && yAxisSettings) {
      // Crear líneas de ejes en una posición específica
      // @ts-ignore
      const xAxis = board.create("axis", [xAxisSettings?.point1, xAxisSettings?.point2], {
        // punto 1 (x,y) , punto 2 (x,y)
        ticks: {
          drawLabels: true,
          ticksDistance: xAxisSettings?.tiksDistance ?? 1,
          insertTicks: true,

          //minorTicks: 5,
          label: {
            offset: xAxisSettings?.stickOffset ?? [-4, -5], // [-4,-15],
            fontSize: xAxisSettings?.stickFontSize ?? 12,
          },
        },
        strokeColor: axisColor,
        strokeWidth: strokeWidthAxes,
        name: xAxisSettings?.labelName ?? "", //"Año",
        withLabel: true,
        label: {
          position: "rt",
          offset: xAxisSettings?.labelOffset ?? [-30, -30],
          fontSize: xAxisSettings?.labelFontSize ?? 16,
        },
      });
      // @ts-ignore
      const yAxis = board.create("axis", [yAxisSettings?.point1, yAxisSettings?.point2], {
        ticks: {
          drawLabels: true,
          ticksDistance: yAxisSettings?.tiksDistance ?? 1, // Establecer el espaciado de las marcas del eje y a 10
          insertTicks: true,
          label: {
            offset: yAxisSettings?.stickOffset ?? [-30, 0], // espaciado con el eje
            fontSize: yAxisSettings?.stickFontSize ?? 12, // Ajustar el tamaño de la fuente de las etiquetas
          },
        },
        strokeColor: axisColor,
        strokeWidth: strokeWidthAxes,
        name: yAxisSettings.labelName ?? "",
        withLabel: true,
        label: {
          // titulo
          position: "rt",
          offset: yAxisSettings?.labelOffset ?? [10, 0],
          fontSize: yAxisSettings?.labelFontSize ?? 16, // Ajustar el tamaño de la fuente de la etiqueta del eje
        },
      });
    }

    boardRef.current = board; // guardamos referencia del board
  }, []);

  const disableBoard = () => {
    if (boardRef.current) {
      //console.log("DISABLED");
      //boardRef.current.suspendUpdate();
      boardRef.current.removeEventHandlers();
    }
  };

  const createLine = (point1, point2) => {
    if (boardRef.current) {
      boardRef.current.create("line", [point1, point2]);
    }
  };
  return {
    boardId,
    boardRef,
    bgBoardColor,
    disableBoard,
    createLine,
  };
};
