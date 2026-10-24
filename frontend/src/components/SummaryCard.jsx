export default function SummaryCard({ title, value, icon, color = 'green', subtitle }) {
  const colorMap = {
    green: { bg: 'bg-green-100', text: 'text-green-600', val: 'text-green-700' },
    red:   { bg: 'bg-red-100',   text: 'text-red-600',   val: 'text-red-700' },
    blue:  { bg: 'bg-blue-100',  text: 'text-blue-600',  val: 'text-blue-700' },
    purple:{ bg: 'bg-purple-100',text: 'text-purple-600',val: 'text-purple-700' },
  };
  const c = colorMap[color] || colorMap.green;

  return (
    <div className="card flex items-center justify-between gap-3 border border-slate-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate">{title}</p>
        <p className={`text-xl font-bold mt-1 ${c.val} truncate`}>{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl ${c.bg} ${c.text} flex-shrink-0`}>
        {icon}
      </div>
    </div>
  );
}
