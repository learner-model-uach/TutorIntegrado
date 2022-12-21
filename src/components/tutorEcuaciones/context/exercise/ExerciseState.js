import ExerciseContext from "./exerciseContext";
import ExerciseReducer from "./exerciseReducer";

import { SET_CONTENT } from "../../types";
import React, { useReducer } from "react";

const ExerciseState = (props) => {
  const initialState = {
    content: "",
  };

  const [state, dispatch] = useReducer(ExerciseReducer, initialState);

  //Set Alert
  const settingContent = (contentId) => {
    dispatch({ type: SET_CONTENT, payload: contentId });
  };

  return (
    <ExerciseContext.Provider
      value={{
        content: state.content,
        settingContent,
      }}
    >
      {props.children}
    </ExerciseContext.Provider>
  );
};

export default ExerciseState;
