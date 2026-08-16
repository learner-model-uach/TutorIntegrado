import { useGraphQLMutation as useGQLMutation } from "../graphql-hooks";
import { gql } from "../graphql";

const MUTATION = gql(/* GraphQL */ `
  mutation updateModelState($input: UpdateModelStateInput!) {
    updateModelState(input: $input)
  }
`);

export const useUpdateModel = () => {
  return useGQLMutation(MUTATION);
};
