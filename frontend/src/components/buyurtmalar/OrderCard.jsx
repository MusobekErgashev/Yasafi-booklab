'use client'

import { BookOpen, Building2, Calendar, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Layers, Mail, Phone, User, Warehouse, XCircle } from 'lucide-react'
import React, { useState } from 'react'

const OrderCard = ({ order, onAccept, onReject, isRejected }) => {
    const [cardOpen, setCardOpen] = useState(true)
    const [noteOpen, setNoteOpen] = useState(true)

    const isCardRejected = isRejected || order?.status === "rejected"
    const isOrderedOrRejected = !order?.status || order?.status === "ordered" || order?.status === "rejected"

    const tdStyle = "text-[14px] p-4 border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.01)] group hover:shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition-all duration-300 align-top whitespace-normal"

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
        <td className={`${isCardRejected ? "bg-red-100" : "bg-white"} min-w-65 max-w-65 transition-all duration-300 ${tdStyle} ${cardOpen ? 'max-h-[470px]' : 'h-[125px]'}`}>
            <div className='flex flex-col gap-3.5'>
                <div onClick={() => setCardOpen(!cardOpen)} className={`flex select-none items-start cursor-pointer justify-between transition-all duration-100 ease-in gap-3 ${cardOpen ? 'border-b border-slate-200/60 pb-3' : 'border-0 border-slate-200/0'}`}>
                    <div className='flex gap-2.5 items-start'>
                        <div className='p-2 bg-secondary/10 rounded-lg text-secondary shrink-0'>
                            <BookOpen className='w-4 h-4' />
                        </div>
                        <div>
                            <h4 className='text-[15px] font-bold capitalize truncate text-nowrap text-primary leading-tight max-w-[160px]'>{order.book_name}</h4>
                            <p className='text-[12px] text-slate-400 flex items-center gap-1'>
                                <Layers className='w-3.5 h-3.5' /> O‘lchami: <span className='font-semibold text-primary/80'>{order.book_size}</span>
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='text-[12px] font-extrabold bg-primary text-white px-2.5 py-1 rounded-md shadow-sm shrink-0'>
                            {order.quantity ?? order.book_count ?? 0} dona
                        </span>
                        <div className='p-1 bg-yellow-500/10 rounded text-yellow-500'>
                            <ChevronDown size={18} className={`transition-all duration-300 ${cardOpen ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                </div>

                <div className={`flex flex-col ${cardOpen ? 'gap-1.5' : 'gap-0'}`}>
                    <div className={`space-y-3.5 transition-all duration-200 ease-out ${cardOpen ? `opacity-100 ${noteOpen ? 'h-[225px]' : 'h-[260px]'}` : 'opacity-0 h-0 blur-sm overflow-hidden'}`}>
                        <div className='flex flex-col gap-2 text-[13px] text-slate-600 border-b border-slate-100 pb-3'>
                            <div className='flex items-center justify-between'>
                                <span className='flex items-center gap-1.5 text-slate-400'><User className='w-3.5 h-3.5' /> Kimdan:</span>
                                <span className='font-semibold text-primary max-w-[170px] truncate'>{order.customer_name || '—'}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                                <span className='flex items-center gap-1.5 text-slate-400'><Building2 className='w-3.5 h-3.5' /> Tashkilot:</span>
                                <span className='font-semibold text-primary max-w-[170px] truncate'>{order.branch_name || '—'}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                                <span className='flex items-center gap-1.5 text-slate-400'><Phone className='w-3.5 h-3.5' /> Telefon:</span>
                                <span className='font-medium text-slate-700 max-w-[170px]'>{order.phone || '—'}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                                <span className='flex items-center gap-1.5 text-slate-400'><Calendar className='w-3.5 h-3.5' /> Sana:</span>
                                <span className='font-medium text-slate-700'>
                                    {formatDate(order.created_at)}
                                </span>
                            </div>
                        </div>

                        <div onClick={() => setNoteOpen(!noteOpen)} className={`flex cursor-pointer gap-1.5 ${isCardRejected ? "bg-red-100" : "bg-yellow-50/80"} border border-yellow-100/60 p-2.5 rounded-lg text-[13px] text-yellow-700 font-medium leading-normal transition-all ${noteOpen ? 'h-[38px]' : 'h-[70px]'}`}>
                            <Mail size={16} className='shrink-0 text-yellow-500' />
                            <span className={`leading-4 overflow-hidden ${noteOpen ? 'truncate' : 'whitespace-normal'}`}>Izoh: {order.message || order.note || "Mavjud emas"}</span>
                            <ChevronDown size={16} className={`ml-auto shrink-0 text-yellow-500 transition-all duration-200 ${noteOpen ? '' : 'rotate-180'}`} />
                        </div>

                        <div className={`flex w-full gap-2 pt-1 transition-all duration-200 ease-in ${cardOpen ? 'opacity-100' : 'opacity-0'}`}>
                            <button className='flex-1 py-2 select-none cursor-pointer rounded-lg border border-primary/20 text-primary font-semibold text-[13px] hover:bg-slate-100 transition-all flex items-center justify-center gap-1'>
                                <Warehouse className='w-3.5 h-3.5' /> Ombordan topshirish
                            </button>
                        </div>
                    </div>

                    <div className='max-w-100 select-none flex items-center gap-2'>
                        <button onClick={onReject} className={`w-full outline-0 py-2 cursor-pointer rounded-lg border font-semibold text-[13px] transition-all flex items-center justify-center gap-1 ${isOrderedOrRejected ? "border-red-500/30 text-red-500 hover:bg-red-500/10" : "border-primary/20 text-primary hover:bg-slate-100"}`}>
                            {isOrderedOrRejected ? <XCircle className='w-3.5 h-3.5' /> : <ChevronLeft className='w-3.5 h-3.5' />}
                            {isOrderedOrRejected ? (isCardRejected ? "Rad etildi" : "Rad etish") : "Orqaga"}
                        </button>
                        <button onClick={onAccept} className={`w-full outline-0 py-2 cursor-pointer rounded-lg border font-semibold text-[13px] transition-all flex items-center justify-center gap-1 ${isOrderedOrRejected ? "border-primary/20 text-primary hover:bg-slate-100" : "border-primary/20 text-primary hover:bg-slate-100"}`}>
                            {isOrderedOrRejected ? "Qabul qilish" : "Oldinga"}
                            {isOrderedOrRejected ? <CheckCircle2 className='w-3.5 h-3.5' /> : <ChevronRight className='w-3.5 h-3.5' />}
                        </button>
                    </div>
                </div>
            </div>
        </td>
    )
}

export default OrderCard