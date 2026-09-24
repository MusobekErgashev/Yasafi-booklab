'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import api from '@/api/axios'
import toast from 'react-hot-toast'

const AddCategoryModal = ({ isOpen, onClose, editingCategory = null, onSuccess }) => {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name || editingCategory.category_name || "")
    } else {
      setName("")
    }
  }, [editingCategory, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim()) return

    setLoading(true)

    try {
      const formattedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1)

      if (editingCategory) {
        await api.put('/categories/', { id: editingCategory.id, name: formattedName })
        toast.success("Kategoriya muvaffaqiyatli tahrirlandi")
      } else {
        await api.post('/categories/', { name: formattedName })
        toast.success("Kategoriya muvaffaqiyatli qo'shildi")
      }

      setName("")
      onClose()
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error(editingCategory ? "Kategoriyani tahrirlashda xatolik yuz berdi" : "Kategoriya qo'shishda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-[#0F172A]">
            {editingCategory ? "Kategoriyani tahrirlash" : "Yangi kategoriya qo'shish"}
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
            <label htmlFor="name" className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Kategoriya nomi
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Badiiy"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
            />
          </div>

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
              {loading ? "Saqlanmoqda..." : (editingCategory ? "Saqlash" : "Qo'shish")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCategoryModal