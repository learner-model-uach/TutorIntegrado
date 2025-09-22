import { useState, useMemo } from "react";
import { Box, Input, List, ListItem, Flex, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

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
      <Flex wrap="wrap" gap={2} mb={2}>
        {selectedItems.map(item => (
          <Tag key={item.code} size="md" variant="solid" colorScheme="blue">
            <TagLabel>{item.label}</TagLabel>
            <TagCloseButton onClick={() => removeItem(item.code)} />
          </Tag>
        ))}
      </Flex>
      <Input
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="Buscar y seleccionar..."
      />
      <List
        maxH="120px" // 40px por item
        overflowY="auto"
        mt={2}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
      >
        {filteredOptions.map(item => (
          <ListItem
            key={item.code}
            p={2}
            _hover={{ bg: "gray.100" }}
            onClick={() => handleSelect(item)}
            cursor="pointer"
          >
            {item.label}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
