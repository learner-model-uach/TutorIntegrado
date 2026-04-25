import { HiChevronRight } from "react-icons/hi";
import { Box, Breadcrumb } from "@chakra-ui/react";
export const NavBreadcrumb = (props: React.ComponentProps<typeof Breadcrumb.Root>) => (
  <Breadcrumb.Root fontSize="sm" {...props}>
    <Breadcrumb.Item color="inherit">
      <Box as={HiChevronRight} color="gray.400" fontSize="md" top="2px" pos="relative" />
      <Breadcrumb.Link>Welcome</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Item color="inherit">
      <Breadcrumb.Link>Product Vision</Breadcrumb.Link>
    </Breadcrumb.Item>
  </Breadcrumb.Root>
);
