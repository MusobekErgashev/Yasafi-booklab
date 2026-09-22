'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import api from '@/api/axios'
import toast from 'react-hot-toast'

const AddBookModal = ({ isOpen, onClose, categories = [], editingBook = null, onSuccess }) => {
  const initialCategory = editingBook
    ? categories?.find((c) => c.id === editingBook.category_id)
    : null

  const [name, setName] = useState(editingBook?.name || "")
  const [size, setSize] = useState(editingBook?.size || "")
  const [price, setPrice] = useState(
    editingBook?.price !== undefined && editingBook?.price !== null
      ? String(editingBook.price)
      : ""
  )
  const [categoryName, setCategoryName] = useState(initialCategory?.name || "")
  const [categoryId, setCategoryId] = useState(editingBook?.category_id || null)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return ''
    const cleanAmount = String(amount).replace(/\D/g, '')
    if (!cleanAmount) return ''
    return cleanAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleCategoryInputChange = (val) => {
    setCategoryName(val)
    const existing = categories?.find(
      (c) => c.name?.trim().toLowerCase() === val.trim().toLowerCase()
    )
    if (existing) {
      setCategoryId(existing.id)
    } else {
      setCategoryId(null)
    }
  }

  const handleSelectCategory = (cat) => {
    setCategoryId(cat.id)
    setCategoryName(cat.name)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !size || !price || !categoryName.trim()) return

    setLoading(true)
    try {
      let finalCategoryId = categoryId

      if (!finalCategoryId) {
        const existing = categories?.find(
          (c) => c.name?.trim().toLowerCase() === categoryName.trim().toLowerCase()
        )
        if (existing) {
          finalCategoryId = existing.id
        } else {
          const catRes = await api.post('/categories/', { name: categoryName.trim() })
          finalCategoryId = catRes.data.id
        }
      }

      const payload = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        size,
        price: Number(price),
        category_id: finalCategoryId,
        sales_count: editingBook ? (editingBook.sales_count || 0) : 0,
      }

      if (editingBook) {
        await api.put(`/books/${editingBook.id}/`, payload)
        toast.success("Kitob muvaffaqiyatli tahrirlandi")
      } else {
        await api.post('/books/', payload)
        toast.success("Kitob muvaffaqiyatli qo'shildi")
      }

      setName("")
      setSize("")
      setPrice('')
      setCategoryName("")
      setCategoryId(null)
      onClose()
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Xatolik yuz berdi:", error)
      toast.error(editingBook ? "Kitobni tahrirlashda xatolik yuz berdi" : "Kitob qo'shishda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-[#0F172A]">
            {editingBook ? "Kitobni tahrirlash" : "Yangi kitob qo'shish"}
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
              Kitob nomi
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Ingliz tili"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
            />
          </div>

          <div>
            <label htmlFor="size" className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Hajmi
            </label>
            <input
              type="text"
              id="size"
              name="size"
              required
              value={size.toUpperCase()}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Masalan: A4"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Narxi (so'm)
            </label>
            <input
              type="text"
              id="price"
              name="price"
              required
              value={formatCurrency(price)}
              onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
              placeholder="Masalan: 10000"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
              Kategoriya
            </label>
            <input
              type="text"
              id="category"
              name="category"
              required
              value={categoryName}
              onChange={(e) => handleCategoryInputChange(e.target.value)}
              placeholder="Masalan: Darslik"
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
            />

            <div className='mt-3 flex flex-wrap gap-2 max-h-50 overflow-y-auto custom-scrollbar'>
              {categories?.map((cat, index) => {
                const isSelected = categoryId === cat.id || (categoryName.trim().toLowerCase() === cat.name?.trim().toLowerCase())
                return (
                  <button
                    key={cat.id || index}
                    type="button"
                    onClick={() => handleSelectCategory(cat)}
                    className={`flex items-center cursor-pointer gap-2 rounded-md border px-3.5 py-1 text-[12px] font-medium transition-all ${isSelected
                      ? 'border-[#0F172A] bg-[#0F172A] text-white'
                      : 'border-gray-200 text-gray-900 hover:bg-slate-50'
                      }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                )
              })}
            </div>
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
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBookModal