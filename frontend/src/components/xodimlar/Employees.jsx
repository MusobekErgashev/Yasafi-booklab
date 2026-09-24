'use client'

import React, { useEffect, useState } from 'react'
import {
  Plus,
  User,
  Phone,
  Calendar,
  Hash,
  Award,
  Edit3,
  Trash2,
  Search,
  UserPlus
} from 'lucide-react'
import api from '@/api/axios'
import AddEmployeeModal from './AddEmployeeModal'
import WarningModal from '../WarningModal'
import toast from 'react-hot-toast'
import useQuery from '@/utils/useQuery'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [total, setTotal] = useState(0)
  const [openAddModal, setOpenAddModal] = useState(false)
  const [deleteWarn, setDeleteWarn] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const { query, setQuery, clearQuery } = useQuery();

  async function getEmployees() {
    try {
      setErrorMsg('')
      const res = await api.get(`users?q=${query}`);
      const { total, employees } = await res.data
      setTotal(total)
      setEmployees(employees)
    } catch (error) {
      setEmployees([])
      setTotal(0)
      setErrorMsg(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    getEmployees()
  }, [query])

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };

    const formatted = date.toLocaleString("uz-UZ", options);

    return formatted.replace(",", "");
  };

  const deleteEmployee = async (id) => {
    try {
      await api.delete(`users/${id}`);
      setDeleteWarn(false)
      await getEmployees();
      toast.success("Xodim muvaffaqiyatli o'chirildi!")
    } catch (error) {
      toast.error("Xatolik yuz berdi!")
    }
  };

  return (
    <div className="w-full space-y-4 animate-fade-in font-geist">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div>
          <h3 className="text-[16px] font-bold text-slate-800">Xodimlar</h3>
          <p className="text-[13px] text-slate-400 mt-0.5">
            Jami ro'yxatga olingan xodimlar: <span className="font-semibold text-slate-700">{total} ta</span>
          </p>
        </div>
        <button onClick={() => { setOpenAddModal(true); setIsEditing(false); setEditingEmployee(null); }} className="flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium text-white bg-[#0f172a] rounded-lg hover:bg-[#1e293b] transition-all cursor-pointer shadow-sm">
          <UserPlus className="w-4 h-4" /> Yangi xodim
        </button>
      </div>

      <div className="w-full bg-white rounded-xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[13px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5 w-10 text-center"><span className="flex items-center justify-center gap-1">No</span></th>
                <th className="py-3.5 px-5"><span className="flex items-center gap-1"><User className="w-3.5 h-3.5 mb-0.5" /> Xodim ismi</span></th>
                <th className="py-3.5 px-5"><span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 mb-0.5" /> Telefon</span></th>
                <th className="py-3.5 px-5"><span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 mb-0.5" /> Qo'shilgan sana</span></th>
                <th className="py-3.5 px-5 text-center w-24">Amallar</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 text-[14px] text-slate-700">
              {employees.map((employee, index) => (
                <tr key={employee.id} className="hover:bg-slate-50/50 transition-colors group">

                  <td className="py-4 px-5 text-center font-mono text-[13px] font-medium text-slate-500">
                    {index + 1}
                  </td>

                  <td className="py-4 px-5 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5 capitalize">
                      <div className="w-8 h-8 rounded-full bg-[#0f172a]/5 text-[#0f172a] flex items-center justify-center font-bold text-[13px]">
                        {employee.first_name.charAt(0)}
                      </div>
                      <span>{employee.first_name + " " + employee.last_name}</span>
                    </div>
                  </td>

                  <td className="py-4 px-5 font-medium text-slate-600">
                    {employee.phone}
                  </td>

                  <td className="py-4 px-5 text-slate-400 text-[13px]">
                    {formatDate(employee.created_at)}
                  </td>

                  <td className="py-4 px-5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => { setOpenAddModal(true); setIsEditing(true); setEditingEmployee(employee) }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all cursor-pointer" title="Tahrirlash">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setDeleteWarn(true); setDeletingId(employee.id) }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer" title="O'chirish">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employees.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-[14px]">
            {errorMsg ? errorMsg : "Hozircha xodimlar mavjud emas."}
          </div>
        )}
      </div>

      {openAddModal && (
        <AddEmployeeModal
          isEditing={isEditing}
          editingEmployee={editingEmployee}
          onClose={() => setOpenAddModal(false)}
          onSuccess={getEmployees}
        />
      )}

      {
        deleteWarn && (
          <WarningModal
            onClose={() => setDeleteWarn(false)}
            type='warning'
            onConfirm={() => {
              deleteEmployee(deletingId)
            }}
            onCancel={() => setDeleteWarn(false)}
            confirmText="O'chirish"
            cancelText="Bekor qilish"
            title="O'chirish"
            message={`Haqiqatdan ham ushbu xodimni o'chirmoqchimisiz?`}
          />
        )
      }
    </div>
  )
}

export default Employees