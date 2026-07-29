import React, { useState } from "react";
import type { TopicAccordionRowProps } from "./types";
import TopicParentRow from "./TopicParentRow";
import SubtopicDetailsTable from "./SubtopicDetailsTable";
import { useAction } from "../../utils/action";

const TopicAccordionRow: React.FC<TopicAccordionRowProps> = ({
  topic,
  progress,
  groupProgress,
  exerciseCount,
  defaultOpen = false,
  showGroupProgress = true,
  showEfficiency = true,
  showEffort = true,
  model,
  groupModel,
  kcsByTopic,
  exerciseCountsByChild,
  efficiencyByChild,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [hasOpened, setHasOpened] = useState(defaultOpen);
  const [showGroupParent, setShowGroupParent] = useState(false);
  const [showGroupByChild, setShowGroupByChild] = useState<Record<number, boolean>>({});
  const action = useAction();

  const handleParentGroupVisibility = () => {
    if (!showGroupProgress) return;

    if (!showGroupParent) {
      action({
        verbName: "dshbShowGroupProgress",
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
    if (!showGroupProgress) return;

    if (!showGroupChild) {
      action({
        verbName: "dshbShowGroupProgress",
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
        verbName: "dshbDisplaySubtopic",
        topicID: topic.id,
        extra: {
          userProgress: progress,
          groupProgress,
        },
      });
    }

    setIsOpen(prev => {
      const nextIsOpen = !prev;
      if (nextIsOpen) setHasOpened(true);
      return nextIsOpen;
    });
  };

  return (
    <>
      <TopicParentRow
        topic={topic}
        progress={progress}
        groupProgress={groupProgress}
        exerciseCount={exerciseCount}
        isOpen={isOpen}
        showGroupProgress={showGroupProgress}
        showGroupParent={showGroupProgress && showGroupParent}
        onToggleGroup={handleParentGroupVisibility}
        onToggleSubtopics={handleSubtopicDisplay}
      />

      <SubtopicDetailsTable
        topic={topic}
        isOpen={isOpen}
        shouldRenderContent={hasOpened}
        showGroupProgress={showGroupProgress}
        showEfficiency={showEfficiency}
        showEffort={showEffort}
        model={model}
        groupModel={groupModel}
        kcsByTopic={kcsByTopic}
        exerciseCountsByChild={exerciseCountsByChild}
        efficiencyByChild={efficiencyByChild}
        showGroupByChild={showGroupByChild}
        onToggleChildGroup={handleChildGroupVisibility}
      />
    </>
  );
};

export default TopicAccordionRow;
