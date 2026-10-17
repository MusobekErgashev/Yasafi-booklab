'use client'

import React, { useEffect, useState } from 'react'
import {
  User,
  Calendar,
  Clock,
  AlertTriangle,
  X,
  DollarSign,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Building2,
  Search,
  Filter,
  Phone
} from 'lucide-react'
import api from '@/api/axios'
import useQuery from '@/utils/useQuery'

const Finance = () => {
  const [selectedDebtor, setSelectedDebtor] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [debtors, setDebtors] = useState({ total_debt: 0, total_debtors: 0, expired: 0, total: 0, total_pages: 1, page: 1, limit: 10, debtors: [] })

  const { query, setQuery, clearQuery } = useQuery()

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)

  // Sahifadan chiqqanda qidiruv so'zini tozalash
  useEffect(() => {
    return () => {
      clearQuery()
    }
  }, [clearQuery])

  // Qidiruv o'zgarganda 1-sahifaga qaytarish
  useEffect(() => {
    setPage(1)
  }, [query])

  async function getDebtors() {
    setLoading(true)
    try {
      const params = { page, limit: 10 }
      if (query && query.trim() !== '') {
        params.q = query.trim()
      }
      const resp = await api.get('debtors', { params })
      setDebtors(resp.data)
    } catch (err) {
      setDebtors({ total_debt: 0, total_debtors: 0, expired: 0, total: 0, total_pages: 1, page: 1, limit: 10, debtors: [] })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDebtors()
  }, [page, query])

  const handleOpenDetail = (debtor) => {
    setSelectedDebtor(debtor)
    setIsDrawerOpen(true)
  }

  const formatCurrency = (val) => {
    if (!val && val !== 0) return ''
    const clean = String(val).replace(/\D/g, '')
    if (!clean) return ''
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  const handleOpenPaymentModal = () => {
    setPaymentAmount('')
    setPaymentDate(new Date().toISOString().slice(0, 10))
    setPaymentError('')
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    if (!selectedDebtor) return

    const cleanAmount = Number(String(paymentAmount).replace(/\D/g, ''))
    if (!cleanAmount || cleanAmount <= 0) {
      setPaymentError("To'lov summasini kiriting!")
      return
    }

    const currentTotalDebt = Number(selectedDebtor.total_debt || 0)
    if (cleanAmount > currentTotalDebt) {
      setPaymentError(`To'lov summasi umumiy qarzdan (${currentTotalDebt.toLocaleString('uz-UZ')} UZS) ko'p bo'lishi mumkin emas!`)
      return
    }

    try {
      setPaymentLoading(true)
      setPaymentError('')

      const dateToSend = paymentDate || new Date().toISOString().slice(0, 10)
      const resp = await api.put(`debtors/${selectedDebtor.id}`, {
        amount: cleanAmount,
        date: dateToSend
      })

      const updated = resp.data

      setSelectedDebtor(prev => ({
        ...prev,
        ...updated,
        total_debt: updated.total_debt !== undefined ? Number(updated.total_debt) : Math.max(0, currentTotalDebt - cleanAmount),
        payment_history: updated.payment_history || [
          ...(prev.payment_history || []),
          { id: Date.now(), paid_at: dateToSend, paid_amount: cleanAmount }
        ]
      }))

      await getDebtors()

      setIsPaymentModalOpen(false)
      setPaymentAmount('')
    } catch (err) {
      console.error("To'lovni saqlashda xatolik:", err)
      setPaymentError(err?.response?.data?.message || "To'lovni qabul qilishda xatolik yuz berdi!")
    } finally {
      setPaymentLoading(false)
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "—"
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return String(dateString)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  return (
    <div className='space-y-6 font-satoshi relative overflow-hidden'>
      {/* 1. Yuqori Tezkor Analitika Kartalari */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">Jami Qarz Balansi</span>
            <span className="text-[20px] font-black text-[#0F172A]">{debtors?.total_debt?.toLocaleString('uz-UZ')} UZS</span>
          </div>
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">Muddati O'tgan</span>
            <span className="text-[20px] font-black text-red-500">{debtors.expired} ta mijoz</span>
          </div>
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">Faol Shartnomalar</span>
            <span className="text-[20px] font-black text-emerald-600">{debtors?.total_debtors} ta</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Asosiy Jadval (Modern Table) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-5">Mijoz va Filial</th>
                <th className="py-4 px-5">Qarz Balansi</th>
                <th className="py-4 px-5">Muddati (Deadline)</th>
                <th className="py-4 px-5">Izoh</th>
                <th className="py-4 px-5 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400 font-medium">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : !debtors?.debtors || debtors.debtors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400 font-medium">
                    Qarzdorlar topilmadi.
                  </td>
                </tr>
              ) : (
                debtors.debtors.map((debtor) => {
                  return (
                    <tr
                      key={debtor.id}
                      className="hover:bg-slate-50/40 transition-all cursor-pointer group"
                      onClick={() => handleOpenDetail(debtor)}
                    >
                      {/* Mijoz ismi va Filiali */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${debtor.is_expired ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'}`}>
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold capitalize text-primary flex items-center gap-1.5">
                              {debtor.customer_name}
                            </div>
                            <div className="text-[11px] capitalize text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                              <Building2 className="w-3.5 h-3.5 text-slate-300" />
                              {debtor.branch_name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Qarz Balansi */}
                      <td className="py-4 px-5">
                        <span className={`font-extrabold text-[14px] ${debtor.is_expired ? 'text-red-500' : 'text-primary'}`}>
                          {debtor.total_debt?.toLocaleString('uz-UZ')} UZS
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-[12px] font-bold flex items-center gap-1.5 ${debtor.is_expired ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-600'
                            }`}>
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(debtor?.deadline)}
                          </span>
                          {debtor.is_expired && (
                            <span className="text-[9px] bg-red-100 text-red-600 font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                              Kechikdi
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Izoh (Qisqartirilgan holatda) */}
                      <td className="py-4 px-5 max-w-[200px] truncate text-slate-400 font-medium">
                        {debtor.note || "Izoh yo'q"}
                      </td>

                      {/* Batafsil Ko'rish tugmasi */}
                      <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenDetail(debtor)}
                          className="inline-flex items-center gap-1 text-[12px] font-bold text-primary bg-slate-100 hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                        >
                          Batafsil <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sodda Pagination */}
      <div className="flex items-center justify-between px-6 py-3.5 border border-slate-100 rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <span className="text-xs font-medium text-slate-400">
          Jami: <span className="font-bold text-slate-700">{debtors?.total || 0}</span> ta
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Oldingi sahifa"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-[13px] font-semibold text-slate-600 px-2 select-none">
            {page} / {debtors?.total_pages || 1}
          </span>

          <button
            type="button"
            disabled={page >= (debtors?.total_pages || 1) || loading}
            onClick={() => setPage(prev => Math.min(debtors?.total_pages || 1, prev + 1))}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Keyingi sahifa"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. BATAFSIL DRAWER (Yon tomondan ochiluvchi oyna) */}
      {isDrawerOpen && selectedDebtor && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Orqa fonni xiralashtirish (Backdrop) */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Oynaning o'zi */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-100 p-6 animate-slide-in">
            <div className="space-y-6 overflow-y-auto custom-scrollbar pb-6">

              {/* Oyna Tepasi */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Qarzdor Tafsiloti</span>
                  <h4 className="text-[18px] font-black text-primary mt-1 capitalize">{selectedDebtor.customer_name}</h4>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Ma'lumotlar kartochkasi */}
              <div className="space-y-3.5 bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Mas'ul filial:</span>
                  <span className="font-bold text-primary flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> {selectedDebtor.branch_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Telefon raqami:</span>
                  <span className="font-bold text-slate-600">{selectedDebtor.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Ro'yxatga olindi:</span>
                  <span className="font-bold text-slate-600">{formatDate(selectedDebtor.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Qarz Muddati:</span>
                  <span className={`font-bold flex items-center gap-1 ${selectedDebtor.is_expired ? 'text-red-500' : 'text-slate-600'}`}>
                    {formatDate(selectedDebtor.deadline)}
                  </span>
                </div>
              </div>

              {/* Qarz Qoldig'i */}
              <div className="p-4 bg-red-50/30 border border-red-100/50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-red-600/80 font-bold uppercase tracking-wider block">Hozirgi Qarz Qoldig'i</span>
                  <span className="text-[20px] font-black text-red-500 block mt-1">
                    {selectedDebtor.total_debt?.toLocaleString('uz-UZ')} UZS
                  </span>
                </div>
                <div className="p-2.5 bg-red-500 text-white rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              {/* Izoh / Eslatma */}
              {selectedDebtor.note && (
                <div className="p-4 bg-amber-50/30 border border-amber-100/60 rounded-xl space-y-1">
                  <span className="text-[11px] text-amber-600/80 font-bold uppercase tracking-wider block flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Izoh / Ma'lumot
                  </span>
                  <p className="text-[12.5px] text-slate-600 font-medium leading-relaxed">{selectedDebtor.note}</p>
                </div>
              )}

              {/* To'lovlar Tarixi (Xronologik chiziq) */}
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">To'lovlar tarixi</span>

                {(!selectedDebtor.payment_history || selectedDebtor.payment_history.length === 0) ? (
                  <div className="text-center py-6 bg-slate-50/40 border border-dashed border-slate-200 rounded-xl">
                    <p className="text-[12px] text-slate-400 italic">Ushbu shartnoma bo'yicha hali to'lov qilinmagan.</p>
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                    {selectedDebtor.payment_history.map((payment) => (
                      <div key={payment.id} className="relative flex items-center justify-between text-[13px]">
                        {/* Timeline Nuqtasi */}
                        <div className="absolute -left-[20px] w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />

                        <div className="flex flex-col">
                          <span className="font-bold text-primary">Qisman To'lov</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" /> {formatDate(payment.paid_at)}
                          </span>
                        </div>
                        <span className="font-extrabold text-emerald-600 bg-emerald-50/80 border border-emerald-100/50 px-2.5 py-1 rounded-lg">
                          +{Number(payment.paid_amount || 0).toLocaleString('uz-UZ')} UZS
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Pastki Qism: To'lov Qo'shish */}
            <div className="pt-4 border-t border-slate-100 mt-auto">
              <button 
                onClick={handleOpenPaymentModal}
                disabled={Number(selectedDebtor.total_debt) <= 0}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 text-[13.5px] font-bold text-white bg-primary rounded-xl hover:bg-primary/95 transition-all cursor-pointer shadow-sm shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DollarSign className="w-4 h-4" /> 
                {Number(selectedDebtor.total_debt) <= 0 ? "Qarz to'liq to'langan" : "To'lovni qabul qilish"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. TO'LOVNI QABUL QILISH MODALI */}
      {isPaymentModalOpen && selectedDebtor && (
        <div 
          onClick={() => !paymentLoading && setIsPaymentModalOpen(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 font-satoshi"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[17px] font-black text-primary leading-tight">To'lovni qabul qilish</h3>
                  <p className="text-[12px] text-slate-400 capitalize mt-0.5">{selectedDebtor.customer_name} • {selectedDebtor.branch_name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !paymentLoading && setIsPaymentModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Qarz ma'lumoti */}
            <div className="my-4 p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
              <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Hozirgi qarz qoldig'i:</span>
              <span className="text-[15px] font-black text-red-500">
                {Number(selectedDebtor.total_debt || 0).toLocaleString('uz-UZ')} UZS
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="payment_amount" className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">
                    To'lov summasi <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentAmount(String(selectedDebtor.total_debt || 0))
                      if (paymentError) setPaymentError('')
                    }}
                    className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    Barchasini to'lash
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="payment_amount"
                    autoFocus
                    required
                    value={formatCurrency(paymentAmount)}
                    onChange={(e) => {
                      setPaymentAmount(e.target.value.replace(/\D/g, ''))
                      if (paymentError) setPaymentError('')
                    }}
                    placeholder="Masalan: 500 000"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-[15px] text-slate-900 font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all pr-14"
                  />
                  <span className="absolute right-3.5 top-3 text-[12px] font-bold text-slate-400 select-none">
                    UZS
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="payment_date" className="block text-[12px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  To'lov sanasi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="payment_date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-[14px] text-slate-800 font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                  />
                </div>
              </div>

              {paymentError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-[12px] font-semibold text-red-600">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={paymentLoading}
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="px-5 py-2.5 rounded-xl bg-primary text-[13px] font-bold text-white hover:bg-primary/95 active:scale-95 transition-all shadow-sm shadow-primary/10 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {paymentLoading ? "Saqlanmoqda..." : "To'lovni tasdiqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Finance