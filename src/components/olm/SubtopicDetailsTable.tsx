import { Box, Center, Popover, Table, Text } from "@chakra-ui/react";
import { ImUsers } from "react-icons/im";
import { BsQuestionCircle } from "react-icons/bs";
import { Tooltip } from "../ui/tooltip";
import SubtopicRow from "./SubtopicRow";
import type { KcByTopicMap, OlmModelState, Topic } from "./types";

interface SubtopicDetailsTableProps {
  topic: Topic;
  isOpen: boolean;
  model: OlmModelState[];
  groupModel?: OlmModelState[];
  kcsByTopic: KcByTopicMap;
  exerciseCountsByChild: Record<number, number>;
  efficiencyByChild?: Record<number, number>;
  showGroupByChild: Record<number, boolean>;
  onToggleChildGroup: (
    childId: number,
    showGroupChild: boolean,
    groupSubtopicPercent: number,
    userSubtopicPercent: number,
  ) => void;
}

export default function SubtopicDetailsTable({
  topic,
  isOpen,
  model,
  groupModel,
  kcsByTopic,
  exerciseCountsByChild,
  efficiencyByChild,
  showGroupByChild,
  onToggleChildGroup,
}: SubtopicDetailsTableProps) {
  return (
    <Table.Row bg="bg.secondary">
      <Table.Cell colSpan={7} p={0} borderBottomWidth="0">
        <Box
          display="grid"
          gridTemplateRows={isOpen ? "1fr" : "0fr"}
          opacity={isOpen ? 1 : 0}
          transition="grid-template-rows 260ms ease, opacity 180ms ease"
        >
          <Box
            overflow="hidden"
            minH={0}
            position={{ base: "sticky", md: "static" }}
            left={{ base: 0, md: "auto" }}
            w={{ base: "calc(100vw - 24px)", md: "full" }}
            maxW={{ base: "calc(100vw - 24px)", md: "none" }}
          >
            <Box p={{ base: 2, md: 4 }} minW={0}>
              <Text display={{ base: "block", md: "none" }} fontSize="xs" color="fg.muted" mb="2">
                Desliza horizontalmente para ver el detalle del subtópico.
              </Text>
              <Box
                w="full"
                minW={0}
                overflowX="auto"
                overflowY="hidden"
                pb="2"
                touchAction="auto"
                overscrollBehaviorX="contain"
                css={{ WebkitOverflowScrolling: "touch" }}
              >
                <Box
                  display="inline-block"
                  minW={{ base: "760px", md: "100%" }}
                  verticalAlign="top"
                >
                  <Box
                    borderWidth="1px"
                    borderColor={{ base: "gray.300", _dark: "gray.600" }}
                    borderRadius="md"
                    overflow="hidden"
                    bg="bg.secondary"
                  >
                    <Table.Root
                      variant="line"
                      size="sm"
                      interactive
                      minW={{ base: "760px", md: "100%" }}
                      css={{
                        "& tbody tr:last-of-type td": {
                          borderBottomWidth: 0,
                        },
                      }}
                    >
                      <Table.Header>
                        <Table.Row bg="bg/90">
                          <Table.ColumnHeader
                            fontSize="xs"
                            color="gray.50"
                            fontWeight="semibold"
                            htmlWidth="30%"
                            whiteSpace="nowrap"
                          >
                            SUBTÓPICOS
                          </Table.ColumnHeader>

                          <Table.ColumnHeader
                            fontSize="xs"
                            color="gray.50"
                            fontWeight="semibold"
                            htmlWidth="20%"
                            textAlign="center"
                            whiteSpace="nowrap"
                          >
                            PROGRESO
                          </Table.ColumnHeader>
                          <Table.ColumnHeader htmlWidth="10%"></Table.ColumnHeader>

                          <Table.ColumnHeader
                            fontSize="xs"
                            color="gray.50"
                            fontWeight="semibold"
                            htmlWidth="10%"
                            textAlign="center"
                            whiteSpace="nowrap"
                          >
                            <Center>
                              <Tooltip
                                showArrow
                                content="Mostrar progreso de grupo"
                                positioning={{ placement: "top" }}
                                contentProps={{ css: { "--tooltip-bg": "colors.gray.700" } }}
                              >
                                <ImUsers />
                              </Tooltip>
                            </Center>
                          </Table.ColumnHeader>

                          <Table.ColumnHeader
                            fontSize="xs"
                            color="gray.50"
                            fontWeight="semibold"
                            textAlign="end"
                            whiteSpace="nowrap"
                          >
                            <Box
                              as="span"
                              display="inline-flex"
                              alignItems="center"
                              gap="1"
                              lineHeight="1"
                            >
                              <Text as="span" lineHeight="1">
                                ESFUERZO
                              </Text>
                              <Popover.Root>
                                <Popover.Trigger asChild>
                                  <Box
                                    as="span"
                                    display="inline-flex"
                                    alignItems="center"
                                    cursor="pointer"
                                  >
                                    <BsQuestionCircle
                                      style={{
                                        display: "block",
                                        position: "relative",
                                        top: "-1px",
                                      }}
                                    />
                                  </Box>
                                </Popover.Trigger>
                                <Popover.Positioner>
                                  <Popover.Content
                                    maxW="xs"
                                    w="260px"
                                    p="3"
                                    bg="black"
                                    color="gray.200"
                                    whiteSpace="normal"
                                    wordBreak="normal"
                                    css={{ "--popover-bg": "black" }}
                                  >
                                    <Popover.Arrow />
                                    <Popover.CloseTrigger />
                                    <Text fontWeight="normal" fontSize="sm" textAlign="center">
                                      Ejercicios completados y estimación de ejercicios que quedan
                                      por realizar para completar el subtópico.
                                    </Text>
                                  </Popover.Content>
                                </Popover.Positioner>
                              </Popover.Root>
                            </Box>
                          </Table.ColumnHeader>
                          <Table.ColumnHeader
                            fontSize="xs"
                            color="gray.50"
                            textAlign="center"
                            htmlWidth="5%"
                          ></Table.ColumnHeader>
                          <Table.ColumnHeader
                            fontSize="xs"
                            color="gray.50"
                            fontWeight="semibold"
                            textAlign="center"
                            htmlWidth="10%"
                            whiteSpace="nowrap"
                          >
                            <Box
                              as="span"
                              display="inline-flex"
                              alignItems="center"
                              gap="1"
                              lineHeight="1"
                            >
                              <Text as="span" lineHeight="1">
                                EFICIENCIA
                              </Text>
                              <Popover.Root>
                                <Popover.Trigger asChild>
                                  <Box
                                    as="span"
                                    display="inline-flex"
                                    alignItems="center"
                                    cursor="pointer"
                                  >
                                    <BsQuestionCircle
                                      style={{
                                        display: "block",
                                        position: "relative",
                                        top: "-1px",
                                      }}
                                    />
                                  </Box>
                                </Popover.Trigger>
                                <Popover.Positioner>
                                  <Popover.Content
                                    maxW="xs"
                                    w="260px"
                                    p="3"
                                    bg="black"
                                    color="gray.200"
                                    whiteSpace="normal"
                                    wordBreak="normal"
                                    css={{ "--popover-bg": "black" }}
                                  >
                                    <Popover.Arrow />
                                    <Popover.CloseTrigger />
                                    <Text fontWeight="normal" fontSize="sm">
                                      Tasa de pasos realizados correctamente en el primer intento de
                                      un ejercicio (sin errores ni ayuda).
                                    </Text>
                                  </Popover.Content>
                                </Popover.Positioner>
                              </Popover.Root>
                            </Box>
                          </Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>
                        {topic.childrens
                          .filter(child => kcsByTopic[child.id] && kcsByTopic[child.id].length > 0)
                          .map(child => {
                            const childId = Number(child.id);

                            return (
                              <SubtopicRow
                                key={child.id}
                                child={child}
                                model={model}
                                groupModel={groupModel}
                                kcsByTopic={kcsByTopic}
                                exerciseCount={exerciseCountsByChild[childId] ?? 0}
                                rawEfficiency={efficiencyByChild?.[childId] ?? 0}
                                showGroupChild={showGroupByChild[childId] ?? false}
                                onToggleGroup={onToggleChildGroup}
                              />
                            );
                          })}
                      </Table.Body>
                    </Table.Root>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Table.Cell>
    </Table.Row>
  );
}
