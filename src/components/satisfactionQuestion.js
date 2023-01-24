import React, { useState } from "react";
//import { useDispatch } from "react-redux";
//import { saveUserSatisfaction } from './actions'

/*algo asi debiese ir en actions
export const saveUserSatisfaction = (satisfaction) => {
  return (dispatch) => {
    // Enviar la respuesta a un endpoint o procesarla
    // ...
    // Dispatch una acción para guardar la respuesta en el estado global
    dispatch*/


function SatisfactionQuestion() {
  const [selectedOption, setSelectedOption] = useState("");
  //const dispatch = useDispatch();

  /*const handleSubmit = () => {
    dispatch(saveUserSatisfaction(selectedOption))
  }*/

  return (
    <div>
      <p>¿Te sientes conforme con tú elección del ejercicio?</p>
      <div>
        <input
          type="radio"
          id="satisfied"
          name="satisfaction"
          value="satisfied"
          checked={selectedOption === "satisfied"}
          onChange={(e) => setSelectedOption(e.target.value)}
        />
        <label for="satisfied">Conforme</label>
      </div>
      <div>
        <input
          type="radio"
          id="medium-satisfied"
          name="satisfaction"
          value="medium-satisfied"
          checked={selectedOption === "medium-satisfied"}
          onChange={(e) => setSelectedOption(e.target.value)}
        />
        <label for="medium-satisfied">Medianamente conforme</label>
      </div>
      <div>
        <input
          type="radio"
          id="unsatisfied"
          name="satisfaction"
          value="unsatisfied"
          checked={selectedOption === "unsatisfied"}
          onChange={(e) => setSelectedOption(e.target.value)}
        />
        <label for="unsatisfied">Disconforme</label>
      </div>
      
    </div>
  );
}
//<button onClick={handleSubmit}>Enviar respuesta</button>

export default SatisfactionQuestion;