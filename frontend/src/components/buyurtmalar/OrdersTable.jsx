'use client'

import api from '@/api/axios'
import OrderCard from '@/components/buyurtmalar/OrderCard'
import React, { useEffect, useState } from 'react'

const thead = [
    { id: 1, title: "No", width: "w-14" },
    { id: 2, title: "Buyurtma qilindi", width: "w-85" },
    { id: 3, title: "Buyurtma qabul qilindi", width: "w-85" },
    { id: 4, title: "Buyurtma jarayonda", width: "w-85" },
    { id: 5, title: "Buyurtma tugatildi", width: "w-85" },
    { id: 6, title: "Buyurtma topshirildi", width: "w-85" }
]

const statusMap = ["ordered", "accepted", "in_progress", "completed", "delivered"]

const initialOrders = [
    {
        id: 1,
        order_id: 122345,
        message: "",
        created_at: "2026-07-11",
        deadline: "2026-07-11",
        book_name: "Rus tili 1-qism",
        book_size: "A4",
        price: 10000,
        quantity: 10,
        status: "ordered",
        isRejected: false
    },
    {
        id: 2,
        order_id: 122343,
        message: "",
        created_at: "2026-07-11",
        deadline: "2026-07-11",
        book_name: "Rus tili 1-qism",
        book_size: "A4",
        price: 10000,
        quantity: 10,
        status: "ordered",
        isRejected: false
    },
]

const emptyTdStyle = "border border-slate-200 p-4 align-top w-85"

const OrdersTable = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    async function getOrders() {
        try {
            setLoading(true)
            const res = await api.get('orders')
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
    }, [])

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

    return (
        <div className='overflow-x-auto p-2'>
            <table className='table-fixed font-geist border border-slate-200'>
                <thead>
                    <tr className='text-[14px] uppercase bg-slate-50'>
                        {thead.map((item, index) => (
                            <th key={index} className={`border border-slate-200 p-3 font-medium text-primary text-center ${item.width}`}>
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
    )
}

export default OrdersTable