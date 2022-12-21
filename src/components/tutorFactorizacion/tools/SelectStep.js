import React, { useState, useEffect } from "react";
import { Select } from "@chakra-ui/react";
import { useAction } from "../../../utils/action";
import { useDisclosure } from "@chakra-ui/react";

export const SelectStep = ({ steps, correct, setSelect, contentID, topic }) => {
  //elimina duplicados en caso especial FCC
  const newSteps = [...new Set(steps)];
  //se duplica la variable para no modificar la anterior y se desordena
  const [newSteps2, setNewSteps2] = useState(newSteps);
  useEffect(() => {
    setNewSteps2(
      newSteps2.sort(function () {
        return Math.random() - 0.5;
      })
    );
  }, []);
  const resp = (e) => {
    e == correct && setSelect(false);
  };

  const action = useAction();
  const { isOpen, onToggle } = useDisclosure(); //para capturar open o close del select

  return (
    <div>
      <Select
        variant="filled"
        placeholder="Seleccionar paso"
        size="sm"
        onClick={() => {
          onToggle();
          action({
            verbName: "displayStepOrderList",
            contentID: contentID,
            topicID: topic,
            extra: {
              source: isOpen ? "Close" : "Open",
            },
            //kcsIDs:[] ver mas adelante
          });
        }}
        onChange={(e) => {
          resp(e.target.value);
          action({
            verbName: "chooseNextStep",
            contentID: contentID, //leer del json
            topicID: topic,
            stepID: "" + correct,
            result: e.target.value == correct ? 1 : 0,
            extra: {
              choosenStepID: "" + e.target.value,
            },
          });
        }}
      >
        {newSteps2.map((step) => (
          <option key={step} value={newSteps.indexOf(step)}>
            {"" + step}
          </option>
        ))}
      </Select>
    </div>
  );
};
