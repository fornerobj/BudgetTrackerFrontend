import { api, apiRequest } from './client.js';
import { endpoints } from './endpoints.js';

/**
 * @typedef {Object} TransactionDto
 * @property {string} date        // ISO date
 * @property {string} description
 * @property {string} category
 * @property {string} type
 * @property {number} amount
 * @property {boolean} excluded
 */

/**
 * Upload a CSV file and get back transactions.
 * @param {File} file
 * @returns {Promise<TransactionDto[]>}
 */
export async function uploadTransactionsCsv(token, file) {
  if (!file) throw new Error('No file selected');
  const form = new FormData();
  form.append('file', file); // Backend expects name "file"
  return apiRequest(endpoints.upload(), {
    method: 'POST',
    body: form,
    token,
    // headers intentionally blank so fetch sets multipart boundary
  });
}

/**
 * Fetch transactions with optional filters.
 * @param {Object} filters - { categories, type, excluded, dateFrom, dateTo, amountMin, amountMax }
 * @returns {Promise<Array>}
 */
export function fetchTransactions(token, filters) {
  return api.get(endpoints.transactions(filters), { token });
}

/**
 * Update a transaction by ID.
 * @param {number} id
 * @param {Object} updateDto
 * @returns {Promise<Object>}
 */
export function updateTransaction(token, id, updateDto) {
  return api.patch(endpoints.transactionById(id), updateDto, { token });
}

/**
 * Delete a transaction by ID.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export function deleteTransaction(token, id) {
  return api.delete(endpoints.transactionById(id), { token });
}
