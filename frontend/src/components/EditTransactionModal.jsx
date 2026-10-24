// FILE: c:\Users\Sree\Desktop\pat\frontend\src\components\EditTransactionModal.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/constants';
import { updateTransaction } from '../api/transactions';

/**
 * EditTransactionModal
 * @param {{ transaction: object, onClose: function, onSuccess: function }} props
 */
export default function EditTransactionModal({ transaction, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setForm({
        title: transaction.title || '',
        amount: transaction.amount?.toString() || '',
        type: transaction.type || 'expense',
        category: transaction.category || '',
        date: transaction.date ? transaction.date.slice(0, 10) : '',
        description: transaction.description || '',
      });
    }
  }, [transaction]);

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === 'type') {
        const cats = value === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
        return { ...prev, type: value, category: cats[0] };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) return setError('Title is required.');
    if (!form.amount || Number(form.amount) <= 0)
      return setError('Amount must be greater than 0.');
    if (!form.date) return setError('Date is required.');

    setLoading(true);
    try {
      await updateTransaction(transaction._id, {
        title: form.title.trim(),
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
        date: form.date,
        description: form.description.trim(),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update transaction.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Edit Transaction</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="px-6 py-5" noValidate>
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                className={inputCls}
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                className={inputCls}
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                className={inputCls}
                name="type"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Category
              </label>
              <select
                className={inputCls}
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                className={inputCls}
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Description <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                className={`${inputCls} resize-none`}
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
