'use client'

import React, { useEffect, useState } from 'react'
import {
    Search,
    Plus,
    BookOpen,
    User,
    Building2,
    DollarSign,
    Calendar,
    X,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Layers,
    Sparkles,
    Maximize2
} from 'lucide-react'
import api from '@/api/axios'
import useQuery from '@/utils/useQuery'

const Sotuvlar = () => {
    // Statelar
    const [salesList, setSalesList] = useState({
        sales: [],
        total_money: 0,
        total_debt: 0,
        total_books: 0,
        total_transaction: 0,
        total_pages: 1,
        total: 0
    })
    const [selectedSale, setSelectedSale] = useState(null)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    const { query, clearQuery } = useQuery()

    async function fetchSales() {
        try {
            setLoading(true)
            const params = { page }
            if (query && query.trim() !== '') {
                params.q = query.trim()
            }
            const res = await api.get(`sales`, { params })
            setSalesList(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // Sahifadan chiqqanda qidiruv so'zini tozalash
    useEffect(() => {
        return () => {
            clearQuery()
        }
    }, [clearQuery])

    // Qidiruv o'zgarganda 1-sahifaga qaytarish
    useEffect(() => {
        setPage(1)
    }, [query])

    useEffect(() => {
        fetchSales()
    }, [page, query])

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
        <div className="space-y-6 font-geist relative">

            {/* 1. Analitika kartalari (Minimalist uslubda) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">Jami Tushum</span>
                        <span className="text-[20px] font-black text-[#0F172A]">{salesList?.total_money?.toLocaleString('uz-UZ') || 0} UZS</span>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">Jami Qarz</span>
                        <span className="text-[20px] font-black text-[#0F172A]">{salesList?.total_debt?.toLocaleString('uz-UZ') || 0} UZS</span>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">Sotilgan Kitoblar</span>
                        <span className="text-[20px] font-black text-primary">{salesList?.total_books || 0} dona</span>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                        <BookOpen className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">Sotuvlar soni</span>
                        <span className="text-[20px] font-black text-primary">{salesList?.total_transaction || 0} ta bitim</span>
                    </div>
                    <div className="p-3 bg-slate-50 text-slate-500 rounded-xl">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* 3. Sotuvlar Jadvali */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                                <th className="py-4 px-5">Xaridor va Kompaniya</th>
                                <th className="py-4 px-5">Kitob nomi va o'lchami</th>
                                <th className="py-4 px-5">Soni</th>
                                <th className="py-4 px-5">Dona Narxi</th>
                                <th className="py-4 px-5">Umumiy Summa</th>
                                <th className="py-4 px-5">Sana</th>
                                <th className="py-4 px-5 text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80 text-[13px]">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                                        Yuklanmoqda...
                                    </td>
                                </tr>
                            ) : salesList?.sales?.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-slate-400 font-medium">
                                        Sotuvlar topilmadi
                                    </td>
                                </tr>
                            ) : (
                                salesList?.sales?.map((sale) => (
                                <tr
                                    key={sale.id}
                                    className="hover:bg-slate-50/40 transition-all cursor-pointer group"
                                    onClick={() => setSelectedSale(sale)}
                                >
                                    {/* Xaridor ismi */}
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-primary capitalize">{sale?.customer_name}</div>
                                                <div className="text-[11px] capitalize text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                                                    <Building2 className="w-3.5 h-3.5 text-slate-300" />
                                                    {sale?.branch_name || "Filialsiz"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Kitob nomi va o'lchami */}
                                    <td className="py-4 px-5">
                                        <div className="font-semibold text-primary">{sale.book_name}</div>
                                        <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[10px] font-black bg-slate-100 text-slate-500 rounded">
                                            {sale.book_size}
                                        </span>
                                    </td>

                                    {/* Soni */}
                                    <td className="py-4 px-5 font-bold text-slate-600">
                                        {sale?.book_count} ta
                                    </td>

                                    {/* Kurs / Rate (Dona narxi) */}
                                    <td className="py-4 px-5 text-slate-500 font-semibold">
                                        {sale?.price?.toLocaleString('uz-UZ')} UZS
                                    </td>

                                    {/* Jami Summa */}
                                    <td className="py-4 px-5">
                                        <span className={`font-extrabold text-[14px] ${sale?.is_debt ? 'text-red-500' : 'text-emerald-600'}`}>
                                            {sale?.total_price?.toLocaleString('uz-UZ')} UZS
                                        </span>
                                    </td>

                                    {/* Sana */}
                                    <td className="py-4 px-5 text-slate-400 font-medium whitespace-nowrap">
                                        {formatDate(sale?.sold_at)}
                                    </td>

                                    {/* Ko'rish */}
                                    <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => setSelectedSale(sale)}
                                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-all cursor-pointer inline-flex"
                                        >
                                            <Maximize2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>

                {/* Sodda Pagination */}
                <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/30">
                    <span className="text-xs font-medium text-slate-400">
                        Jami: <span className="font-bold text-slate-700">{salesList?.total || 0}</span> ta
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={page <= 1 || loading}
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                            title="Oldingi sahifa"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <span className="text-[13px] font-semibold text-slate-600 px-2 select-none">
                            {page} / {salesList?.total_pages || 1}
                        </span>

                        <button
                            type="button"
                            disabled={page >= (salesList?.total_pages || 1) || loading}
                            onClick={() => setPage(prev => Math.min(salesList?.total_pages || 1, prev + 1))}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                            title="Keyingi sahifa"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 5. SIDE DRAWER (Batafsil ko'rish oynasi) */}
            {selectedSale && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-xs" onClick={() => setSelectedSale(null)} />

                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-100 p-6 animate-slide-in">
                        <div className="space-y-6 overflow-y-auto pb-6">

                            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bitim Tafsiloti</span>
                                    <h4 className="text-[16px] font-black text-primary mt-1">ID #{selectedSale.id}</h4>
                                </div>
                                <button onClick={() => setSelectedSale(null)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-50">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Xaridor tafsiloti */}
                            <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-[13px]">
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-medium">Xaridor:</span>
                                    <span className="font-bold text-primary">{selectedSale.customer_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-medium">Kompaniya:</span>
                                    <span className="font-bold text-primary">{selectedSale.branch_name || "Shaxsiy xaridor"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-medium">Sotilgan sana:</span>
                                    <span className="font-bold text-slate-600">{formatDate(selectedSale.sold_at)}</span>
                                </div>
                            </div>

                            {/* Mahsulot (Kitob) tafsiloti */}
                            <div className="space-y-3.5 p-4 bg-slate-50/50 border border-slate-100 rounded-xl text-[13px]">
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-medium">Kitob nomi:</span>
                                    <span className="font-bold text-primary">{selectedSale.book_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-medium">Format o'lchami:</span>
                                    <span className="font-bold text-primary">{selectedSale.book_size}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-medium">Soni (Adadi):</span>
                                    <span className="font-bold text-primary">{selectedSale.book_count} dona</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-medium">Dona narxi (Rate):</span>
                                    <span className="font-bold text-primary">{selectedSale.price} UZS</span>
                                </div>
                            </div>

                            {/* Jami hisob kartasi */}
                            <div className={`p-4 border rounded-xl flex items-center justify-between ${selectedSale?.is_debt ? 'bg-red-50/30 border-red-100/50' : 'bg-emerald-50/30 border-emerald-100/50'}`}>
                                <div>
                                    <span className={`text-[11px] ${selectedSale?.is_debt ? 'text-red-500/80' : 'text-emerald-600/80'} font-bold uppercase tracking-wider block`}>Jami {selectedSale?.is_debt && '(qarzga)'}</span>
                                    <span className={`text-[20px] font-black ${selectedSale?.is_debt ? 'text-red-500' : 'text-emerald-600'} block mt-1`}>
                                        {selectedSale.total_price.toLocaleString('uz-UZ')} UZS
                                    </span>
                                </div>
                                <div className={`p-2.5 ${selectedSale?.is_debt ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'} rounded-lg`}>
                                    <DollarSign className="w-5 h-5" />
                                </div>
                            </div>

                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-auto">
                            <button
                                onClick={() => setSelectedSale(null)}
                                className="w-full flex items-center justify-center gap-2 px-5 py-3 text-[13.5px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                            >
                                Yopish
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}

export default Sotuvlar