'use client'

import { Search } from 'lucide-react'
import React, { useState } from 'react'
import DebtsTab from './DebtsTab'
import EmployeesSalaryTab from './EmployeesSalaryTab'

const Finance = () => {
    const [activeTab, setActiveTab] = useState("debts")

    return (
        <div className='space-y-3 font-geist'>
            <div className='flex gap-3'>
                <div className="flex items-center">
                    <button onClick={() => setActiveTab("debts")} className={`${activeTab === "debts" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border cursor-pointer px-4 w-40 py-2 rounded-l-md`}>Qarzdorlar</button>
                    <button onClick={() => setActiveTab("salary")} className={`${activeTab === "salary" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border cursor-pointer px-4 w-40 py-2 rounded-r-md`}>Ish haqi</button>
                </div>

                <div className='border group/search border-gray-200 focus-within:border-primary/45 transition-all duration-300 ease-in-out flex rounded-md px-3 py-1.5 gap-2 items-center'>
                    <Search size={22} className='text-slate-400' />
                    <input type="text" className='outline-none text-primary min-w-100 text-md w-full' placeholder={activeTab === "debts" ? "Qarzdorlar ichidan qidirish..." : "Xodimlar ichidan qidirish..."} />
                </div>

                {
                    activeTab === "debts" ? (
                        <select name="" id="" className='outline-none text-primary w-max ml-auto text-md border border-gray-200 bg-white cursor-pointer rounded-md px-3 py-1.5'>
                            <option value="">Barchasi</option>
                            <option value="">Barchasi</option>
                            <option value="">Barchasi</option>
                        </select>
                    ) : null
                }
            </div>
            {activeTab === "debts" ? <DebtsTab /> : <EmployeesSalaryTab />}
        </div>
    )
}

export default Finance