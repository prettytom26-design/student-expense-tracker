export const INCOME_CATEGORIES = [
  'Pocket Money',
  'Scholarship',
  'Part-time Job',
  'Other Income',
];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Education',
  'Stationery',
  'Shopping',
  'Entertainment',
  'Accommodation',
  'Bills',
  'Healthcare',
  'Other Expenses',
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

// Color map for pie chart slices
export const CATEGORY_COLORS = {
  Food: '#22c55e',
  Transportation: '#3b82f6',
  Education: '#f59e0b',
  Stationery: '#8b5cf6',
  Shopping: '#ec4899',
  Entertainment: '#14b8a6',
  Accommodation: '#f97316',
  Bills: '#ef4444',
  Healthcare: '#06b6d4',
  'Other Expenses': '#6b7280',
  'Pocket Money': '#84cc16',
  Scholarship: '#a78bfa',
  'Part-time Job': '#fb923c',
  'Other Income': '#34d399',
};

export const PIE_COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#ef4444',
  '#06b6d4', '#6b7280', '#84cc16', '#a78bfa',
];

// Format a number as Indian Rupees
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);

// Format a date string for display
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Return today's date in YYYY-MM-DD for <input type="date">
export const todayISO = () => new Date().toISOString().split('T')[0];
