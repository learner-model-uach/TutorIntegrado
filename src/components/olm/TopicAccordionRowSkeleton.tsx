import { Box, HStack, Skeleton, Table } from "@chakra-ui/react";

export default function TopicAccordionRowSkeleton() {
  return (
    <Table.Row bg="transparent">
      <Table.Cell bg="transparent">
        <Skeleton height="16px" width="16px" />
      </Table.Cell>

      <Table.Cell bg="transparent">
        <Skeleton height="20px" width="220px" maxW="100%" />
      </Table.Cell>

      <Table.Cell bg="transparent">
        <HStack justify="center" width="100%">
          <Skeleton height="12px" width="140px" borderRadius="md" maxW="100%" />
        </HStack>
      </Table.Cell>

      <Table.Cell bg="transparent">
        <Skeleton height="20px" width="20px" />
      </Table.Cell>

      <Table.Cell bg="transparent" textAlign="center">
        <Skeleton height="18px" width="18px" mx="auto" />
      </Table.Cell>

      <Table.Cell bg="transparent">
        <Box display="flex" justifyContent="flex-end">
          <Skeleton height="18px" width="72px" maxW="100%" />
        </Box>
      </Table.Cell>

      <Table.Cell bg="transparent">
        <Skeleton height="20px" width="20px" />
      </Table.Cell>
    </Table.Row>
  );
}
