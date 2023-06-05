import { useGQLMutation } from "rq-gql";
import { gql } from "../graphql";

const MUTATION = gql(/* GraphQL */ `
  mutation updateModelState($input: UpdateModelStateInput!) {
    updateModelState(input: $input)
  }
`);

export const useUpdateModel = () => {
  return useGQLMutation(MUTATION);
};
