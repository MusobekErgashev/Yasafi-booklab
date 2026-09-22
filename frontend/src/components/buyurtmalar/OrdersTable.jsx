'use client'

import OrderCard from '@/components/buyurtmalar/OrderCard'
import React, { useState } from 'react'

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
    const [orders, setOrders] = useState(initialOrders)

    const handleAccept = (orderId) => {
        setOrders(prev => prev.map(order => {
            if (order.id !== orderId) return order

            const currentIndex = statusMap.indexOf(order.status)
            const nextIndex = Math.min(currentIndex + 1, statusMap.length - 1)
            return { ...order, status: statusMap[nextIndex], isRejected: false }
        }))
    }

    const handleReject = (orderId) => {
        setOrders(prev => prev.map(order => {
            if (order.id !== orderId) return order

            if (order.status === "ordered") {
                return { ...order, isRejected: true }
            }
            const currentIndex = statusMap.indexOf(order.status)
            const prevIndex = Math.max(currentIndex - 1, 0)
            return { ...order, status: statusMap[prevIndex] }
        }))
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
                    {orders.map((order, rowIndex) => {
                        const activeColIndex = statusMap.indexOf(order.status)

                        return (
                            <tr key={order.id}>
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
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default OrdersTable