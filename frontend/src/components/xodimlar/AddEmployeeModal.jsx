'use client'

import api from '@/api/axios'
import { X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AddEmployeeModal = ({ onClose, isEditing, editingEmployee, onSuccess }) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [hint, setHint] = useState("")

  useEffect(() => {
    if (isEditing && editingEmployee) {
      setFirstName(editingEmployee.first_name || "")
      setLastName(editingEmployee.last_name || "")
      setPhone(editingEmployee.phone || "")
      setLogin(editingEmployee.login || "")
      setPassword("")
    } else {
      setFirstName("")
      setLastName("")
      setPhone("")
      setLogin("")
      setPassword("")
    }
  }, [isEditing, editingEmployee])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setHint("")
      let res;
      if (isEditing) {
        const payload = {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          login: login,
        }
        if (password) {
          payload.password = password
        }
        res = await api.put(`/users/${editingEmployee.id}`, payload)
        if (res.status === 200 || res.status === 201) {
          toast.success("Xodim ma'lumotlari yangilandi!")
          if (onSuccess) onSuccess()
          onClose()
        }
      } else {
        res = await api.post('/users', {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          login: login,
          password: password,
        })

        if (res.status === 201 || res.status === 200) {
          toast.success("Xodim muvaffaqiyatli qo'shildi!")
          if (onSuccess) onSuccess()
          onClose()
        }
      }
    } catch (error) {
      setHint(error.response?.data?.message || "Xatolik yuz berdi!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-[#0F172A]">
            {isEditing ? "Xodim ma'lumotlarini tahrirlash" : "Yangi xodim qo'shish"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Ism
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Masalan: Ali"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Familiya
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Masalan: Valiyev"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Telefon raqami
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Masalan: +998 90 123 45 67"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
            />
          </div>

          <div>
            <label htmlFor="login" className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Login
            </label>
            <input
              type="text"
              id="login"
              name="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Masalan: alibek"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Parol {isEditing && "(O'zgartirmoqchi bo'lsangiz kiriting)"}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEditing ? "Yangi parol (ixtiyoriy)" : "Parol kiriting"}
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
            />
          </div>

          {hint && (
            <p className="text-red-500 text-sm">{hint}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg cursor-pointer border border-gray-200 px-4 py-2 text-[15px] font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg cursor-pointer bg-[#0F172A] px-5 py-2 text-[15px] font-medium text-white hover:bg-[#1E293B] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEmployeeModal;