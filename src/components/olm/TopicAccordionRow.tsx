import React, { useState } from "react";
import type { TopicAccordionRowProps } from "./types";
import TopicParentRow from "./TopicParentRow";
import SubtopicDetailsTable from "./SubtopicDetailsTable";

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

  const handleParentGroupVisibility = () => {
    // Tracking intentionally kept disabled until OLM action schema is finalized.
    // if (!showGroupParent) {
    //   action({
    //     verbName: "showGroupProgress",
    //     topicID: topic.id,
    //     extra: {
    //       progressGroup: groupProgress,
    //       progressUser: progress,
    //     },
    //   });
    // }

    setShowGroupParent(prev => !prev);
  };

  const handleChildGroupVisibility = (
    childId: number,
    showGroupChild: boolean,
    _groupSubtopicPercent: number,
    _userSubtopicPercent: number,
  ) => {
    // Tracking intentionally kept disabled until OLM action schema is finalized.
    // if (!showGroupChild) {
    //   action({
    //     verbName: "showGroupProgress",
    //     topicID: String(childId),
    //     extra: {
    //       progressGroup: groupSubtopicPercent,
    //       progressUser: userSubtopicPercent,
    //     },
    //   });
    // }

    setShowGroupByChild(prev => ({
      ...prev,
      [childId]: !showGroupChild,
    }));
  };

  const handleSubtopicDisplay = () => {
    // Tracking intentionally kept disabled until OLM action schema is finalized.
    // if (!isOpen) {
    //   action({
    //     verbName: "displayOLMsubtopic",
    //     topicID: topic.id,
    //     extra: {
    //       userProgress: progress,
    //       groupProgress,
    //     },
    //   });
    // }

    setIsOpen(prev => !prev);
  };

  return (
    <>
      <TopicParentRow
        topic={topic}
        progress={progress}
        groupProgress={groupProgress}
        exerciseCount={exerciseCount}
        isOpen={isOpen}
        showGroupParent={showGroupParent}
        onToggleGroup={handleParentGroupVisibility}
        onToggleSubtopics={handleSubtopicDisplay}
      />

      <SubtopicDetailsTable
        topic={topic}
        isOpen={isOpen}
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
