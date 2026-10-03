import React, { useState } from 'react'
import {
  User,
  Building2,
  Phone,
  Calendar,
  Edit2,
  Trash2,
  Download,
  UserPlus
} from 'lucide-react'
import WarningModal from '../WarningModal';
import api from '@/api/axios';
import toast from 'react-hot-toast';

const CustomersTab = ({ data }) => {
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [deletingCust, setDeletingCust] = useState(null);

  async function deleteCustomer() {
    setOpenWarningModal(false);

    try {
      const res = await api.delete(`customers/${deletingCust}`);
      toast.success("Mijoz o'chirildi!");
      setData(data.filter(c => c.id !== deletingCust));
    } catch (error) {
      toast.error("Xatolik yuz berdi!");
      console.log(error)
    }
  }

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
    <div className="w-full space-y-4 animate-fade-in font-geist">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div>
          <h3 className="text-[16px] font-bold text-slate-800">Jami mijozlar</h3>
          <p className="text-[13px] text-slate-400 mt-0.5">Tizimdagi jami faol mijozlar soni: <span className="font-semibold text-slate-700">{data?.length} ta</span></p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all cursor-pointer">
            <Download className="w-4 h-4" /> Export (.xlsx)
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-white bg-[#0f172a] rounded-lg hover:bg-[#1e293b] transition-all cursor-pointer shadow-sm">
            <UserPlus className="w-4 h-4" /> Yangi mijoz
          </button>
        </div>
      </div>

      <div className="w-full bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5 w-10 text-center"><span className="flex items-center justify-center gap-1">No</span></th>
                <th className="py-3.5 px-5"><span className="flex items-center gap-1"><User className="w-3.5 h-3.5 mb-0.5" /> Mijoz ismi</span></th>
                <th className="py-3.5 px-5"><span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 mb-0.5" /> Kompaniya</span></th>
                <th className="py-3.5 px-5"><span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 mb-0.5" /> Telefon</span></th>
                <th className="py-3.5 px-5"><span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 mb-0.5" /> Qo'shilgan sana</span></th>
                <th className="py-3.5 px-5 text-center w-28">Amallar</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 text-[14px] text-slate-700">
              {data?.map((client, index) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">

                  <td className="py-4 px-5 text-center font-mono text-[13px] font-medium text-slate-500">
                    {index + 1}
                  </td>

                  <td className="py-4 px-5 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[13px]">
                        {client?.customer_name?.charAt(0)}
                      </div>
                      <span>{client?.customer_name}</span>
                    </div>
                  </td>

                  <td className="py-4 px-5 text-slate-600 font-medium">
                    {client?.branch_name || <span className="text-slate-300 italic text-[13px]">Mavjud emas</span>}
                  </td>

                  <td className="py-4 px-5 font-medium text-slate-600">
                    {client?.phone}
                  </td>

                  <td className="py-4 px-5 text-slate-400 text-[13px]">
                    {formatDate(client?.created_at)}
                  </td>

                  <td className="py-4 px-5 text-center">
                    <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all cursor-pointer" title="Tahrirlash">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setOpenWarningModal(true); setDeletingCust(client.id) }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer" title="O'chirish">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Agar mijozlar bo'lmasa ko'rinadigan qism */}
        {data?.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-[14px]">
            Mijozlar topilmadi.
          </div>
        )}
      </div>

      {
        openWarningModal && (
          <WarningModal
            onConfirm={deleteCustomer}
            onCancel={() => setOpenWarningModal(false)}
            confirmText="O'chirish"
            cancelText='Bekor qilish'
            type='warning'
            message="Mijozga tegishli barcha ma'lumotlar o'chib ketadi!"
            title="Mijozni o'chirish"
          />
        )
      }
    </div>
  )
}

export default CustomersTab