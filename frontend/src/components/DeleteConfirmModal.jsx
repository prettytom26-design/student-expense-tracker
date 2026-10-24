// FILE: c:\Users\Sree\Desktop\pat\frontend\src\components\DeleteConfirmModal.jsx
import { AlertTriangle } from 'lucide-react';

/**
 * DeleteConfirmModal
 * @param {{ onConfirm: function, onCancel: function, transactionTitle: string }} props
 */
export default function DeleteConfirmModal({ onConfirm, onCancel, transactionTitle }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal card */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-base font-semibold text-slate-800 text-center mb-2">
          Delete Transaction
        </h3>
        <p className="text-sm text-slate-500 text-center leading-relaxed">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-700">
            &ldquo;{transactionTitle}&rdquo;
          </span>
          ? This cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
