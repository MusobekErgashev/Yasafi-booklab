'use client'

import React, { useState } from 'react'
import {
  FolderOpen,
  Calendar,
  Edit3,
  Trash2,
  Plus,
  ChevronDown,
  BookMarked,
  BookOpen,
  Component,
  LoaderCircle
} from 'lucide-react'
import WarningModal from '../WarningModal'
import AddCategoryModal from './AddCategoryModal'

const CategoriesTab = ({ categories, books, deleteCategory, refreshData, loading }) => {
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingCategoryId, setDeletingCategoryId] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const toggleCategory = (id) => {
    if (activeCategoryId === id) {
      setActiveCategoryId(null)
    } else {
      setActiveCategoryId(id)
    }
  }

  function handleDeleteCategory(id) {
    setDeletingCategoryId(id)
    setIsDeleteDialogOpen(true)
  }

  function handleEditCategory(category) {
    setEditingCategory(category)
    setIsAddModalOpen(true)
  }

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

  return (
    <div className="w-full space-y-4 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div>
          <h3 className="text-[16px] font-bold text-slate-800">Kitob Kategoriyalari</h3>
          <p className="text-[13px] text-slate-400 mt-0.5">
            Tizimdagi jami faol janr va bo'limlar: <span className="font-semibold text-slate-700">{categories.length} ta</span>
          </p>
        </div>
        <button onClick={() => { setEditingCategory(null); setIsAddModalOpen(true); }} className="flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium text-white bg-[#0f172a] rounded-lg hover:bg-[#1e293b] transition-all cursor-pointer shadow-sm">
          <Plus className="w-4 h-4" /> Yangi kategoriya
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
        {
          loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 gap-2 bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] text-slate-500">
              <LoaderCircle className="w-7 h-7 text-[#0f172a] animate-spin" />
              <span className="text-sm font-medium">Kategoriyalar yuklanmoqda...</span>
            </div>
          ) : categories.length > 0 ?
            categories.map((category) => {
              const isOpen = activeCategoryId === category.id

              return (
                <div
                  key={category.id}
                  className="bg-white border min-w-80 border-slate-100 rounded-xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.025)] border-t-2 border-t-slate-200 hover:border-t-[#0f172a] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg group-hover:bg-[#0f172a]/5 group-hover:text-[#0f172a] transition-all">
                        <FolderOpen className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="text-[15px] font-bold text-slate-800 group-hover:text-[#0f172a] transition-colors leading-tight">
                        {category.name || category.category_name}
                      </h4>
                    </div>

                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                      <button onClick={() => handleEditCategory(category)} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all cursor-pointer" title="Tahrirlash">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteCategory(category.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer" title="O'chirish">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
                      }`}
                  >
                    <div className="overflow-hidden bg-slate-50/60 rounded-lg border border-slate-100">
                      <div className="p-2.5 space-y-1.5">
                        {
                          books?.filter((book) => book.category_id === category.id).length > 0 ?
                            books?.filter((book) => book.category_id === category.id).map((book, subIndex) => (
                              <div key={book.id} className="flex items-center gap-1.5 text-slate-700 font-medium text-[14px] px-2 py-1.5 rounded-md">
                                <BookOpen className="w-4 h-4" />
                                <span>{book.name}</span> -
                                <span className='font-semibold'>{book.size}</span> -
                                <div><span className='font-semibold'>{book.price}</span> <span>{`so'm`}</span></div>
                              </div>
                            ))
                            : (
                              <div className='text-center col-span-full'>
                                <p className="text-sm text-slate-500">Bu kategoriya bo'yicha kitoblar topilmadi</p>
                              </div>
                            )
                        }
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[12px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {formatDate(category.created_at) || 'Yangi'}
                    </span>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className={`rounded-lg p-1.5 flex items-center gap-1 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all cursor-pointer ${isOpen ? "bg-slate-100 text-[#0f172a]" : ""
                        }`}
                    >
                      <span className='flex items-center gap-1'>
                        <span>{books?.filter((book) => book.category_id === category.id).length} ta kitob</span>
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                </div>
              )
            })
            : (
              <div className='text-center py-8 col-span-full rounded-xl bg-white border border-slate-100'>
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Component className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-[15px] font-bold text-slate-800">Kategoriyalar hali qo'shilmagan</h4>
                <p className="text-[13px] text-slate-500 mt-1">
                  Tizimga ilk kategoriyangizni qo'shish uchun <span className='font-medium text-slate-700'>Yangi kategoriya</span> tugmani bosing
                </p>
              </div>
            )
        }
      </div>

      <AddCategoryModal
        key={editingCategory ? editingCategory.id : 'add-category'}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingCategory(null)
        }}
        editingCategory={editingCategory}
        onSuccess={refreshData}
      />

      {isDeleteDialogOpen && <WarningModal
        onCancel={() => setIsDeleteDialogOpen(false)}
        confirmText="O'chirish"
        type='warning'
        title="Kategoriya o'chirish"
        message="Siz ushbu kategoriyani o'chirishga ishonchingiz komilmi?"
        onConfirm={async () => {
          await deleteCategory(deletingCategoryId)
          setIsDeleteDialogOpen(false)
        }}
      />}
    </div>
  )
}

export default CategoriesTab