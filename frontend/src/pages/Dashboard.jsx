// FILE: c:\Users\Sree\Desktop\pat\frontend\src\pages\Dashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  Loader2,
  Plus,
  ChevronUp,
} from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import TransactionForm from '../components/TransactionForm';
import TransactionItem from '../components/TransactionItem';
import EditTransactionModal from '../components/EditTransactionModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import IncomeVsExpenseChart from '../components/charts/IncomeVsExpenseChart';
import {
  getTransactions,
  getSummary,
  getMonthlyData,
  getCategoryData,
  deleteTransaction,
} from '../api/transactions';
import { formatCurrency, formatDate } from '../utils/constants';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    count: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [summaryRes, transRes, monthlyRes, catRes] = await Promise.all([
        getSummary(),
        getTransactions({ limit: 5, sort: '-date' }),
        getMonthlyData(),
        getCategoryData(),
      ]);
      setSummary(summaryRes.data ?? summaryRes);
      setRecentTransactions(
        Array.isArray(transRes.data) ? transRes.data : transRes.data?.transactions ?? []
      );
      setMonthlyData(Array.isArray(monthlyRes.data) ? monthlyRes.data : []);
      setCategoryData(Array.isArray(catRes.data) ? catRes.data : []);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchAll();
  };

  const handleEdit = (tx) => setEditTarget(tx);
  const handleDelete = (tx) => setDeleteTarget(tx);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTransaction(deleteTarget._id);
      setDeleteTarget(null);
      fetchAll();
    } catch (err) {
      console.error('Delete failed:', err);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3c5e]">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">{today}</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          {showForm ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Hide Form' : 'Add Transaction'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Income"
          value={formatCurrency(summary.totalIncome)}
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
          subtitle="All time earnings"
        />
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpense)}
          icon={<TrendingDown className="w-5 h-5" />}
          color="red"
          subtitle="All time spending"
        />
        <SummaryCard
          title="Balance"
          value={formatCurrency(summary.balance)}
          icon={<Wallet className="w-5 h-5" />}
          color={summary.balance >= 0 ? 'blue' : 'red'}
          subtitle="Income - Expenses"
        />
        <SummaryCard
          title="Total Transactions"
          value={summary.count}
          icon={<Receipt className="w-5 h-5" />}
          color="purple"
          subtitle="All recorded entries"
        />
      </div>

      {/* Quick Add Form */}
      {showForm && (
        <TransactionForm onSuccess={handleFormSuccess} />
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Monthly Income vs Expense
          </h2>
          <MonthlyBarChart data={monthlyData} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            Expense by Category
          </h2>
          <CategoryPieChart data={categoryData} />
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">
          6-Month Income vs Expense Trend
        </h2>
        <IncomeVsExpenseChart data={monthlyData} />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-700">Recent Transactions</h2>
          <a
            href="/transactions"
            className="text-xs text-green-600 hover:text-green-700 font-medium"
          >
            View all →
          </a>
        </div>

        {recentTransactions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">
            No transactions yet. Add one above!
          </p>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map((tx) => (
              <TransactionItem
                key={tx._id}
                transaction={tx}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editTarget && (
        <EditTransactionModal
          transaction={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={fetchAll}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          transactionTitle={deleteTarget.title}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
