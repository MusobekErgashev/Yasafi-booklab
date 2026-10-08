'use client'

import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import EmployeesReportTab from './EmployeesReportTab'
import ResourceReportTab from './ResourceReportTab'
import api from '@/api/axios'

const Report = () => {
    const [activeTab, setActiveTab] = useState("employees")

    return (
        <div className='space-y-3 font-geist'>
            <div className='flex gap-3'>
                <div className="flex items-center whitespace-nowrap">
                    <button onClick={() => setActiveTab("employees")} className={`${activeTab === "employees" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border cursor-pointer px-4 w-45 py-2 rounded-l-md`}>Xodimlar bo'yicha</button>
                    <button onClick={() => setActiveTab("resources")} className={`${activeTab === "resources" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border cursor-pointer px-4 w-45 py-2 rounded-r-md`}>Resurslar bo'yicha</button>
                </div>

                <div className='border group/search border-gray-200 focus-within:border-primary/45 transition-all duration-300 ease-in-out flex rounded-md px-3 py-1.5 gap-2 items-center'>
                    <Search size={22} className='text-slate-400' />
                    <input type="text" className='outline-none text-primary min-w-100 text-md w-full' placeholder={activeTab === "employees" ? "Hodimlar ismi yoki hisobot bo'yicha qidirish..." : "Resurslar nomi bo'yicha qidirish..."} />
                </div>

                <select name="" id="" className='outline-none text-primary w-max ml-auto text-md border border-gray-200 bg-white cursor-pointer rounded-md px-3 py-1.5'>
                    <option value="">Barchasi</option>
                    <option value="">Barchasi</option>
                    <option value="">Barchasi</option>
                </select>
            </div>
            {activeTab === "employees" ? <EmployeesReportTab /> : <ResourceReportTab />}
        </div>
    )
}

export default Report