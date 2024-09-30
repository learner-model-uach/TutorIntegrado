import { Textarea, Box, Button } from '@chakra-ui/react';
import { useState } from 'react';

export default function newExercise() {
  const [textInput, setTextInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');

  const handleTransformToJson = () => {
    // JSON base
    let jsonResult = {
      code: "",
      meta: {},
      text: "",
      type: "lvltutor",
      steps: [
        {
          KCs: ["IdeTer2"],
          hints: [
            {
              hint: "La fórmula de cuadrado de binomio es a²+2ab+b²=(a+b)², utiliza el término del medio para obtener el segundo término",
              hintId: 0
            },
            {
              hint: "Teniendo el término del medio dividido en 2, debes encontrar el número el cual multiplicado por el primer número del cuadrado de binomio (1x) te da como resultado dicho término (1x*?=4). Finalmente, eleva el número resultante al cuadrado",
              hintId: 1
            },
            { hint: "El resultado es 16.", hintId: 2 }
          ],
          stepId: "0",
          values: [{ name: "x", value: 1 }],
          answers: [{ answer: ["16"], nextStep: "2" }],
          summary: "1) Se obtiene término faltante.",
          stepTitle: "Encuentra el término faltante '?'",
          correctMsg: "Has encontrado el término.",
          expression: "x²+8x+'?'",
          validation: "evaluateAndCount",
          incorrectMsg: "Revisa que la expresión ingresada este correcta.",
          displayResult: ["16"],
          matchingError: []
        },
        {
          KCs: ["IdeTer2"],
          hints: [
            {
              hint: "La fórmula de cuadrado de binomio es a²+2ab+b²=(a+b)², y en el paso anterior encontraste el término 'b²'.",
              hintId: 0
            },
            {
              hint: "Para encontrar el segundo término del cuadrado de binomio, debes calcular la raíz cuadrada del término obtenido en el paso anterior",
              hintId: 1
            },
            { hint: "El resultado es (x+4)².", hintId: 2 }
          ],
          stepId: "2",
          values: [{ name: "x", value: 2 }],
          answers: [{ answer: ["(x+4)^{2}"], nextStep: "-1" }],
          summary: "2) Se obtiene el cuadrado de binomio.",
          stepTitle: "Representa la expresión como un cuadrado de binomio.",
          correctMsg: "Has encontrado el cuadrado de binomio.",
          expression: "x²+8x+16",
          validation: "evaluateAndCount",
          incorrectMsg: "Revisa que la expresión ingresada este correcta.",
          displayResult: ["(x+4)^{2}"],
          matchingError: []
        }
      ],
      title: "Cuadrado de binomio"
    };

    // Función para actualizar campos específicos en el JSON
    const updateJsonWithInput = (input) => {
      const lines = input.split('\n'); // Dividir el texto en líneas por saltos de línea
      
      lines.forEach((line) => {
        const [key, ...valueArr] = line.split(':'); 
        const value = valueArr.join(':').trim();
        switch (key.trim().toLowerCase()) {
          case 'code':
            jsonResult.code = value;
            break;
          case 'type':
            jsonResult.type = value;
            break;
          case 'meta':
            try {
              jsonResult.meta = JSON.parse(value);
            } catch (error) {
              console.error("Error parsing meta:", error);
            }
            break;
          case 'text':
            jsonResult.text = value;
            break;
          default:
            break;
        }
      });
    };

    updateJsonWithInput(textInput);

    setJsonOutput(JSON.stringify(jsonResult, null, 2));
  };

  return (
    <>
      <div>
        <Box display="flex" flexDirection="row" gap={4}>
          <Box>
            <Textarea
              width="400px"
              height="200px"
              placeholder="Inserte texto aquí (code: valor, type: valor, meta: {...})"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <Button mt={2} onClick={handleTransformToJson}>
              Transformar a JSON
            </Button>
          </Box>
          <Box>
            <Textarea
              width="400px"
              height="200px"
              placeholder="Resultado JSON"
              value={jsonOutput}
              readOnly
            />
          </Box>
        </Box>
      </div>
    </>
  );
}
