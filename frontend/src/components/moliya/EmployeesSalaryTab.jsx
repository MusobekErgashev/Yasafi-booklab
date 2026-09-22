'use client'

import React, { useState } from 'react'
import { 
  User, 
  Phone, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Plus, 
  Search, 
  DollarSign, 
  X, 
  ArrowUpRight, 
  Users, 
  ChevronRight,
  History
} from 'lucide-react'

const EmployeesSalaryTab = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Siz yuborgan API strukturasidagi namunaviy ma'lumotlar
  const [salaries, setSalaries] = useState([
    {
      id: 1,
      employee_id: 201,
      employee_name: "Asilbek Olimov",
      employee_phone: "+998 90 123 45 67",
      current_salary: 7500000, // so'mda
      salary_history: [
        { id: 11, salary: 7500000, from: "2026-06-01", to: "Hozirgacha" },
        { id: 12, salary: 6000000, from: "2026-01-01", to: "2026-05-31" },
        { id: 13, salary: 4500000, from: "2025-08-15", to: "2025-12-31" }
      ]
    },
    {
      id: 2,
      employee_id: 204,
      employee_name: "Shahzoda Aliyeva",
      employee_phone: "+998 93 987 65 43",
      current_salary: 5200000,
      salary_history: [
        { id: 14, salary: 5200000, from: "2026-03-01", to: "Hozirgacha" },
        { id: 15, salary: 4000000, from: "2025-11-01", to: "2026-02-28" }
      ]
    },
    {
      id: 3,
      employee_id: 209,
      employee_name: "Diyorbek To'rayev",
      employee_phone: "+998 99 555 44 33",
      current_salary: 9000000,
      salary_history: [
        { id: 16, salary: 9000000, from: "2026-07-01", to: "Hozirgacha" },
        { id: 17, salary: 8000000, from: "2026-01-01", to: "2026-06-30" }
      ]
    }
  ])

  // Xodim batafsil ma'lumotlarini ko'rish (Drawer'ni ochish)
  const handleOpenDetail = (employee) => {
    setSelectedEmployee(employee)
    setIsDrawerOpen(true)
  }

  // Qidiruv filtri (Ism yoki telefon raqami bo'yicha)
  const filteredSalaries = salaries.filter(item => 
    item.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.employee_phone.includes(searchQuery)
  )

  // Statistika hisob-kitoblari
  const totalMonthlyPayroll = salaries.reduce((acc, emp) => acc + emp.current_salary, 0)
  const averageSalary = salaries.length > 0 ? Math.round(totalMonthlyPayroll / salaries.length) : 0

  return (
    <div className='space-y-6 font-satoshi relative overflow-hidden'>
      
      {/* 1. Ish haqi bo'yicha umumiy statistika (Widgetlar) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">Oylik budjet (Payroll)</span>
            <span className="text-[20px] font-black text-primary">{totalMonthlyPayroll.toLocaleString('uz-UZ')} UZS</span>
          </div>
          <div className="p-3 bg-primary/5 text-primary rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">O'rtacha ish haqi</span>
            <span className="text-[20px] font-black text-emerald-600">{averageSalary.toLocaleString('uz-UZ')} UZS</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">Jami Xodimlar</span>
            <span className="text-[20px] font-black text-primary">{salaries.length} nafar</span>
          </div>
          <div className="p-3 bg-slate-50 text-slate-500 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Xodimlar va ularning oylik stavkalari jadvali */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-5">Xodim va Aloqa</th>
                <th className="py-4 px-5">Oylik Tarifi (Joriy)</th>
                <th className="py-4 px-5">So'nggi O'zgarish</th>
                <th className="py-4 px-5">Tarixlar soni</th>
                <th className="py-4 px-5 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 text-[13px]">
              {filteredSalaries.map((emp) => {
                const currentHistory = emp.salary_history[0] || {}
                return (
                  <tr 
                    key={emp.id} 
                    className="hover:bg-slate-50/40 transition-all cursor-pointer group"
                    onClick={() => handleOpenDetail(emp)}
                  >
                    {/* Xodim ismi va telefoni */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-primary/5 group-hover:text-primary transition-all">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-primary flex items-center gap-1.5">
                            {emp.employee_name}
                            <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">ID: #{emp.employee_id}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                            <Phone className="w-3.5 h-3.5 text-slate-300" />
                            {emp.employee_phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Joriy Oylik Miqdori */}
                    <td className="py-4 px-5">
                      <span className="font-extrabold text-[14.5px] text-primary">
                        {emp.current_salary.toLocaleString('uz-UZ')} UZS
                      </span>
                    </td>

                    {/* So'nggi o'zgarish sanasi */}
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-50 text-slate-600 flex items-center gap-1.5 w-max">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {currentHistory.from || 'Noma\'lum'}
                      </span>
                    </td>

                    {/* Tarixdagi o'zgarishlar soni */}
                    <td className="py-4 px-5">
                      <span className="text-[12px] font-semibold text-slate-500">
                        {emp.salary_history.length} ta bosqich
                      </span>
                    </td>

                    {/* Batafsil tugmasi */}
                    <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => handleOpenDetail(emp)}
                        className="inline-flex items-center gap-1 text-[12px] font-bold text-primary bg-slate-100 hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        Oylik tarixi <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. BATAFSIL DRAWER (Oylik o'zgarishi tarixi timelini bilan) */}
      {isDrawerOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop (Xiralashtiruvchi fon) */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Oynasi */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-100 p-6 animate-slide-in">
            <div className="space-y-6 overflow-y-auto custom-scrollbar pb-6">
              
              {/* Oyna Sarlavhasi */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Xodim profili</span>
                  <h4 className="text-[18px] font-black text-primary mt-1">{selectedEmployee.employee_name}</h4>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Xodim tezkor aloqa kartasi */}
              <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Xodim ID raqami:</span>
                  <span className="font-bold text-primary">#{selectedEmployee.employee_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Telefon raqami:</span>
                  <span className="font-bold text-primary flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedEmployee.employee_phone}
                  </span>
                </div>
              </div>

              {/* Hozirgi Oyligi */}
              <div className="p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-600/80 font-bold uppercase tracking-wider block">Amaldagi Oylik Maoshi</span>
                  <span className="text-[20px] font-black text-emerald-600 block mt-1">
                    {selectedEmployee.current_salary.toLocaleString('uz-UZ')} UZS
                  </span>
                </div>
                <div className="p-2.5 bg-emerald-500 text-white rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              {/* Oylik o'zgarish tarixi (Chronological Timeline) */}
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <History className="w-4 h-4 text-slate-400" /> Oylik o'zgarish tarixi
                </span>
                
                <div className="relative pl-6 space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  {selectedEmployee.salary_history.map((historyItem, index) => (
                    <div key={historyItem.id} className="relative flex flex-col gap-1 text-[13px]">
                      
                      {/* Timeline nuqtasi (Eng yuqoridagisi yashil/faol, eskilari kulrang) */}
                      <div className={`absolute -left-[20px] w-2.5 h-2.5 rounded-full ring-4 ${
                        index === 0 ? 'bg-emerald-500 ring-emerald-50' : 'bg-slate-300 ring-slate-50'
                      }`} />
                      
                      <div className="flex items-center justify-between">
                        <span className={`font-extrabold text-[14px] ${index === 0 ? 'text-primary' : 'text-slate-500'}`}>
                          {historyItem.salary.toLocaleString('uz-UZ')} UZS
                        </span>
                        {index === 0 && (
                          <span className="text-[9px] bg-emerald-50 text-emerald-600 font-black px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5">
                            Faol <ArrowUpRight className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                        <span>{historyItem.from} dan</span>
                        <span>dan</span>
                        <span className={historyItem.to === 'Hozirgacha' ? 'text-emerald-600 font-semibold' : ''}>
                          {historyItem.to} gacha
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Pastki Qism: Yangi oylik belgilash */}
            <div className="pt-4 border-t border-slate-100 mt-auto">
              <button className="w-full flex items-center justify-center gap-2 px-5 py-3 text-[13.5px] font-bold text-white bg-primary rounded-xl hover:bg-primary/95 transition-all cursor-pointer shadow-sm shadow-primary/10">
                <Plus className="w-4 h-4" /> Maosh miqdorini o'zgartirish
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default EmployeesSalaryTab