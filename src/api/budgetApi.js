import { api } from "./client";
import { endpoints } from "./endpoints";

export function fetchSummaries(filters) {
  return api.get(endpoints.summary(filters));
}