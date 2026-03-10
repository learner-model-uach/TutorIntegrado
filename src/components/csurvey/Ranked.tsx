import {
  Slider,
  Text,
} from "@chakra-ui/react";
import { Answers } from "./Answers";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import React from "react";

const marks = [
  { value: 0, label: <Text color="white">0%</Text> },
  { value: 20, label: <Text color="white">20%</Text> },
  { value: 40, label: <Text color="white">40%</Text> },
  { value: 60, label: <Text color="white">60%</Text> },
  { value: 80, label: <Text color="white">80%</Text> },
  { value: 100, label: <Text color="white">100%</Text> },
]


const Ranked = ({
  index,
  itemText,
  itemId,
}: {
  index: number;
  itemText: string;
  itemId: string;
}) => {
  const [change, setChange] = useState(false);
  const [sliderValue, setSliderValue] = React.useState<number>(50);
  const sub = useSnapshot(Answers);

  useEffect(() => {
    Answers.ans["q" + index] = {
      didreply: false,
      response: "",
      itemText,
      itemId,
    };
  }, [index, itemId, itemText]);

  return (
    <>
      <Text hidden={sub.sumbmit ? change : true} color="red.500">
        Este campo es requerido
      </Text>
      <Slider.Root
        min={0}
        max={100}
        step={1}
        defaultValue={[50]}
        colorPalette="teal"
        w="80%"
        style={{
          // separa los marks por debajo de la pista
          "--slider-marker-offset": "121px",
          
        } as React.CSSProperties}
        value={[sliderValue]}
        onValueChange={({ value }) => {
          const v = value[0] ?? 0;
          Answers.ans["q" + index] = {
            didreply: true,
            response: v.toFixed(0),
            itemText,
            itemId,
          };
          setChange(true);
          setSliderValue(v);
        }}
      >
        <Slider.Control>
          <Slider.Track cursor="pointer" bg="gray.400">
            <Slider.Range />
          </Slider.Track >  
          <Slider.Thumb index={0} cursor="button" bg="teal.700">
            <Slider.DraggingIndicator
              layerStyle="fill.solid"
              bottom="6"
              rounded="sm"
              px="1.5"
            >
              <Slider.ValueText /> {/* mostrará 0–100 */}
            </Slider.DraggingIndicator>
            <Slider.HiddenInput />
          </Slider.Thumb>
          <Slider.Marks marks={marks}/>
        </Slider.Control>
      </Slider.Root>

    </>
  );
};

export default Ranked;
