import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearNotification } from '../store/notificationSlice';

const Notification = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  const colors = {
    success: 'border-emerald-100 bg-emerald-50 text-emerald-600',
    error: 'border-rose-100 bg-rose-50 text-rose-600',
    info: 'border-slate-100 bg-slate-50 text-slate-600',
    warning: 'border-amber-100 bg-amber-800 text-amber-50'
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[1000] min-w-[320px] max-w-md p-5 rounded-[2rem] border shadow-2xl animate-in slide-in-from-bottom-2 duration-300 ${colors[type] || colors.info}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center font-black text-xs shadow-sm">
          {icons[type] || '•'}
        </div>
        <div className="flex-1 pt-1.5">
          <p className="text-sm font-black tracking-tight leading-none mb-1 capitalize">{type}</p>
          <p className="text-xs font-medium opacity-80">{message}</p>
        </div>
        <button 
          onClick={() => dispatch(clearNotification())}
          className="text-slate-400 hover:text-slate-900 transition-colors p-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Notification;
