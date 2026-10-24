import { useState, useEffect, useCallback } from 'react';
import { Loader2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import { getSummary, getCategoryData, getMonthlyData } from '../api/transactions';
import { formatCurrency } from '../utils/constants';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function Reports() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, cd, md] = await Promise.all([
        getSummary({ month, year }),
        getCategoryData({ month, year }),
        getMonthlyData(),
      ]);
      setSummary(s.data);
      setCategoryData(cd.data);
      setMonthlyData(md.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [month, year]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalExpense = summary.expense || 0;

  return (
    <div className="p-5 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a3c5e]">Monthly Reports</h1>
        <p className="text-sm text-slate-500 mt-0.5">Analyze your financial activity month by month</p>
      </div>

      {/* Month/Year Selector */}
      <div className="card flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-600">Month:</label>
          <select
            value={month} onChange={(e) => setMonth(Number(e.target.value))}
            className="input-field w-36 bg-white"
          >
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-600">Year:</label>
          <select
            value={year} onChange={(e) => setYear(Number(e.target.value))}
            className="input-field w-28 bg-white"
          >
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
          {MONTHS[month - 1]} {year}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard title="Income" value={formatCurrency(summary.income)} icon={<TrendingUp className="w-5 h-5" />} color="green" subtitle={MONTHS[month-1]} />
            <SummaryCard title="Expenses" value={formatCurrency(summary.expense)} icon={<TrendingDown className="w-5 h-5" />} color="red" subtitle={MONTHS[month-1]} />
            <SummaryCard title="Balance" value={formatCurrency(summary.balance)} icon={<Wallet className="w-5 h-5" />} color={summary.balance >= 0 ? 'blue' : 'red'} subtitle={summary.balance >= 0 ? 'Surplus' : 'Deficit'} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="font-semibold text-slate-700 mb-4">Expense Breakdown</h2>
              <CategoryPieChart data={categoryData} />
            </div>
            <div className="card">
              <h2 className="font-semibold text-slate-700 mb-4">6-Month Trend</h2>
              <MonthlyBarChart data={monthlyData} />
            </div>
          </div>

          {/* Category Table */}
          <div className="card">
            <h2 className="font-semibold text-slate-700 mb-4">Category Breakdown — {MONTHS[month-1]} {year}</h2>
            {categoryData.length === 0 ? (
              <p className="text-center text-slate-400 py-8 text-sm">No expense data for this month.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-green-50 text-slate-600">
                      <th className="text-left px-4 py-2.5 rounded-l-lg font-semibold">Category</th>
                      <th className="text-right px-4 py-2.5 font-semibold">Amount</th>
                      <th className="text-right px-4 py-2.5 rounded-r-lg font-semibold">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryData.map((row, i) => (
                      <tr key={row.name} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-4 py-3 text-slate-700 font-medium">{row.name}</td>
                        <td className="px-4 py-3 text-right text-red-600 font-semibold">{formatCurrency(row.value)}</td>
                        <td className="px-4 py-3 text-right text-slate-500">
                          {totalExpense > 0 ? ((row.value / totalExpense) * 100).toFixed(1) : 0}%
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-green-50 font-bold">
                      <td className="px-4 py-3 text-slate-700 rounded-l-lg">Total</td>
                      <td className="px-4 py-3 text-right text-red-700">{formatCurrency(totalExpense)}</td>
                      <td className="px-4 py-3 text-right text-slate-600 rounded-r-lg">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
