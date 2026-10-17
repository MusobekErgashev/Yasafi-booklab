'use client'

import React, { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import EmployeesReportTab from './EmployeesReportTab'
import ResourceReportTab from './ResourceReportTab'
import useQuery from '@/utils/useQuery'

const Report = () => {
    const [activeTab, setActiveTab] = useState("employees")
    const [dateFilter, setDateFilter] = useState("")

    const { query, setQuery, clearQuery } = useQuery()

    // Sahifadan chiqqanda qidiruv so'zini tozalash
    useEffect(() => {
        return () => {
            clearQuery()
        }
    }, [clearQuery])

    return (
        <div className='space-y-3 font-geist'>
            <div className='flex gap-3 items-center flex-wrap'>
                <div className="flex items-center whitespace-nowrap">
                    <button 
                        onClick={() => setActiveTab("employees")} 
                        className={`${activeTab === "employees" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border cursor-pointer px-4 w-45 py-2 rounded-l-md transition-all`}
                    >
                        Xodimlar bo'yicha
                    </button>
                    <button 
                        onClick={() => setActiveTab("resources")} 
                        className={`${activeTab === "resources" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border cursor-pointer px-4 w-45 py-2 rounded-r-md transition-all`}
                    >
                        Resurslar bo'yicha
                    </button>
                </div>

                <div className='border group/search border-gray-200 focus-within:border-primary/45 transition-all duration-300 ease-in-out flex rounded-md px-3 py-1.5 gap-2 items-center flex-1 min-w-64'>
                    <Search size={22} className='text-slate-400 shrink-0' />
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none text-primary w-full text-md' 
                        placeholder={activeTab === "employees" ? "Hodimlar ismi yoki hisobot bo'yicha qidirish..." : "Resurslar matni bo'yicha qidirish..."} 
                    />
                    {query && (
                        <button 
                            type="button" 
                            onClick={clearQuery} 
                            className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
                            title="Tozalash"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                <select 
                    value={dateFilter} 
                    onChange={(e) => setDateFilter(e.target.value)} 
                    className='outline-none text-primary w-max ml-auto text-md border border-gray-200 bg-white cursor-pointer rounded-md px-3 py-1.5 shrink-0'
                >
                    <option value="">Barchasi</option>
                    <option value="bugun">Bugun</option>
                    <option value="oxirgi_xafta">Oxirgi hafta</option>
                </select>
            </div>
            {activeTab === "employees" ? (
                <EmployeesReportTab query={query} dateFilter={dateFilter} />
            ) : (
                <ResourceReportTab query={query} dateFilter={dateFilter} />
            )}
        </div>
    )
}

export default Report