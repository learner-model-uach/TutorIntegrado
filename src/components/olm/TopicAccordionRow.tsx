import React, { useState } from "react";
import {
  Table,
  Box,
  Text,
  Collapsible,
  TableCell,
  Popover,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { FaChevronRight, FaChevronDown, FaRegEyeSlash, FaEye, FaInfoCircle } from "react-icons/fa";
import { ImUsers } from "react-icons/im";
import { roundTo } from "./helpers/mathHelpers";
import {
  estimateEffort,
  infoText,
  pluralizeExercise,
  getMoodEmoji,
} from "./helpers/efficiencyHelpers";
import { getSubtopicPercent, getSubtopicGroupPercent } from "./helpers/topicHelpers";
import { EffortDots } from "./EffortDots";
import type { TopicAccordionRowProps } from "./types";
import OlmProgress from "./OlmProgress";
import { Tooltip } from "../ui/tooltip";
import { BsQuestionCircle } from "react-icons/bs";
import { useAction } from "../../utils/action";
const ICON_COLOR = { base: "#659a5f", _dark: "teal.500" } as const;

const TopicAccordionRow: React.FC<TopicAccordionRowProps> = ({
  topic,
  progress,
  groupProgress,
  exerciseCount,
  model,
  groupModel,
  kcsByTopic,
  exerciseCountsByChild,
  efficiencyByChild,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showGroupParent, setShowGroupParent] = useState(false);
  const [showGroupByChild, setShowGroupByChild] = useState<Record<number, boolean>>({});
  const action = useAction();

  const handleParentGroupVisibility = () => {
    if (!showGroupParent) {
      action({
        verbName: "showGroupProgress",
        topicID: topic.id,
        extra: {
          progressGroup: groupProgress,
          progressUser: progress,
        },
      });
    }

    setShowGroupParent(prev => !prev);
  };

  const handleChildGroupVisibility = (
    childId: number,
    showGroupChild: boolean,
    groupSubtopicPercent: number,
    userSubtopicPercent: number,
  ) => {
    if (!showGroupChild) {
      action({
        verbName: "showGroupProgress",
        topicID: String(childId),
        extra: {
          progressGroup: groupSubtopicPercent,
          progressUser: userSubtopicPercent,
        },
      });
    }

    setShowGroupByChild(prev => ({
      ...prev,
      [childId]: !showGroupChild,
    }));
  };

  const handleSubtopicDisplay = () => {
    if (!isOpen) {
      action({
        verbName: "displayOLMsubtopic",
        topicID: topic.id,
        extra: {
          userProgress: progress,
          groupProgress,
        },
      });
    }

    setIsOpen(prev => !prev);
  };

  return (
    <>
      <Table.Row bg={"bg.secondary"}>
        <Table.Cell fontWeight={"semibold"} color={"heading"} fontSize={{ base: "sm", md: "md" }}>
          {topic.label}
        </Table.Cell>

        <Table.Cell color={"heading"}>
          <OlmProgress.Bar
            percent={progress}
            groupPercent={groupProgress}
            showGroupPercent={showGroupParent}
          />
        </Table.Cell>

        <Table.Cell color={"heading"}>
          <OlmProgress.Value
            percent={progress}
            groupPercent={groupProgress}
            showGroupPercent={showGroupParent}
          />
        </Table.Cell>

        <Table.Cell
          onClick={handleParentGroupVisibility}
          cursor="pointer"
          color={"heading"}
        >
          <Box display="grid" placeItems="center">
            {showGroupParent ? <FaEye size={18} /> : <FaRegEyeSlash size={18} />}
          </Box>
        </Table.Cell>

        <Table.Cell textAlign={"end"} color={"heading"} minW={{ base: "150px", md: "unset" }}>
          {exerciseCount === 0 ? (
            <Text color="fg.warning" fontWeight={"semibold"} fontSize={{ base: "sm", md: "md" }}>
              No has realizado ejercicios
            </Text>
          ) : exerciseCount === 1 ? (
            <>
              <Text fontWeight={"normal"} display={{ base: "none", md: "block" }}>
                Has realizado 1 ejercicio
              </Text>
              <Text fontWeight={"normal"} display={{ base: "block", md: "none" }} fontSize="sm">
                1 ejercicio
              </Text>
            </>
          ) : (
            <>
              <Text fontWeight={"normal"} display={{ base: "none", md: "block" }}>
                Has realizado {exerciseCount} ejercicios
              </Text>
              <Text fontWeight={"normal"} display={{ base: "block", md: "none" }} fontSize="sm">
                {exerciseCount} ejercicios
              </Text>
            </>
          )}
        </Table.Cell>

        <Table.Cell textAlign={"center"} onClick={handleSubtopicDisplay} color={ICON_COLOR}>
          {isOpen ? <FaChevronDown cursor={"pointer"} /> : <FaChevronRight cursor={"pointer"} />}
        </Table.Cell>
      </Table.Row>

      <Table.Row bg={"bg.secondary"}>
        <Table.Cell colSpan={6} p={0} border="none">
          <Collapsible.Root open={isOpen}>
            <Collapsible.Content>
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
                  touchAction="pan-x"
                  overscrollBehaviorX="contain"
                  css={{ WebkitOverflowScrolling: "touch" }}
                >
                  <Box
                    display="inline-block"
                    minW={{ base: "760px", md: "100%" }}
                    verticalAlign="top"
                  >
                    <Table.Root
                      variant="outline"
                      borderRadius="md"
                      overflow="hidden"
                      size="sm"
                      interactive
                      minW={{ base: "760px", md: "100%" }}
                    >
                      <Table.Header>
                        <Table.Row bg="cyan.900">
                          <Table.ColumnHeader
                            fontSize="xs"
                            color="gray.50"
                            fontWeight="semibold"
                            htmlWidth="30%"
                            borderTopLeftRadius="md"
                            whiteSpace="nowrap"
                          >
                            SUBTÓPICOS
                          </Table.ColumnHeader>

                          <Table.ColumnHeader
                            fontSize="xs"
                            color="gray.50"
                            fontWeight="semibold"
                            htmlWidth="20%"
                            textAlign={"center"}
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
                            ESFUERZO
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
                                    p="3"
                                    bg="black"
                                    color="gray.200"
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
                          <Table.ColumnHeader
                            fontSize="xs"
                            color="gray.50"
                            htmlWidth="5%"
                            borderTopRightRadius="md"
                          ></Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>
                        {topic.childrens
                          .filter(child => kcsByTopic[child.id] && kcsByTopic[child.id].length > 0)
                          .map(child => {
                            const childIdNum = Number(child.id);
                            // const n = exerciseCountsByChild[childIdNum] ?? 0;
                            const userSubtopicPercent = getSubtopicPercent(
                              child.id,
                              kcsByTopic,
                              model,
                            );
                            const groupSubtopicPercent = getSubtopicGroupPercent(
                              child.id,
                              kcsByTopic,
                              groupModel,
                            );
                            const showGroupChild = showGroupByChild[childIdNum] ?? false;
                            const n: number = exerciseCountsByChild[childIdNum] ?? 0;
                            const pPercent: number = userSubtopicPercent; // 0..100
                            const E: number = estimateEffort(n, pPercent);
                            const rawEfficiency = efficiencyByChild?.[childIdNum] ?? 0; // 0..1
                            const efficiencyPercent = Math.round(rawEfficiency * 100); // 0..100
                            const Eround0: number = roundTo(E, 0);
                            const eLabel = pluralizeExercise(Eround0);
                            const info = infoText(n, eLabel);
                            const { char: moodEmoji, label: moodLabel } = getMoodEmoji(
                              n,
                              rawEfficiency,
                            );

                            return (
                              <Table.Row key={child.id}>
                                <Table.Cell whiteSpace="nowrap">{child.label}</Table.Cell>
                                <Table.Cell>
                                  <OlmProgress.Bar
                                    percent={userSubtopicPercent}
                                    groupPercent={groupSubtopicPercent}
                                    showGroupPercent={showGroupChild}
                                  />
                                </Table.Cell>

                                <Table.Cell whiteSpace="nowrap">
                                  <OlmProgress.Value
                                    percent={userSubtopicPercent}
                                    groupPercent={groupSubtopicPercent}
                                    showGroupPercent={showGroupChild}
                                  />
                                </Table.Cell>

                                <Table.Cell
                                  onClick={() =>
                                    handleChildGroupVisibility(
                                      childIdNum,
                                      showGroupChild,
                                      groupSubtopicPercent,
                                      userSubtopicPercent,
                                    )
                                  }
                                  cursor="pointer"
                                >
                                  <Box display="grid" placeItems="center">
                                    {showGroupChild ? (
                                      <FaEye size={18} />
                                    ) : (
                                      <FaRegEyeSlash size={18} />
                                    )}
                                  </Box>
                                </Table.Cell>

                                <TableCell
                                  textAlign="end"
                                  title={`n=${n}, E=${Eround0}`}
                                  whiteSpace="nowrap"
                                >
                                  <EffortDots n={n} estimated={Eround0} />
                                </TableCell>

                                <TableCell textAlign="center">
                                  <Popover.Root>
                                    <Popover.Trigger asChild>
                                      <IconButton
                                        aria-label="Información de ejercicios"
                                        size="xs"
                                        variant="ghost"
                                        color={ICON_COLOR}
                                        _icon={{ boxSize: 4 }}
                                        onClick={() => {
                                          action({
                                            verbName: "showEffortInfo",
                                            topicID: String(child.id),
                                          });
                                        }}
                                      >
                                        <FaInfoCircle />
                                      </IconButton>
                                    </Popover.Trigger>
                                    <Popover.Positioner>
                                      <Popover.Content
                                        maxW="xs"
                                        p="3"
                                        bg="black"
                                        color="gray.200"
                                        css={{ "--popover-bg": "black" }}
                                      >
                                        <Popover.Arrow />
                                        <Popover.CloseTrigger />
                                        <Text fontSize="sm">{info}</Text>
                                      </Popover.Content>
                                    </Popover.Positioner>
                                  </Popover.Root>
                                </TableCell>

                                <TableCell textAlign="center" title="Eficiencia = B / A">
                                  {Number.isFinite(efficiencyPercent) && efficiencyPercent > 0
                                    ? `${efficiencyPercent}%`
                                    : "—"}
                                </TableCell>
                                <TableCell textAlign="start">
                                  {moodEmoji ? (
                                    <Popover.Root>
                                      <Popover.Trigger asChild>
                                        <Box
                                          as="span"
                                          cursor="pointer"
                                          display="inline-flex"
                                          alignItems="center"
                                          onClick={() => {
                                            action({
                                              verbName: "showEfficiencyInfo",
                                              topicID: String(child.id),
                                              extra: {
                                                efficiency: efficiencyPercent,
                                              },
                                            });
                                          }}
                                        >
                                          <span
                                            role="img"
                                            aria-label={moodLabel}
                                            style={{ fontSize: 25 }}
                                          >
                                            {moodEmoji}
                                          </span>
                                        </Box>
                                      </Popover.Trigger>
                                      <Popover.Positioner>
                                        <Popover.Content
                                          maxW="xs"
                                          p="3"
                                          bg="black"
                                          color="gray.200"
                                          css={{ "--popover-bg": "black" }}
                                        >
                                          <Popover.Arrow />
                                          <Popover.CloseTrigger />
                                          <Text fontSize="sm">{moodLabel}</Text>
                                        </Popover.Content>
                                      </Popover.Positioner>
                                    </Popover.Root>
                                  ) : (
                                    <span style={{ fontSize: 25 }}> </span>
                                  )}
                                </TableCell>
                              </Table.Row>
                            );
                          })}
                      </Table.Body>
                    </Table.Root>
                  </Box>
                </Box>
              </Box>
            </Collapsible.Content>
          </Collapsible.Root>
        </Table.Cell>
      </Table.Row>
    </>
  );
};

export default TopicAccordionRow;
