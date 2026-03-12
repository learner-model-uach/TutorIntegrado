import { VStack, Text, RadioGroup } from "@chakra-ui/react";
import { Answers } from "./Answers";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

type ChoiceProps = {
  index: number;
  options: Array<string>;
  itemText: string;
  itemId: string;
};

function Choice({ index, options, itemText, itemId }: ChoiceProps) {
  const [change, setChange] = useState(false);
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
    <VStack align="stretch" w="100%" gap="2">
      <Text hidden={sub.sumbmit ? change : true} color="red.500">
        Este campo es requerido
      </Text>

      <RadioGroup.Root
        name="mathchoice"
        variant="solid"
        colorPalette="teal"
        orientation="vertical"
        onValueChange={({ value }) => {
          Answers.ans["q" + index] = {
            didreply: true,
            response: value,
            itemText,
            itemId,
          };
          setChange(true);
        }}
      >
        {options.map(value => (
          <RadioGroup.Item key={value} value={value} w="90%" px="1" py="1" justifyContent="center">
            {/* input accesible */}
            <RadioGroup.ItemHiddenInput />
            {/* “punto” del radio; se muestra con la variante */}
            <RadioGroup.ItemIndicator />
            {/* etiqueta visible */}
            <RadioGroup.ItemText textAlign="center" fontSize="sm">
              {value}
            </RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </VStack>
  );
}

export default Choice;
