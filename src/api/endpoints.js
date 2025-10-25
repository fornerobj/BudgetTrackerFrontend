export const endpoints = {
    upload: () => '/upload',
    getUncategorized: () => '/transactions/uncategorized',
//   budgets: () => '/budgets',
//   budget: (id) => `/budgets/${id}`,
//   userProfile: () => '/users/me',
//   transactions: (budgetId) => `/budgets/${budgetId}/transactions`,
};

// Example usage:
// import { api } from './api/client';
// import { endpoints } from './api/endpoints';

// export async function fetchBudgets(token) {
//   return api.get(endpoints.budgets(), { token });
// }