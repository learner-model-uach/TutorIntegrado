import { Button } from "@chakra-ui/react";
//import { AiOutlineStar } from "react-icons/ai";
import StarRatingComponent from "react-star-rating-component";

interface ChildProps {
  setQuestion: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ejercicios = ({ setQuestion }: ChildProps) => {
  return (
    <>
      questions page: ¿Te pareció correcta la elección del ejercicio anterior?
      <div style={{ fontSize: 24 }}>
        <StarRatingComponent
          name={"String"} /* name of the radio input, it is required */
          value={1} /* number of selected icon (`0` - none, `1` - first) */
          starCount={3} /* number of icons in rating, default `5` */
          //onStarClick={Function(nextValue, prevValue, name)} /* on icon click handler */
          //onStarHover={Function(nextValue, prevValue, name)} /* on icon hover handler */
          //onStarHoverOut={Function(nextValue, prevValue, name)} /* on icon hover out handler */
          //renderStarIcon={Function(nextValue, prevValue, name)} /* it should return string or react component */
          //renderStarIconHalf={Function(nextValue, prevValue, name)} /* it should return string or react component */
          //starColor={String} /* color of selected icons, default `#ffb400` */
          //emptyStarColor={String} /* color of non-selected icons, default `#333` */
          //editing={Boolean} /* is component available for editing, default `true` */
        />
      </div>
      <Button
        onClick={() => {
          setQuestion(false);
        }}
      >
        salir
      </Button>
    </>
  );
};

export default ejercicios;
