import api from '@/api/axios'
import { Edit3, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import AddEmployeeReportModal from './AddEmployeeReportModal';
import toast from 'react-hot-toast';
import WarningModal from '../WarningModal';

const EmployeesReportTab = () => {
  const [reports, setReports] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const [editingReportId, setEditingReportId] = useState(null)
  const [editingInput, setEditingInput] = useState("")
  const [openWaringModal, setOpenWaringModal] = useState(false);
  const [deletingReportId, setDeletingReportId] = useState(null);

  async function fetchReports() {
    try {
      const data = await api.get('employee-reports/')
      setReports(data.data)
    } catch (error) { }
  }

  useEffect(() => {
    fetchReports()

    const fetchUser = async () => {
      try {
        const res = await api.get('/users/me')
        setCurrentUser(res.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUser()
  }, [])

  const handleDeleteReport = async () => {
    try {
      const response = await api.delete(`employee-reports/${deletingReportId}`)
      if (response.status === 200) {
        toast.success("Hisobot muvaffaqiyatli o'chirildi")
        setOpenWaringModal(false)
        setDeletingReportId(null)
        fetchReports()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi")
      setOpenWaringModal(false)
      setDeletingReportId(null)
    }
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    const days = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba']
    const months = [
      'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
      'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
    ]
    const time = d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    return `${d.getDate()}-${months[d.getMonth()]}, ${days[d.getDay()]} \u00b7 ${time}`
  }

  const initials = (name = '') =>
    name
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingReportId(null);
    setEditingInput("");
    setOpenAddModal(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div>
          <h3 className="text-[16px] font-bold text-slate-800">Jami hisobotlar</h3>
          <p className="text-[13px] text-slate-400 mt-0.5">Xodimlar bo'yicha jami hisobotlar soni: <span className="font-semibold text-slate-700">{reports.total || 0} ta</span></p>
        </div>

        <div className="flex items-center w-full sm:w-auto">
          <button onClick={handleOpenAddModal} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-[14px] font-medium text-white bg-[#0f172a] rounded-lg hover:bg-[#1e293b] transition-all cursor-pointer shadow-sm">
            <Plus className="w-4 h-4" /> Yangi hisobot
          </button>
        </div>
      </div>

      {!reports.reports ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 py-16 text-center">
          <p className="text-slate-500 text-sm">Hisobotlar topilmadi.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.reports?.map((item) => {
            const isMine = currentUser && (Number(item.report?.employee_id) === Number(currentUser.id) || Number(item.employee?.id) === Number(currentUser.id));
            return (
              <div
                key={item.report?.id}
                className="group flex justify-between gap-4 rounded-xl bg-white hover:shadow-sm transition-all p-3 sm:p-4 border-l-4 border-l-primary"
              >
                <div className='flex gap-4'>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                    style={{ backgroundColor: '#334155' }}
                  >
                    {initials(item.employee?.first_name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-slate-900 text-md capitalize">{item.employee?.first_name} {item.employee?.last_name}</span>
                    <p className="font-satoshi italic text-[15px] text-slate-700 mt-1 leading-relaxed">
                      &ldquo;{item.report?.message}&rdquo;
                    </p>
                    <p className="text-[12px] text-slate-500 mt-2 font-hanken">{formatDate(item.report?.created_at)}</p>
                  </div>
                </div>

                {
                  isMine && (
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => { setEditingReportId(item.report?.id); setIsEditing(true); setOpenAddModal(true); setEditingInput(item.report?.message) }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all cursor-pointer" title="Tahrirlash">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setDeletingReportId(item.report?.id); setOpenWaringModal(true) }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer" title="O'chirish">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                }
              </div>
            )
          })}
        </div>
      )}

      {
        openAddModal && (
          <AddEmployeeReportModal
            onClose={() => setOpenAddModal(false)}
            isEditing={isEditing}
            editingInput={editingInput}
            editingReportId={editingReportId}
            onSubmit={fetchReports}
          />
        )
      }

      {
        openWaringModal && (
          <WarningModal
            title="Hisobotni o'chirish"
            text="Hisobotni o'chirishga ishonchingiz komilmi?"
            message="Usbu amalni qaytarib bo'lmaydi"
            type='warning'
            onConfirm={handleDeleteReport}
            onCancel={() => setOpenWaringModal(false)}
          />
        )
      }
    </div>
  )
}

export default EmployeesReportTab