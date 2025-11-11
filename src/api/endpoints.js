import { toQueryString } from "./client";

export const endpoints = {
  upload: () => '/upload',
  summary: (query) =>
    query
      ? `/summary?${toQueryString(query)}`
      : '/summary',
  transactions: (query) =>
    query
      ? `/transactions?${toQueryString(query)}`
      : '/transactions',
  transactionById: (id) => `/transactions/${id}`,
  categories: () => '/categories',
  categoryById: (id) => `/categories/${id}`,
};

// Example usage:
// import { api } from './api/client';
// import { endpoints } from './api/endpoints';

// export async function fetchBudgets(token) {
//   return api.get(endpoints.budgets(), { token });
// }