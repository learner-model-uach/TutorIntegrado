import { Input, InputGroup, InputGroupProps, InputProps } from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";

interface SearchInputProps extends InputProps {
  rootProps?: InputGroupProps;
}

export const SearchInput = ({ rootProps, ...rest }: SearchInputProps) => {
  return (
    <InputGroup
      maxW="2xs"
      display={{ base: "none", lg: "block" }}
      startElement={<BsSearch color="gray.400" />}
      {...rootProps}
    >
      <Input
        size="sm"
        variant="outline"
        placeholder="Search"
        rounded="md"
        _placeholder={{ color: "gray.400" }}
        {...rest}
      />
    </InputGroup>
  );
};
