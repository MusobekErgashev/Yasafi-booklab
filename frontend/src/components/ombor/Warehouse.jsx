'use client'

import React, { useState } from 'react'
import { Plus, Warehouse, Calendar, BookOpen, Layers, Edit3, Trash2, PackageOpen, ChevronRight, UserPlus } from 'lucide-react'

const WarehousePage = () => {
    // JavaScript'da state deklaratsiyasi
    const [warehouses, setWarehouses] = useState([
        {
            id: 1,
            warehouse_name: "Asosiy Markaziy Ombor",
            created_at: "14.07.2026",
            books: [
                { name: "Rus tili 1-qism", size: "A4", quantity: 1500, created_at: "14.07.2026" },
                { name: "Ingliz tili Grammar", size: "B5", quantity: 850, created_at: "14.07.2026" },
                { name: "Ona tili qoidalari", size: "A5", quantity: 400, created_at: "14.07.2026" }
            ]
        },
        {
            id: 2,
            warehouse_name: "Chilonzor Filiali Ombori",
            created_at: "10.06.2026",
            books: [
                { name: "Matematika to'plam", size: "A4", quantity: 300, created_at: "10.06.2026" },
                { name: "Fizika masalalar", size: "A4", quantity: 120, created_at: "10.06.2026" }
            ]
        }
    ])

    return (
        <div className='space-y-4 font-geist'>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div>
                    <h3 className="text-[16px] font-bold text-slate-800">Omborlar</h3>
                    <p className="text-[13px] text-slate-400 mt-0.5">Jami omborlar soni: <span className="font-semibold text-slate-700">{0} ta</span></p>
                </div>

                <div className="flex items-center w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-[14px] font-medium text-white bg-[#0f172a] rounded-lg hover:bg-[#1e293b] transition-all cursor-pointer shadow-sm">
                        <Plus className="w-4 h-4" /> Yangi ombor
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-hanken">
                {warehouses.map((warehouse) => {
                    const totalBooksQuantity = warehouse.books.reduce((acc, book) => acc + book.quantity, 0)

                    return (
                        <div
                            key={warehouse.id}
                            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:border-secondary/70 transition-all duration-300 flex flex-col justify-between min-h-80 group"
                        >
                            <div>
                                <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 bg-primary/5 rounded-xl text-primary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                                            <Warehouse className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-[16px] font-bold text-primary leading-snug group-hover:text-secondary transition-colors duration-300">
                                                {warehouse.warehouse_name}
                                            </h4>
                                            <p className="text-[13px] text-slate-500 flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" /> <span>Tashkil etildi: {warehouse.created_at}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <button className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 my-4 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[13px] text-slate-500 font-medium">Kitob Turlari</span>
                                        <span className="text-[15px] font-bold text-primary flex items-center gap-1.5">
                                            <BookOpen className="w-5 h-5 text-slate-400" /> {warehouse.books.length} xil
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[13px] text-slate-500 font-medium">Jami Nusxa</span>
                                        <span className="text-[15px] font-bold text-emerald-600 flex items-center gap-1.5">
                                            <PackageOpen className="w-5 h-5 text-emerald-500" /> {totalBooksQuantity.toLocaleString()} dona
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-2">
                                    <span className="text-[12px] whitespace-nowrap font-bold flex items-center gap-2 text-slate-400 uppercase tracking-wider text-center mb-1">
                                        <div className='w-full h-px bg-slate-200'></div>
                                        <span>Mavjud Kitoblar</span>
                                        <div className='w-full h-px bg-slate-200'></div>
                                    </span>

                                    {warehouse.books.length === 0 ? (
                                        <p className="text-[13px] text-slate-400 italic py-2">{`Ombor bo'sh, kitoblar mavjud emas.`}</p>
                                    ) : (
                                        <div className="max-h-36 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
                                            {warehouse.books.map((book, index) => (
                                                <div key={index} className="flex items-center justify-between pt-2.5 first:pt-0 text-[15px]">
                                                    <div className="flex items-center gap-2">
                                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="font-semibold text-slate-700">{book.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[13px] font-medium">
                                                            <Layers className="w-4 h-4" /> {book.size}
                                                        </span>
                                                        <span className="font-bold text-primary bg-slate-50 border border-slate-200/80 px-2.5 py-0.5 rounded-md text-[13px]">
                                                            {book.quantity} dona
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <button className="w-full py-2.5 border border-dashed border-slate-400 hover:border-secondary hover:bg-slate-50/50 rounded-lg text-[13px] font-semibold text-slate-500 hover:text-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                                    <Edit3 className="w-3.5 h-3.5" /> {`Ombor qoldig'ini o'zgartirish`}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default WarehousePage