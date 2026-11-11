import { gql } from "../../../graphql";
export const useUserActions = gql(/* GraphQL */ `
  query GetUserActions($endDate: DateTime!, $verbNames: [String!]!) {
    actionsTopic {
      allActionsByUser(
        input: {
          projectId: 4
          startDate: "2021-01-01T00:00:00Z"
          endDate: $endDate
          verbNames: $verbNames
        }
        pagination: { first: 50 }
      ) {
        nodes {
          createdAt
          actions {
            timestamp
            verb {
              id
              name
            }
            result
            extra
            content {
              id
              code
              topics {
                id
                label
                code
                parent {
                  id
                  code
                  label
                }
              }
            }
          }
        }
      }
    }
  }
`);
