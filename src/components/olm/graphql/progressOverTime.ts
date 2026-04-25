import { gql } from "../../../graphql";

export const PROGRESS_OVER_TIME_USER_AND_GROUP = gql(`
  query ProgressOverTimeUserAndGroup(
    $userInput: ProgressOverTimeUserInput!
    $groupInput: ProgressOverTimeGroupInput!
  ) {
    progressOverTime {
      userBkt(input: $userInput) {
        points {
          at
          avgLevel
          nKcsUsed
          snapshotUpdatedAt
        }
      }
      groupBkt(input: $groupInput) {
        points {
          at
          avgLevel
          nKcsUsed
          nUsers
          snapshotUpdatedAt
        }
      }
    }
  }
`);
