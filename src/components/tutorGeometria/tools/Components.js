// @ts-nocheck
import React from "react";
import APstep1 from "../areaPerimetro/steps/APstep1";
import APstep2 from "../areaPerimetro/steps/APstep2";
import APstep3 from "../areaPerimetro/steps/APstep3";
import APstep4 from "../areaPerimetro/steps/APstep4";
import APstepF from "../areaPerimetro/steps/APstepF";
 
const Components = {
    APstep1 : APstep1,
    APstep2 : APstep2,
    APstep3 : APstep3,
    APstep4 : APstep4,
    APstepF : APstepF
};
 
export default step => {
    console.log('Components', Components)
    console.log('step components', step.component)
  // component does exist
  if (Components[step.component]) {
    return React.createElement(step.component, {
      key: step._uid,
      step: step
    });
  }
  // component doesn't exist yet
  return React.createElement(
    () => <div>The component {step.component} has not been created yet.</div>,
    { key: step._uid }
  );
}