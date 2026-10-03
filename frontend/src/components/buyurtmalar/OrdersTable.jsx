'use client'

import api from '@/api/axios'
import OrderCard from '@/components/buyurtmalar/OrderCard'
import React, { useEffect, useState } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronsUpDown, Check, CircleCheck, Filter, Calendar, ArrowUpDown, RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import useQuery from '@/utils/useQuery'

const thead = [
    { id: 1, title: "No", width: "w-14" },
    { id: 2, title: "Buyurtma qilindi", width: "w-85" },
    { id: 3, title: "Buyurtma qabul qilindi", width: "w-85" },
    { id: 4, title: "Buyurtma jarayonda", width: "w-85" },
    { id: 5, title: "Buyurtma tugatildi", width: "w-85" },
    { id: 6, title: "Buyurtma topshirildi", width: "w-85" }
]

const statusMap = ["ordered", "accepted", "in_progress", "completed", "delivered"]

const filterOptions = [
    { value: "", label: "Barcha statuslar" },
    { value: "ordered", label: "Buyurtma qilindi" },
    { value: "accepted", label: "Buyurtma qabul qilindi" },
    { value: "in_progress", label: "Buyurtma jarayonda" },
    { value: "completed", label: "Buyurtma tugatildi" },
    { value: "delivered", label: "Buyurtma topshirildi" },
    { value: "rejected", label: "Rad etildi" }
]

const emptyTdStyle = "border border-slate-200 p-4 align-top w-85"

