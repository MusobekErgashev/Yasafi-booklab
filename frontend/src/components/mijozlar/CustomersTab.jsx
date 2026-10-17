import React, { useState } from 'react'
import {
  User,
  Building2,
  Phone,
  Calendar,
  Edit2,
  Trash2,
  Download,
  UserPlus,
  DollarSign,
  CircleDollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import WarningModal from '../WarningModal';
import api from '@/api/axios';
import toast from 'react-hot-toast';

const CustomersTab = ({ 
  data = [], 
  total = 0, 
  totalPages = 1, 
  page = 1, 
  setPage, 
  loading = false, 
  onRefresh 
}) => {
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [deletingCust, setDeletingCust] = useState(null);

  async function deleteCustomer() {
    setOpenWarningModal(false);

    try {
      await api.delete(`customers/${deletingCust}`);
      toast.success("Mijoz o'chirildi!");
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi!");
      console.log(error)
    }
  }

  function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
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
          <p className="text-[13px] text-slate-400 mt-0.5">Tizimdagi jami faol mijozlar soni: <span className="font-semibold text-slate-700">{total || 0} ta</span></p>
        </div>
      </div>

      <div className="w-full bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5 w-10 text-center"><span className="flex items-center justify-center gap-1">No</span></th>
                <th className="py-3.5 px-5"><span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Mijoz ismi</span></th>
                <th className="py-3.5 px-5"><span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Kompaniya</span></th>
                <th className="py-3.5 px-5"><span className="flex items-center gap-1"><CircleDollarSign className="w-3.5 h-3.5" /> Qarz</span></th>
                <th className="py-3.5 px-5"><span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Telefon</span></th>
                <th className="py-3.5 px-5"><span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Qo'shilgan sana</span></th>
                <th className="py-3.5 px-5 text-center w-28">Amallar</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 text-[14px] text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : data?.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                    Mijozlar topilmadi.
                  </td>
                </tr>
              ) : (
                data?.map((client, index) => (
                  <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">

                    <td className="py-4 px-5 text-center font-mono text-[13px] font-medium text-slate-500">
                      {(page - 1) * 10 + index + 1}
                    </td>

                    <td className="py-4 px-5 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[13px]">
                          {client?.customer_name?.charAt(0) || 'M'}
                        </div>
                        <span>{client?.customer_name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-slate-600 font-medium">
                      {client?.branch_name || <span className="text-slate-300 italic text-[13px]">Mavjud emas</span>}
                    </td>

                    <td className="py-4 px-5 text-slate-600 font-medium">
                      {client?.debt ? `${Number(client.debt).toLocaleString('uz-UZ')} UZS` : <span className="text-slate-400 italic text-[13px]">Mavjud emas</span>}
                    </td>

                    <td className="py-4 px-5 font-medium text-slate-600">
                      {client?.phone || '-'}
                    </td>

                    <td className="py-4 px-5 text-slate-400 text-[13px]">
                      {formatDate(client?.created_at)}
                    </td>

                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setOpenWarningModal(true); setDeletingCust(client.id) }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer" title="O'chirish">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Sodda Pagination */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/30">
          <span className="text-xs font-medium text-slate-400">
            Jami: <span className="font-bold text-slate-700">{total || 0}</span> ta
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage && setPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Oldingi sahifa"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-[13px] font-semibold text-slate-600 px-2 select-none">
              {page} / {totalPages || 1}
            </span>

            <button
              type="button"
              disabled={page >= (totalPages || 1) || loading}
              onClick={() => setPage && setPage(prev => Math.min(totalPages || 1, prev + 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              title="Keyingi sahifa"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
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