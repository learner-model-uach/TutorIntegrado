import { Select, Box } from '@chakra-ui/react';
import { useState } from 'react';

export default function newExercise() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');

  const topics = {
    Factorización: ['Factorización por factor común', 'Factorización por agrupación', 'Diferencia de cuadrados'],
    ProductosNotables: ['Binomio al cuadrado', 'Trinomio cuadrado perfecto', 'Binomio conjugado'],
    Fracciones: ['Suma y resta de fracciones', 'Multiplicación y división de fracciones'],
    Raíces: ['Raíz cuadrada', 'Raíz cúbica', 'Raíces de índice n'],
  };
  return (
    <>
      <div>
        <Box>
            <Select
                width="200px"
                placeholder="Tópico"
                mb={2}
                onChange={(e) => {
                setSelectedTopic(e.target.value);
                setSelectedSubtopic("");
            }}>
                {Object.keys(topics).map(topic => (
                <option key={topic} value={topic}>{topic}</option>
            ))}
            </Select>
            {selectedTopic && (
            <Select
                width="200px"
                placeholder="Subtópico" value={selectedSubtopic} onChange={(e) => setSelectedSubtopic(e.target.value)}>
                {topics[selectedTopic].map(subtopic => (
                <option key={subtopic} value={subtopic}>{subtopic}</option>
                ))}
            </Select>
            )}
        </Box>
      </div>
    </>
  );
}