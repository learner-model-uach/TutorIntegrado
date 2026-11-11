import { queryClient } from "../rqClient";

const OLM_DYNAMIC_QUERY_KEYS = [
  "uModel",
  "gModel",
  "GetUserActions",
  "ProgressOverTimeUserAndGroup",
  "ProgressOverTimeBkt",
];

export function invalidateOlmProgressQueries() {
  OLM_DYNAMIC_QUERY_KEYS.forEach(queryKey => {
    queryClient.invalidateQueries(queryKey);
  });
}
