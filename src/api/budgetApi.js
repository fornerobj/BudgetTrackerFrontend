import { api } from "./client";
import { endpoints } from "./endpoints";

export function fetchSummaries(filters, token) {
  return api.get(endpoints.summary(filters), { token });
}