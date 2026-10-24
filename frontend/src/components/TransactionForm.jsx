import { useState } from 'react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, todayISO } from '../utils/constants';
import { createTransaction } from '../api/transactions';
import { PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';

const emptyForm = {
  title: '', amount: '', type: 'expense', category: '', date: todayISO(), description: '',
};

export default function TransactionForm({ onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category: '' } : {}),
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Title is required.');
    if (!form.amount || Number(form.amount) <= 0) return setError('Amount must be greater than zero.');
    if (!form.category) return setError('Please select a category.');
    if (!form.date) return setError('Date is required.');

    setLoading(true);
    try {
      await createTransaction({ ...form, amount: Number(form.amount) });
      setSuccess(true);
      setForm(emptyForm);
      onSuccess && onSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-300 rounded-xl text-green-700 text-sm font-medium">
          <CheckCircle className="w-4 h-4" /> Transaction added successfully!
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="e.g. College Canteen Lunch" maxLength={100} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Amount (₹) *</label>
          <input name="amount" type="number" value={form.amount} onChange={handleChange} className="input-field" placeholder="0.00" min="0.01" step="0.01" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Type *</label>
          <select name="type" value={form.type} onChange={handleChange} className="input-field bg-white">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field bg-white">
            <option value="">Select category...</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date *</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description (optional)</label>
          <input name="description" value={form.description} onChange={handleChange} className="input-field" placeholder="Add a note..." maxLength={300} />
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-60 disabled:cursor-not-allowed">
        {loading
          ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding...</>
          : <><PlusCircle className="w-4 h-4" /> Add Transaction</>}
      </button>
    </form>
  );
}
