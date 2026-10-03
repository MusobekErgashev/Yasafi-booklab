import React, { useState } from 'react'
import {
  Building2,
  Users,
  Calendar,
  Edit3,
  Trash2,
  Plus,
  X,
  ChevronRight,
  Briefcase
} from 'lucide-react'

// Backend yoki state dan keladigan namuna ma'lumotlar
const mockBranches = [
  { id: 1, branch_name: "Polyglot Bosh Ofis", included_clients: [102, 105, 108, 110], created_at: "2026-03-15" },
  { id: 2, branch_name: "Smart Edu Chilonzor", included_clients: [201, 204], created_at: "2026-05-20" },
  { id: 3, branch_name: "Yashil Chiroq Sergeli", included_clients: [305, 309, 312], created_at: "2026-07-01" },
  { id: 4, branch_name: "G'ofur G'ulom Noshriyoti", included_clients: [401, 402, 403, 404, 405], created_at: "2026-07-10" },
]

// Modal ichida ismlarni chiroyli chiqarish uchun mijozlar bazasi (Namuna)
const mockClientsDatabase = {
  102: { name: "Musobek", phone: "+998 90 123 45 67" },
  105: { name: "Diyorbek Alimov", phone: "+998 93 444 55 66" },
  108: { name: "Sardor Komilov", phone: "+998 94 777 11 22" },
  110: { name: "Nodira Shukurova", phone: "+998 99 888 33 44" },
  201: { name: "Zuhra Karimova", phone: "+998 99 456 11 22" },
  204: { name: "Jasur Axmedov", phone: "+998 91 222 33 44" },
  // ... qolgan mijozlar
}

const BranchesTab = ({ data }) => {
  const [branches, setBranches] = useState(mockBranches)
  const [selectedBranch, setSelectedBranch] = useState(null) // Bosilgan filialni saqlash uchun

  return (
    <div className="w-full space-y-5 animate-fade-in relative">

      {/* 1. Yuqori panel */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div>
          <h3 className="text-[16px] font-bold text-slate-800">Filiallar va Hamkorlar</h3>
          <p className="text-[13px] text-slate-400 mt-0.5">
            Jami ro'yxatga olingan buyurtmachi korxonalar: <span className="font-semibold text-slate-700">{branches.length} ta</span>
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-white bg-[#0f172a] rounded-lg hover:bg-[#1e293b] transition-all cursor-pointer shadow-sm">
          <Plus className="w-4 h-4" /> Yangi filial
        </button>
      </div>

      {/* 2. Filiallar Grid (Kartochkalar tizimi) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] border-l-4 border-l-[#0f172a] transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Sarlavha va Amallar */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-3 items-center">
                  <div className="p-2.5 bg-slate-50 text-slate-700 rounded-lg group-hover:bg-[#0f172a] group-hover:text-white transition-all duration-300">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-[15px] font-bold text-slate-900 group-hover:text-[#0f172a] transition-colors leading-snug">
                    {branch.branch_name}
                  </h4>
                </div>

                {/* Tahrirlash va O'chirish tugmalari */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all cursor-pointer" title="Tahrirlash">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer" title="O'chirish">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Ishchilar soni info */}
              <div className="mt-5 flex items-center justify-between bg-slate-50/70 p-3 rounded-lg border border-slate-100/80">
                <span className="text-[13px] text-slate-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-500" /> Brikiktirilgan xodimlar:
                </span>
                <span className="text-[14px] font-extrabold text-slate-800 bg-white border border-slate-200/60 px-2.5 py-0.5 rounded-full shadow-2xs">
                  {branch.included_clients.length} nafar
                </span>
              </div>
            </div>

            {/* Pastki qism: Sana va Ishchilarni ko'rish tugmasi */}
            <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[12px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {branch.created_at}
              </span>

              <button
                onClick={() => setSelectedBranch(branch)}
                className="text-[13px] font-semibold text-slate-600 hover:text-[#0f172a] flex items-center gap-0.5 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
              >
                Ishchilar ro'yxati <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. MODAL OYNA: Filial ustiga bosganda ishchilar ro'yxatini ko'rsatish */}
      {selectedBranch && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-slide-up">

            {/* Modal Head */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0f172a]" />
                <h3 className="text-[15px] font-bold text-slate-800 truncate max-w-[320px]">
                  {selectedBranch.branch_name} xodimlari
                </h3>
              </div>
              <button
                onClick={() => setSelectedBranch(null)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Ishchilar Ro'yxati) */}
            <div className="p-4 max-h-[350px] overflow-y-auto space-y-2">
              {selectedBranch.included_clients.length > 0 ? (
                selectedBranch.included_clients.map((id) => {
                  const client = mockClientsDatabase[id] || { name: `Noma'lum Mijoz (ID: ${id})`, phone: "Kiritilmagan" }
                  return (
                    <div key={id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-[12px] flex items-center justify-center">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <h5 className="text-[13.5px] font-semibold text-slate-800 leading-tight">{client.name}</h5>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">ID: #{id}</p>
                        </div>
                      </div>
                      <span className="text-[12px] text-slate-500 font-medium bg-white px-2 py-1 rounded border border-slate-100 shadow-3xs">
                        {client.phone}
                      </span>
                    </div>
                  )
                })
              ) : (
                <p className="text-center py-6 text-[13px] text-slate-400 italic">Bu filialga hali hech qaysi mijoz biriktirilmagan.</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setSelectedBranch(null)}
                className="px-4 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
              >
                Yopish
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default BranchesTab