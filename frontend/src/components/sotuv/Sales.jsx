'use client'

import React, { useState } from 'react'
import {
    Search,
    Plus,
    BookOpen,
    User,
    Building2,
    DollarSign,
    Calendar,
    X,
    ChevronRight,
    TrendingUp,
    Layers,
    Sparkles,
    Maximize2
} from 'lucide-react'

const Sotuvlar = () => {
    // Statelar
    const [salesList, setSalesList] = useState([
        {
            id: 1,
            buyer_name: "Asilbek Olimov",
            buyer_company: "Registon Nashriyoti",
            book_name: "Countdown to Zero Day",
            book_size: "A5",
            quantity: 350,
            created_at: "2026-07-15 14:20",
            price: 22750000, // Jami summa (so'mda)
            rate: 65000, // Kitobning dona narxi (yoki valyuta kursi)
        },
        {
            id: 2,
            buyer_name: "Musobek",
            buyer_company: "Yasafi Booklab",
            book_name: "Kiberxavfsizlik asoslari",
            book_size: "B5",
            quantity: 120,
            created_at: "2026-07-14 11:05",
            price: 9600000,
            rate: 80000,
        },
        {
            id: 3,
            buyer_name: "Dostonbek",
            buyer_company: "Smart Books MCHJ",
            book_name: "Raqamli Qurollar Tarixi",
            book_size: "A5",
            quantity: 500,
            created_at: "2026-07-10 09:30",
            price: 30000000,
            rate: 60000,
        }
    ])

    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedSale, setSelectedSale] = useState(null) // Drawer uchun

    // Yangi sotuv formasi uchun statelar
    const [newSale, setNewSale] = useState({
        buyer_name: '',
        buyer_company: '',
        book_name: '',
        book_size: 'A5',
        quantity: '',
        price: '',
        rate: ''
    })

    // Qidiruv filtri (Xaridor yoki Kitob nomi bo'yicha)
    const filteredSales = salesList.filter(sale =>
        sale.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.book_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.buyer_company.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Analitika
    const totalSalesCount = filteredSales.length
    const totalRevenue = filteredSales.reduce((acc, sale) => acc + Number(sale.price), 0)
    const totalBooksSold = filteredSales.reduce((acc, sale) => acc + Number(sale.quantity), 0)

    // Yangi sotuv qo'shish funksiyasi
    const handleAddSale = (e) => {
        e.preventDefault()
        const saleData = {
            id: Date.now(),
            ...newSale,
            quantity: Number(newSale.quantity),
            price: Number(newSale.price),
            rate: Number(newSale.rate),
            created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
        setSalesList([saleData, ...salesList])
        setIsModalOpen(false)
        // Formani tozalash
        setNewSale({
            buyer_name: '',
            buyer_company: '',
            book_name: '',
            book_size: 'A5',
            quantity: '',
            price: '',
            rate: ''
        })
    }

    return (
        <div className="space-y-6 font-satoshi relative">

            {/* 1. Analitika kartalari (Minimalist uslubda) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">Jami Tushum</span>
                        <span className="text-[20px] font-black text-[#0F172A]">{totalRevenue.toLocaleString('uz-UZ')} UZS</span>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                        <DollarSign className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">Sotilgan Kitoblar</span>
                        <span className="text-[20px] font-black text-primary">{totalBooksSold.toLocaleString('uz-UZ')} dona</span>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                        <BookOpen className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-slate-400 text-[12px] font-semibold block uppercase tracking-wider">Sotuvlar soni</span>
                        <span className="text-[20px] font-black text-primary">{totalSalesCount} ta bitim</span>
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
                                <th className="py-4 px-5">Kitob nomi va Hajmi</th>
                                <th className="py-4 px-5">Soni (Tiraj)</th>
                                <th className="py-4 px-5">Dona Narxi (Rate)</th>
                                <th className="py-4 px-5">Umumiy Summa</th>
                                <th className="py-4 px-5">Sana</th>
                                <th className="py-4 px-5 text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80 text-[13px]">
                            {filteredSales.map((sale) => (
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
                                                <div className="font-bold text-primary">{sale.buyer_name}</div>
                                                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                                                    <Building2 className="w-3.5 h-3.5 text-slate-300" />
                                                    {sale.buyer_company || "Shaxsiy xaridor"}
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
                                        {sale.quantity.toLocaleString('uz-UZ')} ta
                                    </td>

                                    {/* Kurs / Rate (Dona narxi) */}
                                    <td className="py-4 px-5 text-slate-500 font-semibold">
                                        {sale.rate.toLocaleString('uz-UZ')} UZS
                                    </td>

                                    {/* Jami Summa */}
                                    <td className="py-4 px-5">
                                        <span className="font-extrabold text-[14px] text-emerald-600">
                                            {sale.price.toLocaleString('uz-UZ')} UZS
                                        </span>
                                    </td>

                                    {/* Sana */}
                                    <td className="py-4 px-5 text-slate-400 font-medium whitespace-nowrap">
                                        {sale.created_at}
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. MODAL OYNA (Yangi sotuv qo'shish) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />

                    <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] animate-scale-in">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                            <h4 className="text-[16px] font-black text-primary">Yangi sotuv qo'shish</h4>
                            <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddSale} className="space-y-4 pt-4 text-[13px]">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-slate-400 font-bold">Xaridor ismi</label>
                                    <input
                                        type="text"
                                        required
                                        value={newSale.buyer_name}
                                        onChange={(e) => setNewSale({ ...newSale, buyer_name: e.target.value })}
                                        placeholder="Masalan: Musobek"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-slate-400 font-bold">Kompaniya nomi</label>
                                    <input
                                        type="text"
                                        value={newSale.buyer_company}
                                        onChange={(e) => setNewSale({ ...newSale, buyer_company: e.target.value })}
                                        placeholder="Masalan: Yasafi Booklab"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-slate-400 font-bold">Kitob nomi</label>
                                <input
                                    type="text"
                                    required
                                    value={newSale.book_name}
                                    onChange={(e) => setNewSale({ ...newSale, book_name: e.target.value })}
                                    placeholder="Masalan: Countdown to Zero Day"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-slate-400 font-bold">Hajmi (Format)</label>
                                    <select
                                        value={newSale.book_size}
                                        onChange={(e) => setNewSale({ ...newSale, book_size: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50 bg-white"
                                    >
                                        <option value="A5">A5</option>
                                        <option value="B5">B5</option>
                                        <option value="A4">A4</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-slate-400 font-bold">Soni (Tiraj)</label>
                                    <input
                                        type="number"
                                        required
                                        value={newSale.quantity}
                                        onChange={(e) => setNewSale({ ...newSale, quantity: e.target.value })}
                                        placeholder="Masalan: 100"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-slate-400 font-bold">Dona Narxi (Rate)</label>
                                    <input
                                        type="number"
                                        required
                                        value={newSale.rate}
                                        onChange={(e) => setNewSale({ ...newSale, rate: e.target.value })}
                                        placeholder="Masalan: 65000"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-slate-400 font-bold">Jami Summa (Price)</label>
                                    <input
                                        type="number"
                                        required
                                        value={newSale.price}
                                        onChange={(e) => setNewSale({ ...newSale, price: e.target.value })}
                                        placeholder="Masalan: 6500000"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 font-bold cursor-pointer"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl font-bold cursor-pointer"
                                >
                                    Sotuvni saqlash
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

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
                                    <span className="font-bold text-primary">{selectedSale.buyer_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-medium">Kompaniya:</span>
                                    <span className="font-bold text-primary">{selectedSale.buyer_company || "Shaxsiy xaridor"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-medium">Sotilgan sana:</span>
                                    <span className="font-bold text-slate-600">{selectedSale.created_at}</span>
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
                                    <span className="font-bold text-primary">{selectedSale.quantity.toLocaleString('uz-UZ')} dona</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400 font-medium">Dona narxi (Rate):</span>
                                    <span className="font-bold text-primary">{selectedSale.rate.toLocaleString('uz-UZ')} UZS</span>
                                </div>
                            </div>

                            {/* Jami hisob kartasi */}
                            <div className="p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-xl flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] text-emerald-600/80 font-bold uppercase tracking-wider block">Jami Kelishilgan Summa</span>
                                    <span className="text-[20px] font-black text-emerald-600 block mt-1">
                                        {selectedSale.price.toLocaleString('uz-UZ')} UZS
                                    </span>
                                </div>
                                <div className="p-2.5 bg-emerald-500 text-white rounded-lg">
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