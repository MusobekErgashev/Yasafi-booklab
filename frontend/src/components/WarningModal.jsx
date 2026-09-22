'use client'

import { ShieldCheck, TriangleAlert } from 'lucide-react';
import { useEffect } from 'react'

const WarningModal = ({
  onConfirm,
  onCancel,
  type = "",
  title = "Rostdan ham bu amalni bajarmoqchimisiz?",
  message = "",
  confirmText = "Tasdiqlash",
  cancelText = "Bekor qilish",
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md overflow-hidden bg-white/90 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl shadow-slate-900/20 border border-white/60 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 ${type == "warning" ? "bg-red-500/15" : "bg-green-500/15"} blur-2xl rounded-full pointer-events-none`} />

        <div className="flex flex-col items-center text-center relative z-10">
          <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${type == "warning" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}  ring-8 ${type == "warning" ? "ring-red-50/60" : "ring-green-50/60"}`}>
            {
              type == "warning" ? <TriangleAlert className='h-7 w-7' /> : <ShieldCheck className='h-7 w-7' />
            }
          </div>

          <h2 className="text-[20px] font-bold text-slate-800 tracking-tight leading-snug">
            {title}
          </h2>

          {message && <p className="text-sm text-slate-600 mt-2">{message}</p>}
        </div>

        <div className="mt-6 flex items-center gap-3 relative z-10">
          <button
            type="button"
            onClick={onCancel}
            className={`w-full py-3 px-4 rounded-xl text-sm font-semibold ${type == "warning" ? "block" : "hidden"} hover:bg-slate-200/80 active:scale-[0.98] transition-all border border-red-600 cursor-pointer`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`w-full py-3 px-4 rounded-xl text-sm font-semibold text-white ${type == "warning" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} active:scale-[0.98] shadow-lg  ${type == "warning" ? "shadow-red-600/25 hover:shadow-red-600/35" : "shadow-green-600/25 hover:shadow-green-600/35"} transition-all cursor-pointer`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default WarningModal