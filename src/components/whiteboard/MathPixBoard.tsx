import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaEraser, FaPencilAlt, FaRegCircle, FaTimes } from "react-icons/fa";
import MQStaticMathField from "../../utils/MQStaticMathField";

export interface MathPixBoardProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture?: (latex: string) => void;
  title?: string;
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  stepTitle?: string;
  stepExpression?: string;
}

export const MathPixBoard = ({
  isOpen,
  onClose,
  onCapture,
  title = "Pizarra MathPix",
  strokeColor = "#000",
  strokeWidth = 2,
  backgroundColor = "white",
  stepTitle,
  stepExpression,
}: MathPixBoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const hasDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokesRef = useRef<{ x: number[][]; y: number[][] }>({ x: [], y: [] });
  const currentStrokeRef = useRef<{ x: number[]; y: number[] } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [tool, setTool] = useState<"draw" | "erase">("draw");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current || !contextRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const prevImage = hasDrawingRef.current ? canvas.toDataURL("image/png") : null;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    contextRef.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    contextRef.current.clearRect(0, 0, rect.width, rect.height);
    contextRef.current.fillStyle = backgroundColor;
    contextRef.current.fillRect(0, 0, rect.width, rect.height);

    if (prevImage) {
      const image = new Image();
      image.onload = () => {
        contextRef.current?.drawImage(image, 0, 0, rect.width, rect.height);
      };
      image.src = prevImage;
    }
  }, [backgroundColor]);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    contextRef.current = canvas.getContext("2d");
    hasDrawingRef.current = false;
    strokesRef.current = { x: [], y: [] };
    currentStrokeRef.current = null;
    setIsReady(Boolean(contextRef.current));
    setSubmitError(null);
    resizeCanvas();
  }, [isOpen, resizeCanvas]);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const observer = new ResizeObserver(() => resizeCanvas());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [isOpen, resizeCanvas]);

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!contextRef.current) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = getCanvasPoint(e);
    if (!point) return;

    isDrawingRef.current = true;
    lastPointRef.current = point;
    contextRef.current.beginPath();
    contextRef.current.moveTo(point.x, point.y);

    if (tool === "draw") {
      currentStrokeRef.current = {
        x: [point.x],
        y: [point.y],
      };
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !contextRef.current) return;
    const point = getCanvasPoint(e);
    if (!point || !lastPointRef.current) return;

    const activeColor = tool === "erase" ? backgroundColor : strokeColor;
    const activeWidth = tool === "erase" ? Math.max(6, strokeWidth * 3) : strokeWidth;
    contextRef.current.lineTo(point.x, point.y);
    contextRef.current.strokeStyle = activeColor;
    contextRef.current.lineWidth = activeWidth;
    contextRef.current.lineCap = "round";
    contextRef.current.lineJoin = "round";
    contextRef.current.stroke();
    lastPointRef.current = point;
    hasDrawingRef.current = true;

    if (tool === "draw") {
      currentStrokeRef.current.x.push(point.x);
      currentStrokeRef.current.y.push(point.y);
    }
  };

  const stopDrawing = (e?: React.PointerEvent<HTMLCanvasElement>) => {
    if (e) {
      e.preventDefault();
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    }
    isDrawingRef.current = false;
    lastPointRef.current = null;
    contextRef.current?.closePath();

    if (tool === "draw" && currentStrokeRef.current?.x.length && currentStrokeRef.current.x.length > 1) {
      strokesRef.current.x.push(currentStrokeRef.current.x.map(v => Math.round(v)));
      strokesRef.current.y.push(currentStrokeRef.current.y.map(v => Math.round(v)));
    }
    currentStrokeRef.current = null;
  };

  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    contextRef.current.clearRect(0, 0, rect.width, rect.height);
    contextRef.current.fillStyle = backgroundColor;
    contextRef.current.fillRect(0, 0, rect.width, rect.height);
    hasDrawingRef.current = false;
    strokesRef.current = { x: [], y: [] };
    currentStrokeRef.current = null;
  };

  const handleCapture = async () => {
    if (!canvasRef.current || isSubmitting) return;

    const appId = process.env.NEXT_PUBLIC_MATHPIX_APP_ID;
    const appKey = process.env.NEXT_PUBLIC_MATHPIX_APP_KEY;
    if (!appId || !appKey) {
      setSubmitError("Faltan credenciales de Mathpix en .env.");
      return;
    }

    if (!strokesRef.current.x.length || !strokesRef.current.y.length) {
      setSubmitError("No hay trazos para enviar.");
      return;
    }

    const payload = {
      strokes: {
        strokes: {
          x: strokesRef.current.x,
          y: strokesRef.current.y,
        },
      },
      formats: ["latex_styled"],
    };

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const response = await fetch("https://api.mathpix.com/v3/strokes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "app_id": appId,
          "app_key": appKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Error al procesar Mathpix.");
      }

      const result = await response.json();
      console.log("Mathpix result:", result);
      const latex = result?.latex_styled || result?.latex || "";
      if (!latex) {
        throw new Error("Mathpix no devolvio latex.");
      }
      onCapture?.(latex);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Box position="fixed" inset={0} zIndex="modal" bg="blackAlpha.700">
      <Box
        position="absolute"
        inset={0}
        display="flex"
        alignItems="stretch"
        justifyContent="stretch"
        p={{ base: 3, md: 4 }}
      >
        <Box
          w="100%"
          h="100%"
          bg="#2b3443"
          borderRadius={{ base: "lg", md: "xl" }}
          p={{ base: 2, md: 3 }}
          boxShadow="xl"
        >
          <Box
            h="100%"
            bg="white"
            borderRadius="lg"
            position="relative"
            display="grid"
            gridTemplateRows="auto 1fr auto"
            minH={0}
            overflow="hidden"
          >
            <Button
              aria-label="Cerrar pizarra"
              size="sm"
              variant="ghost"
              position="absolute"
              top={{ base: 2, md: 3 }}
              right={{ base: 2, md: 3 }}
              zIndex={1}
              onClick={onClose}
            >
              <FaTimes />
            </Button>

            <Box px={{ base: 3, md: 4 }} pt={{ base: 3, md: 4 }}>
              {stepTitle ? (
                <Text fontSize="sm" color="gray.700" fontWeight="semibold">
                  {stepTitle}
                </Text>
              ) : null}
              {stepExpression ? (
                <Box mt={2} overflow="visible">
                  <MQStaticMathField exp={stepExpression} currentExpIndex={true} />
                </Box>
              ) : (
                <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                  Ingresa el factor comun:
                </Text>
              )}
              {submitError ? (
                <Text mt={2} fontSize="xs" color="red.500">
                  {submitError}
                </Text>
              ) : null}
            </Box>

            <Box
              position="relative"
              px={{ base: 3, md: 4 }}
              py={{ base: 3, md: 4 }}
              minH={0}
            >
              <Box
                h="100%"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                bg={backgroundColor}
                overflow="hidden"
              >
                <canvas
                  ref={canvasRef}
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerCancel={stopDrawing}
                  onPointerLeave={stopDrawing}
                  style={{
                    cursor: isReady ? "crosshair" : "default",
                    display: "block",
                    width: "100%",
                    height: "100%",
                    touchAction: "none",
                  }}
                />
              </Box>

              <VStack
                position="absolute"
                right={{ base: 4, md: 6 }}
                top={{ base: 6, md: 8 }}
                bg="#2b3443"
                color="white"
                borderRadius="xl"
                p={2}
                gap={2}
                boxShadow="md"
              >
                <Button
                  size="sm"
                  variant={tool === "draw" ? "solid" : "ghost"}
                  colorPalette={tool === "draw" ? "blue" : undefined}
                  aria-label="Lapiz"
                  onClick={() => setTool("draw")}
                >
                  <FaPencilAlt />
                </Button>
                <Button
                  size="sm"
                  variant={tool === "erase" ? "solid" : "ghost"}
                  colorPalette={tool === "erase" ? "blue" : undefined}
                  aria-label="Borrador"
                  onClick={() => setTool("erase")}
                >
                  <FaEraser />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label="Limpiar"
                  onClick={clearCanvas}
                >
                  <FaRegCircle />
                </Button>
              </VStack>
            </Box>

            <HStack
              justifyContent="flex-end"
              px={{ base: 3, md: 4 }}
              pb={{ base: 3, md: 4 }}
              gap={3}
            >
              <Button variant="outline" colorPalette="gray" onClick={onClose}>
                Cancelar
              </Button>
              <Button colorPalette="blue" onClick={handleCapture} loading={isSubmitting}>
                Enviar
              </Button>
            </HStack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};