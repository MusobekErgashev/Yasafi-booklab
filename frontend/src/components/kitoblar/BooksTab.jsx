'use client'

import { BookOpen, Edit2, LoaderCircle, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import AddBookModal from './AddBookModal'
import api from '@/api/axios'
import WarningModal from '../WarningModal'

const BooksTab = ({ 
    categories, 
    books = [], 
    total = 0, 
    totalPages = 1, 
    page = 1, 
    setPage, 
    deleteBook, 
    refreshData, 
    loading 
}) => {
    const [isAddModalOpen, setAddModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [deletingBookId, setDeletingBookId] = useState(null)
    const [editingBook, setEditingBook] = useState(null)

    function handleDeleteBook(id) {
        setDeletingBookId(id)
        setIsDeleteDialogOpen(true)
    }

    function handleEditBook(book) {
        setEditingBook(book)
        setAddModalOpen(true)
    }

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return ''
        const cleanAmount = String(amount).replace(/\D/g, '')
        if (!cleanAmount) return ''
        return cleanAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    }

    return (
        <div>
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                <div>
                    <h3 className="text-[16px] font-bold text-slate-800">Kitoblar</h3>
                    <p className="text-[13px] text-slate-400 mt-0.5">
                        Jami ro'yxatga olingan kitoblar: <span className="font-semibold text-slate-700">{total || 0} ta</span>
                    </p>
                </div>
                <button onClick={() => { setEditingBook(null); setAddModalOpen(true); }} className="flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium text-white bg-[#0f172a] rounded-lg hover:bg-[#1e293b] transition-all cursor-pointer shadow-sm">
                    <Plus className="w-4 h-4" /> Yangi kitob
                </button>
            </div>

            <div className="mt-4">
                <div className="overflow-x-auto bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                    {
                        loading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-500">
                                <LoaderCircle className="w-7 h-7 text-[#0f172a] animate-spin" />
                                <span className="text-sm font-medium">Kitoblar yuklanmoqda...</span>
                            </div>
                        ) : books.length > 0 ? (
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th scope='col' className='px-6 py-3'>#</th>
                                        <th scope="col" className="px-6 py-3">Kitob nomi</th>
                                        <th scope="col" className="px-6 py-3">Hajmi</th>
                                        <th scope="col" className="px-6 py-3">Narxi</th>
                                        <th scope="col" className="px-6 py-3">Kategoriya</th>
                                        <th scope="col" className="px-6 py-3">Sotilgan soni</th>
                                        <th scope="col" className="px-2 py-3">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.map((book, index) => {
                                        return (
                                            <tr key={book.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                    {(page - 1) * 10 + index + 1}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-900">{book.name}</td>
                                                <td className="px-6 py-4">{book.size}</td>
                                                <td className="px-6 py-4">{formatCurrency(book.price)} so'm</td>
                                                <td className="px-6 py-4">{book.category_name || "Kategoriyasiz"}</td>
                                                <td className="px-6 py-4">{book.sales_count || 0}</td>
                                                <td className="py-4 px-2">
                                                    <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEditBook(book)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all cursor-pointer" title="Tahrirlash">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteBook(book.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer" title="O'chirish">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className='text-center py-8'>
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <BookOpen className="w-8 h-8 text-slate-300" />
                                </div>
                                <h4 className="text-[15px] font-bold text-slate-800">Kitoblar topilmadi</h4>
                                <p className="text-[13px] text-slate-500 mt-1">
                                    Tizimga yangi kitob qo'shish uchun <span className='font-medium text-slate-700'>Yangi kitob</span> tugmasini bosing
                                </p>
                            </div>
                        )
                    }

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
            </div>

            <AddBookModal
                key={editingBook ? editingBook.id : 'add-book'}
                isOpen={isAddModalOpen}
                onClose={() => {
                    setAddModalOpen(false)
                    setEditingBook(null)
                }}
                categories={categories}
                editingBook={editingBook}
                onSuccess={refreshData}
            />

            {isDeleteDialogOpen && <WarningModal
                onCancel={() => setIsDeleteDialogOpen(false)}
                confirmText="O'chirish"
                type='warning'
                title="Kitobni o'chirish"
                message="Siz ushbu kitobni o'chirishga ishonchingiz komilmi?"
                onConfirm={async () => {
                    await deleteBook(deletingBookId)
                    setIsDeleteDialogOpen(false)
                }}
            />}
        </div>
    )
}

export default BooksTab