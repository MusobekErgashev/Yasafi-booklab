'use client'

import React, { useState } from 'react'
import { 
  User, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  X, 
  DollarSign, 
  FileText,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Building2,
  Search,
  Filter
} from 'lucide-react'

const DebtsTab = () => {
  const [selectedDebtor, setSelectedDebtor] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [debtors, setDebtors] = useState([
    {
      id: 1,
      client_name: "Musobek",
      branch_name: "Chilonzor filiali",
      client_id: 102,
      debt_balance: 4500000, 
      debt_deadline: "2026-08-15",
      note: "1000ta kitob muqovasi uchun qoldiq to'lov",
      created_at: "2026-07-01",
      paid_at: [
        { id: 11, paid_at: "2026-07-10 14:30", paid_amount: 1500000 },
        { id: 12, paid_at: "2026-07-05 11:15", paid_amount: 2000000 }
      ]
    },
    {
      id: 2,
      client_name: "Eldor",
      branch_name: "Yunusobod filiali",
      client_id: 105,
      debt_balance: 1200000,
      debt_deadline: "2026-07-10", // Muddati o'tgan (Bugun: 15.07.2026)
      note: "A4 formatli qog'ozlar yetkazib berish xizmati uchun terminal orqali",
      created_at: "2026-06-25",
      paid_at: []
    },
    {
      id: 3,
      client_name: "Polyglot Nashriyoti",
      branch_name: "Bosh Ofis",
      client_id: 109,
      debt_balance: 8900000,
      debt_deadline: "2026-09-01",
      note: "Rangli bo'yoqlar va qolip tayyorlash xarajatlari",
      created_at: "2026-07-12",
      paid_at: [
        { id: 13, paid_at: "2026-07-13 09:00", paid_amount: 5000000 }
      ]
    }
  ])

  // Bugungi sana bilan solishtirib muddati o'tganini aniqlash (Tizim vaqti: 15.07.2026)
  const isOverdue = (deadlineStr) => {
    const today = new Date('2026-07-15') 
    const deadline = new Date(deadlineStr)
    return deadline < today
  }

  // Qarz tafsilotlarini ko'rish oynasini ochish
  const handleOpenDetail = (debtor) => {
    setSelectedDebtor(debtor)
    setIsDrawerOpen(true)
  }

  // Filtr va Qidiruv
  const filteredDebtors = debtors.filter(debtor => 
    debtor.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    debtor.branch_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Statistika
  const totalOutstanding = debtors.reduce((acc, d) => acc + d.debt_balance, 0)
  const overdueCount = debtors.filter(d => isOverdue(d.debt_deadline)).length

  return (
    <div className='space-y-6 font-satoshi relative overflow-hidden'>
      
      {/* 1. Yuqori Tezkor Analitika Kartalari */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">Jami Qarz Balansi</span>
            <span className="text-[20px] font-black text-[#0F172A]">{totalOutstanding.toLocaleString('uz-UZ')} UZS</span>
          </div>
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">Muddati O'tgan</span>
            <span className="text-[20px] font-black text-red-500">{overdueCount} ta mijoz</span>
          </div>
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">Faol Shartnomalar</span>
            <span className="text-[20px] font-black text-emerald-600">{debtors.length} ta</span>
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
              {filteredDebtors.map((debtor) => {
                const overdue = isOverdue(debtor.debt_deadline)
                return (
                  <tr 
                    key={debtor.id} 
                    className="hover:bg-slate-50/40 transition-all cursor-pointer group"
                    onClick={() => handleOpenDetail(debtor)}
                  >
                    {/* Mijoz ismi va Filiali */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${overdue ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'}`}>
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-primary flex items-center gap-1.5">
                            {debtor.client_name}
                            <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">ID: #{debtor.client_id}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-slate-300" />
                            {debtor.branch_name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Qarz Balansi */}
                    <td className="py-4 px-5">
                      <span className={`font-extrabold text-[14px] ${overdue ? 'text-red-500' : 'text-primary'}`}>
                        {debtor.debt_balance.toLocaleString('uz-UZ')} UZS
                      </span>
                    </td>

                    {/* Deadline */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 ${
                          overdue ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-600'
                        }`}>
                          <Clock className="w-3.5 h-3.5" />
                          {debtor.debt_deadline}
                        </span>
                        {overdue && (
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
              })}
            </tbody>
          </table>
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
                  <h4 className="text-[18px] font-black text-primary mt-1">{selectedDebtor.client_name}</h4>
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
                  <span className="text-slate-400 font-medium">Mijoz ID raqami:</span>
                  <span className="font-bold text-primary">#{selectedDebtor.client_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Mas'ul filial:</span>
                  <span className="font-bold text-primary flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> {selectedDebtor.branch_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Ro'yxatga olindi:</span>
                  <span className="font-bold text-slate-600">{selectedDebtor.created_at}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Qarz Muddati:</span>
                  <span className={`font-bold flex items-center gap-1 ${isOverdue(selectedDebtor.debt_deadline) ? 'text-red-500' : 'text-slate-600'}`}>
                    {selectedDebtor.debt_deadline}
                  </span>
                </div>
              </div>

              {/* Qarz Qoldig'i */}
              <div className="p-4 bg-red-50/30 border border-red-100/50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-red-600/80 font-bold uppercase tracking-wider block">Hozirgi Qarz Qoldig'i</span>
                  <span className="text-[20px] font-black text-red-500 block mt-1">
                    {selectedDebtor.debt_balance.toLocaleString('uz-UZ')} UZS
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
                
                {selectedDebtor.paid_at.length === 0 ? (
                  <div className="text-center py-6 bg-slate-50/40 border border-dashed border-slate-200 rounded-xl">
                    <p className="text-[12px] text-slate-400 italic">Ushbu shartnoma bo'yicha hali to'lov qilinmagan.</p>
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                    {selectedDebtor.paid_at.map((payment) => (
                      <div key={payment.id} className="relative flex items-center justify-between text-[13px]">
                        {/* Timeline Nuqtasi */}
                        <div className="absolute -left-[20px] w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                        
                        <div className="flex flex-col">
                          <span className="font-bold text-primary">Qisman To'lov</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" /> {payment.paid_at}
                          </span>
                        </div>
                        <span className="font-extrabold text-emerald-600 bg-emerald-50/80 border border-emerald-100/50 px-2.5 py-1 rounded-lg">
                          +{payment.paid_amount.toLocaleString('uz-UZ')} UZS
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Pastki Qism: To'lov Qo'shish */}
            <div className="pt-4 border-t border-slate-100 mt-auto">
              <button className="w-full flex items-center justify-center gap-2 px-5 py-3 text-[13.5px] font-bold text-white bg-primary rounded-xl hover:bg-primary/95 transition-all cursor-pointer shadow-sm shadow-primary/10">
                <DollarSign className="w-4 h-4" /> To'lovni qabul qilish
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default DebtsTab