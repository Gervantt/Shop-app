import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', cancelText = 'Cancel', type = 'danger' }) => {
  if (!isOpen) return null;

  const typeClasses = {
    danger: 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30',
    primary: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30',
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onCancel}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 border border-slate-100 flex flex-col items-center p-8 text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-6 ${type === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'}`}>
          {type === 'danger' ? '🗑️' : '❓'}
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
          {title}
        </h3>
        
        <p className="text-slate-500 font-medium leading-relaxed mb-10">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-4 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 shadow-lg cursor-pointer ${typeClasses[type] || typeClasses.primary}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
