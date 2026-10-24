// FILE: c:\Users\Sree\Desktop\pat\frontend\src\components\TransactionItem.jsx
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/constants';

/**
 * TransactionItem
 * @param {{ transaction: object, onEdit: function, onDelete: function }} props
 */
export default function TransactionItem({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'income';

  return (
    <div className="flex items-center justify-between gap-3 py-3 px-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-150">
      {/* Left section */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Colored dot */}
        <span
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
            isIncome ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        {/* Text info */}
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">{transaction.title}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {transaction.category && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  isIncome
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {transaction.category}
              </span>
            )}
            <span className="text-xs text-slate-400">
              {formatDate(transaction.date)}
            </span>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={`text-sm font-bold ${
            isIncome ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </span>

        {/* Edit button */}
        <button
          onClick={() => onEdit(transaction)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150"
          aria-label="Edit transaction"
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* Delete button */}
        <button
          onClick={() => onDelete(transaction)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
          aria-label="Delete transaction"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
