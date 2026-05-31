import { useState, useMemo } from "react";
import { Box, Input, List, Flex, Tag } from "@chakra-ui/react";

export default function SearchableSelect({ selectedItems, onChange, availableKCs }) {
  const [inputValue, setInputValue] = useState("");

  const options = useMemo(() => {
    // Opciones que no están en selectedItems
    return availableKCs.filter(kc => !selectedItems.some(sel => sel.code === kc.code));
  }, [availableKCs, selectedItems]);

  const filteredOptions = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    return options.filter(
      opt =>
        q === "" ||
        (opt.label && opt.label.toLowerCase().includes(q)) ||
        (opt.code && opt.code.toLowerCase().includes(q)),
    );
  }, [options, inputValue]);

  const handleSelect = item => {
    onChange([...selectedItems, item]);
    setInputValue("");
  };

  const removeItem = code => {
    onChange(selectedItems.filter(item => item.code !== code));
  };

  return (
    <Box bg="gray.50" borderRadius="md" p={4}>
      {/* Contenedor de los items seleccionados */}
      <Flex wrap="wrap" gap={2} mb={2}>
        {selectedItems.map(item => (
          <Tag.Root key={item.code} size="md" variant="solid" colorPalette="blue">
            <Tag.Label>{item.label}</Tag.Label>
            <Tag.CloseTrigger onClick={() => removeItem(item.code)} />
          </Tag.Root>
        ))}
      </Flex>
      
      {/* Input de búsqueda */}
      <Input
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="Buscar y seleccionar..."
      />
      
      {/* Lista de opciones filtradas */}
      <List.Root
        maxH="120px" // 40px por item
        overflowY="auto"
        mt={2}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        listStyleType="none"
      >
        {filteredOptions.map(item => (
          <List.Item
            key={item.code}
            p={2}
            _hover={{ bg: "gray.100" }}
            onClick={() => handleSelect(item)}
            cursor="pointer"
          >
            {item.label}
          </List.Item>
        ))}
      </List.Root>
    </Box>
  );
}