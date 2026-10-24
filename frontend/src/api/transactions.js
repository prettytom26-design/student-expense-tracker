// API helper — all calls to the backend go through here
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/transactions';

// Fetch transactions with optional filter params
export const getTransactions = (params = {}) =>
  axios.get(API_BASE, { params }).then((r) => r.data);

// Fetch summary totals (optionally filtered by month/year)
export const getSummary = (params = {}) =>
  axios.get(`${API_BASE}/summary`, { params }).then((r) => r.data);

// Fetch last-6-months bar chart data
export const getMonthlyData = () =>
  axios.get(`${API_BASE}/monthly-data`).then((r) => r.data);

// Fetch category expense breakdown for pie chart
export const getCategoryData = (params = {}) =>
  axios.get(`${API_BASE}/category-data`, { params }).then((r) => r.data);

// Create a new transaction
export const createTransaction = (data) =>
  axios.post(API_BASE, data).then((r) => r.data);

// Update an existing transaction
export const updateTransaction = (id, data) =>
  axios.put(`${API_BASE}/${id}`, data).then((r) => r.data);

// Delete a transaction
export const deleteTransaction = (id) =>
  axios.delete(`${API_BASE}/${id}`).then((r) => r.data);
