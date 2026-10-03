import React, { useEffect, useState } from 'react'
import {
  Building2,
  Users,
  Calendar,
  Edit3,
  Trash2,
  Plus,
  X,
  ChevronRight,
  Briefcase,
  User
} from 'lucide-react'

// Backend yoki state dan keladigan namuna ma'lumotlar
const mockBranches = [
  { id: 1, branch_name: "Polyglot Bosh Ofis", included_clients: [102, 105, 108, 110], created_at: "2026-03-15" },
  { id: 2, branch_name: "Smart Edu Chilonzor", included_clients: [201, 204], created_at: "2026-05-20" },
  { id: 3, branch_name: "Yashil Chiroq Sergeli", included_clients: [305, 309, 312], created_at: "2026-07-01" },
  { id: 4, branch_name: "G'ofur G'ulom Noshriyoti", included_clients: [401, 402, 403, 404, 405], created_at: "2026-07-10" },
]

const BranchesTab = ({ data }) => {
  const [selectedBranch, setSelectedBranch] = useState(null) // Bosilgan filialni saqlash uchun
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    const filData = data.filter((item) => item.branch_name !== null)
    setFilteredData(filData)
  }, [data])

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  return (
    <div className="w-full space-y-5 animate-fade-in relative">

      {/* 1. Yuqori panel */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div>
          <h3 className="text-[16px] font-bold text-slate-800">Filiallar va Hamkorlar</h3>
          <p className="text-[13px] text-slate-400 mt-0.5">
            Jami ro'yxatga olingan buyurtmachi korxonalar: <span className="font-semibold text-slate-700">{data.length} ta</span>
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-white bg-[#0f172a] rounded-lg hover:bg-[#1e293b] transition-all cursor-pointer shadow-sm">
          <Plus className="w-4 h-4" /> Yangi filial
        </button>
      </div>

      {/* 2. Filiallar Grid (Kartochkalar tizimi) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredData.map((branch) => (
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
                  <User className="w-4 h-4 text-slate-500" /> Brikiktirilgan xodim:
                </span>
                <span className="text-[14px] font-extrabold text-slate-800 bg-white border border-slate-200/60 px-2.5 py-0.5shadow-2xs">
                  {branch.customer_name}
                </span>
              </div>
            </div>

            {/* Pastki qism: Sana va Ishchilarni ko'rish tugmasi */}
            <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[12px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {formatDate(branch.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BranchesTab