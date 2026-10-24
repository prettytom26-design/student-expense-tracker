import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#22c55e','#3b82f6','#f59e0b','#8b5cf6','#ec4899','#14b8a6','#f97316','#ef4444','#06b6d4','#6b7280','#84cc16','#a78bfa'];

const rupee = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(v);

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, percent } = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-3 text-xs">
      <p className="font-semibold text-slate-700">{name}</p>
      <p className="text-slate-600">{rupee(value)}</p>
      <p className="text-slate-400">{(percent * 100).toFixed(1)}%</p>
    </div>
  );
};

export default function CategoryPieChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-slate-400 text-sm">
        No expense data available
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="45%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
