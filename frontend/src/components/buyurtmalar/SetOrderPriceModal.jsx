'use client'

import React, { useState, useEffect } from 'react'
import { X, Banknote, BookOpen, User, Layers, CreditCard, Calendar, FileText } from 'lucide-react'

const SetOrderPriceModal = ({ isOpen, onClose, order, onSubmit, loading }) => {
    const [price, setPrice] = useState("")
    const [isDebt, setIsDebt] = useState(false)
    const [debtDeadline, setDebtDeadline] = useState("")
    const [debtNote, setDebtNote] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (order) {
            setPrice(order.price !== undefined && order.price !== null ? String(order.price) : "")
            setIsDebt(Boolean(order.is_debt))
            setDebtDeadline(order.debt_deadline ? String(order.debt_deadline).slice(0, 10) : "")
            setDebtNote(order.debt_note || "")
            setError("")
        }
    }, [order, isOpen])

    if (!isOpen || !order) return null

    const formatCurrency = (val) => {
        if (!val && val !== 0) return ''
        const clean = String(val).replace(/\D/g, '')
        if (!clean) return ''
        return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const cleanPrice = String(price).replace(/\D/g, '')
        if (!cleanPrice) {
            setError("Iltimos, sotilgan narxni kiriting!")
            return
        }

        if (isDebt && !debtDeadline) {
            setError("Iltimos, qarzni qaytarish muddatini (deadline) kiriting!")
            return
        }

        const soldAt = new Date().toISOString()
        onSubmit(Number(cleanPrice), soldAt, isDebt, debtNote, debtDeadline)
    }

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all font-geist">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 leading-snug">
                                Buyurtma narxini kiritish
                            </h2>
                            <p className="text-xs text-slate-400">Buyurtma topshirilmoqda</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="my-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-slate-400">
                            <BookOpen className="w-3.5 h-3.5 text-slate-500" /> Kitob:
                        </span>
                        <span className="font-bold text-slate-800 text-sm">{order.book_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-slate-400">
                            <Layers className="w-3.5 h-3.5 text-slate-500" /> Soni:
                        </span>
                        <span className="font-semibold text-slate-700">{order.quantity ?? order.book_count ?? 0} dona ({order.book_size || '—'})</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-slate-400">
                            <User className="w-3.5 h-3.5 text-slate-500" /> Mijoz:
                        </span>
                        <span className="font-semibold text-slate-700">{order.customer_name || '—'}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="price" className="block text-[12px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                            Donasi sotilgan narxi (so'mda) <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="price"
                                autoFocus
                                required
                                value={formatCurrency(price)}
                                onChange={(e) => {
                                    setPrice(e.target.value.replace(/\D/g, ''))
                                    if (error) setError("")
                                }}
                                placeholder="Masalan: 150 000"
                                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-[16px] text-slate-900 font-semibold outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all pr-14"
                            />
                            <span className="absolute right-3.5 top-3.75 text-xs font-bold text-slate-400 select-none">
                                SO'MDAN
                            </span>
                        </div>
                        {error && <p className="text-xs text-rose-500 font-medium mt-1">{error}</p>}
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                        <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-lg transition-colors ${isDebt ? 'bg-amber-100 text-amber-700' : 'bg-slate-200/60 text-slate-500'}`}>
                                <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                                <label htmlFor="is_debt_toggle" className="text-xs font-bold text-slate-800 cursor-pointer block leading-tight">
                                    Qarzgami?
                                </label>
                                <p className="text-[11px] text-slate-400">Buyurtma to'lovi qarz sifatida belgilansin</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            id="is_debt_toggle"
                            role="switch"
                            aria-checked={isDebt}
                            onClick={() => setIsDebt(!isDebt)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isDebt ? 'bg-amber-500' : 'bg-slate-300'
                            }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                    isDebt ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                        </button>
                    </div>

                    {isDebt && (
                        <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-3 transition-all duration-200">
                            <div>
                                <label htmlFor="debt_deadline" className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-amber-900 mb-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                                    Qarzni qaytarish muddati <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="debt_deadline"
                                    required={isDebt}
                                    value={debtDeadline}
                                    onChange={(e) => {
                                        setDebtDeadline(e.target.value)
                                        if (error) setError("")
                                    }}
                                    className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-[14px] text-slate-800 font-medium outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer"
                                />
                                <p className="text-[11px] text-amber-700/80 mt-1">
                                    Qarzni qachon qaytarishi aytilgan bo'lsa, o'sha muddatni kiriting
                                </p>
                            </div>

                            <div>
                                <label htmlFor="debt_note" className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-amber-900 mb-1.5">
                                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                                    Qarz izohi (Note)
                                </label>
                                <textarea
                                    id="debt_note"
                                    rows={2}
                                    value={debtNote}
                                    onChange={(e) => setDebtNote(e.target.value)}
                                    placeholder="Qarz bo'yicha qo'shimcha izoh yoki kelishuv..."
                                    className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-[13px] text-slate-800 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl cursor-pointer border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl cursor-pointer bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 shadow-sm"
                        >
                            {loading ? "Saqlanmoqda..." : "Tasdiqlash"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SetOrderPriceModal