const OrdersTable = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterSort, setFilterSort] = useState("desc")
    const [filterStatus, setFilterStatus] = useState("")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")

    const { query, clearQuery } = useQuery()

    async function getOrders() {
        try {
            setLoading(true)
            const params = {}
            if (filterSort) params.order = filterSort
            if (filterStatus) params.status = filterStatus
            if (dateFrom) params.from = dateFrom
            if (dateTo) params.to = dateTo
            if (query && query.trim() !== '') params.q = query.trim()

            const res = await api.get('orders', { params })
            if (Array.isArray(res.data)) {
                setOrders(res.data)
            } else {
                setOrders([])
            }
        } catch (error) {
            console.log("Buyurtmalarni yuklashda xatolik:", error)
            setOrders([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getOrders()
    }, [filterSort, filterStatus, dateFrom, dateTo, query])

    const handleAccept = async (orderId) => {
        const targetOrder = orders.find(o => o.id === orderId)
        if (!targetOrder) return

        const currentStatus = targetOrder.status || "ordered"
        const currentIndex = statusMap.indexOf(currentStatus)
        const nextIndex = Math.min(currentIndex + 1, statusMap.length - 1)
        const newStatus = statusMap[nextIndex]

        try {
            await api.patch(`orders/${orderId}`, { status: newStatus })
            setOrders(prev => prev.map(order => {
                if (order.id !== orderId) return order
                return { ...order, status: newStatus, isRejected: false }
            }))
        } catch (error) {
            console.log("Statusni o'zgartirishda xatolik:", error)
        }
    }

    const handleReject = async (orderId) => {
        const targetOrder = orders.find(o => o.id === orderId)
        if (!targetOrder) return

        const currentStatus = targetOrder.status || "ordered"
        let newStatus = ""
        let isRejected = false

        if (currentStatus === "ordered" || currentStatus === "rejected") {
            newStatus = "rejected"
            isRejected = true
        } else {
            const currentIndex = statusMap.indexOf(currentStatus)
            const prevIndex = Math.max(currentIndex - 1, 0)
            newStatus = statusMap[prevIndex]
            isRejected = false
        }

        try {
            await api.patch(`orders/${orderId}`, { status: newStatus })
            setOrders(prev => prev.map(order => {
                if (order.id !== orderId) return order
                return { ...order, status: newStatus, isRejected }
            }))
        } catch (error) {
            console.log("Statusni rad etishda xatolik:", error)
        }
    }

    const isFiltered = filterSort !== "desc" || filterStatus !== "" || dateFrom || dateTo || (query && query.trim() !== "")

    return (
        <div className='font-geist space-y-3'>
            <div className="bg-white px-3.5 py-2.5 rounded-xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <SlidersHorizontal className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Barcha buyurtmalar</h2>
                            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
                                {orders.length} ta
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">Buyurtmalarni saralash va filtrlash</p>
                    </div>
                </div>

                <div className='flex flex-wrap items-center gap-2.5 w-full xl:w-auto'>
                    {/* Sort Order Dropdown */}
                    <div className="w-full sm:w-auto min-w-[190px]">
                        <Listbox value={filterSort} onChange={setFilterSort}>
                            <div className="relative">
                                <ListboxButton className="w-full h-10 cursor-pointer flex items-center px-3.5 py-2 justify-between rounded-lg border border-slate-200/90 text-sm bg-white hover:bg-slate-50 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all shadow-2xs text-left">
                                    <span className="flex items-center gap-2 truncate">
                                        <ArrowUpDown className="size-4 shrink-0 text-slate-400" />
                                        <span className="block truncate font-medium text-slate-700">
                                            {filterSort === "asc" ? "Eskilari birinchi" : "Yangilari birinchi"}
                                        </span>
                                    </span>
                                    <ChevronsUpDown aria-hidden="true" className="size-4 text-slate-400 shrink-0 ml-1" />
                                </ListboxButton>
                                <ListboxOptions transition className="absolute right-0 z-30 mt-1 max-h-60 w-full min-w-[200px] overflow-auto rounded-lg outline-0 bg-white text-base border border-slate-200/90 transition duration-150 ease-out data-[closed]:opacity-0 sm:text-sm shadow-xl p-1">
                                    <ListboxOption value="desc" className="group relative py-2 pr-8 pl-3 rounded-md select-none cursor-pointer text-slate-700 data-[focus]:bg-blue-600 data-[focus]:text-white transition-colors outline-hidden">
                                        <div className="flex items-center gap-2">
                                            <CircleCheck className="size-4 shrink-0 text-slate-400 group-data-[focus]:text-white" />
                                            <span className="block truncate font-normal group-data-[selected]:font-semibold">Yangilari birinchi</span>
                                        </div>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-blue-600 group-not-data-[selected]:hidden group-data-[focus]:text-white">
                                            <Check aria-hidden="true" className="size-4" />
                                        </span>
                                    </ListboxOption>
                                    <ListboxOption value="asc" className="group relative py-2 pr-8 pl-3 rounded-md select-none cursor-pointer text-slate-700 data-[focus]:bg-blue-600 data-[focus]:text-white transition-colors outline-hidden">
                                        <div className="flex items-center gap-2">
                                            <CircleCheck className="size-4 shrink-0 text-slate-400 group-data-[focus]:text-white" />
                                            <span className="block truncate font-normal group-data-[selected]:font-semibold">Eskilari birinchi</span>
                                        </div>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-blue-600 group-not-data-[selected]:hidden group-data-[focus]:text-white">
                                            <Check aria-hidden="true" className="size-4" />
                                        </span>
                                    </ListboxOption>
                                </ListboxOptions>
                            </div>
                        </Listbox>
                    </div>

                    {/* Status Filter Dropdown */}
                    <div className="w-full sm:w-auto min-w-[210px]">
                        <Listbox value={filterStatus} onChange={setFilterStatus}>
                            <div className="relative">
                                <ListboxButton className="w-full h-10 cursor-pointer flex items-center px-3.5 py-2 justify-between rounded-lg border border-slate-200/90 text-sm bg-white hover:bg-slate-50 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all shadow-2xs text-left">
                                    <span className="flex items-center gap-2 truncate">
                                        <Filter className="size-4 shrink-0 text-slate-400" />
                                        <span className="block truncate font-medium text-slate-700">
                                            {filterOptions.find(opt => opt.value === filterStatus)?.label || "Barcha statuslar"}
                                        </span>
                                    </span>
                                    <ChevronsUpDown aria-hidden="true" className="size-4 text-slate-400 shrink-0 ml-1" />
                                </ListboxButton>
                                <ListboxOptions transition className="absolute right-0 z-30 mt-1 max-h-60 w-full min-w-[210px] overflow-auto rounded-lg outline-0 bg-white text-base border border-slate-200/90 transition duration-150 ease-out data-[closed]:opacity-0 sm:text-sm shadow-xl p-1">
                                    {filterOptions.map((item) => (
                                        <ListboxOption key={item.value} value={item.value} className="group relative py-2 pr-8 pl-3 rounded-md select-none cursor-pointer text-slate-700 data-[focus]:bg-blue-600 data-[focus]:text-white transition-colors outline-hidden">
                                            <div className="flex items-center gap-2">
                                                <CircleCheck className="size-4 shrink-0 text-slate-400 group-data-[focus]:text-white" />
                                                <span className="block truncate font-normal group-data-[selected]:font-semibold">{item.label}</span>
                                            </div>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-blue-600 group-not-data-[selected]:hidden group-data-[focus]:text-white">
                                                <Check aria-hidden="true" className="size-4" />
                                            </span>
                                        </ListboxOption>
                                    ))}
                                </ListboxOptions>
                            </div>
                        </Listbox>
                    </div>

                    {/* Date From */}
                    <div className="w-full sm:w-auto h-10 flex items-center px-3.5 gap-2 rounded-lg border border-slate-200/90 text-sm bg-white hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 transition-all shadow-2xs">
                        <Calendar className="size-4 shrink-0 text-slate-400" />
                        <span className="text-slate-500 font-medium text-xs whitespace-nowrap">Dan:</span>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className='w-full outline-none bg-transparent text-sm text-slate-800 font-medium cursor-pointer'
                        />
                        {dateFrom && (
                            <button type="button" onClick={() => setDateFrom("")} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Date To */}
                    <div className="w-full sm:w-auto h-10 flex items-center px-3.5 gap-2 rounded-lg border border-slate-200/90 text-sm bg-white hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 transition-all shadow-2xs">
                        <Calendar className="size-4 shrink-0 text-slate-400" />
                        <span className="text-slate-500 font-medium text-xs whitespace-nowrap">Gacha:</span>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className='w-full outline-none bg-transparent text-sm text-slate-800 font-medium cursor-pointer'
                        />
                        {dateTo && (
                            <button type="button" onClick={() => setDateTo("")} className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Clear Filters Button */}
                    {isFiltered && (
                        <button
                            type="button"
                            onClick={() => {
                                setFilterSort("desc")
                                setFilterStatus("")
                                setDateFrom("")
                                setDateTo("")
                                clearQuery()
                            }}
                            className="h-10 px-3.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/60 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Tozalash
                        </button>
                    )}
                </div>
            </div>

            <div className='overflow-x-auto'>
                <table className='table-fixed border border-slate-200'>
                    <thead>
                        <tr className='text-[14px] uppercase bg-slate-50'>
                            {thead.map((item, index) => (
                                <th key={index} className={`border text-nowrap border-slate-200 p-3 font-medium text-primary text-center ${item.width}`}>
                                    {item.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={thead.length} className="border border-slate-200 p-8 text-center text-slate-400 font-medium">
                                    Yuklanmoqda...
                                </td>
                            </tr>
                        ) : orders && orders.length > 0 ? (
                            orders.map((order, rowIndex) => {
                                const currentStatus = order.status || "ordered"
                                let activeColIndex = statusMap.indexOf(currentStatus)
                                if (activeColIndex === -1) activeColIndex = 0

                                return (
                                    <tr key={order.id || rowIndex}>
                                        <td className='border border-slate-200 p-4 text-[16px] text-primary text-center align-top font-semibold w-14'>
                                            {rowIndex + 1}
                                        </td>

                                        {statusMap.map((_, colIndex) =>
                                            activeColIndex === colIndex ? (
                                                <OrderCard
                                                    key={colIndex}
                                                    order={order}
                                                    isRejected={order.isRejected}
                                                    onAccept={() => handleAccept(order.id)}
                                                    onReject={() => handleReject(order.id)}
                                                />
                                            ) : (
                                                <td key={colIndex} className={emptyTdStyle}></td>
                                            )
                                        )}
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={thead.length} className="border border-slate-200 p-8 text-center text-slate-400 font-medium">
                                    Buyurtmalar mavjud emas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrdersTable