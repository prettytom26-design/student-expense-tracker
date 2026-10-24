import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, Plus, Loader2, Receipt } from 'lucide-react';
import TransactionItem from '../components/TransactionItem';
import TransactionForm from '../components/TransactionForm';
import EditTransactionModal from '../components/EditTransactionModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { getTransactions, deleteTransaction } from '../api/transactions';
import { ALL_CATEGORIES } from '../utils/constants';

const defaultFilters = { search: '', type: 'all', category: 'all', startDate: '', endDate: '' };

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [deleteTx, setDeleteTx] = useState(null);

  const fetchTx = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.type !== 'all') params.type = filters.type;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const res = await getTransactions(params);
      setTransactions(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchTx(); }, [fetchTx]);

  const handleFilter = (e) => setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
  const clearFilters = () => setFilters(defaultFilters);

  const handleDelete = async () => {
    if (!deleteTx) return;
    try { await deleteTransaction(deleteTx._id); setDeleteTx(null); fetchTx(); }
    catch (e) { console.error(e); }
  };

  const hasFilters = Object.entries(filters).some(([k, v]) => v !== defaultFilters[k]);

  return (
    <div className="p-5 md:p-8 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3c5e]">Transactions</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage all your income and expenses</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2 btn-primary px-4 py-2.5 text-sm">
          <Plus className="w-4 h-4" /> Add Transaction
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card border border-green-200">
          <h2 className="font-semibold text-slate-700 mb-4">New Transaction</h2>
          <TransactionForm onSuccess={() => { fetchTx(); setShowForm(false); }} />
        </div>
      )}

      {/* Filters */}
      <div className="card space-y-3">
        <div className="flex items-center gap-2 text-slate-600 text-sm font-semibold">
          <Filter className="w-4 h-4" /> Filters
          {hasFilters && (
            <button onClick={clearFilters} className="ml-auto text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
              <X className="w-3 h-3" /> Clear all
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="search" value={filters.search} onChange={handleFilter}
              placeholder="Search by title or description..."
              className="input-field pl-9"
            />
          </div>
          {/* Type */}
          <select name="type" value={filters.type} onChange={handleFilter} className="input-field bg-white">
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {/* Category */}
          <select name="category" value={filters.category} onChange={handleFilter} className="input-field bg-white">
            <option value="all">All Categories</option>
            {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {/* Dates */}
          <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
            <input name="startDate" type="date" value={filters.startDate} onChange={handleFilter} className="input-field text-xs" title="Start date" />
            <input name="endDate" type="date" value={filters.endDate} onChange={handleFilter} className="input-field text-xs" title="End date" />
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-700">
            {loading ? 'Loading...' : `Showing ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`}
          </h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-green-500" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-14 text-slate-400">
            <Receipt className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No transactions found. {hasFilters ? 'Try clearing your filters.' : 'Add your first transaction!'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <TransactionItem key={tx._id} transaction={tx} onEdit={setEditTx} onDelete={setDeleteTx} />
            ))}
          </div>
        )}
      </div>

      {editTx && <EditTransactionModal transaction={editTx} onClose={() => setEditTx(null)} onSuccess={fetchTx} />}
      {deleteTx && <DeleteConfirmModal transactionTitle={deleteTx.title} onConfirm={handleDelete} onCancel={() => setDeleteTx(null)} />}
    </div>
  );
}
