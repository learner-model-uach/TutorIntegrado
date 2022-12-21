import { SET_CONTENT } from "../../types";

export default (state, action) => {
  switch (action.type) {
    case SET_CONTENT:
      return {
        ...state,
        content: action.payload,
      };
    default:
      return state;
  }
};
