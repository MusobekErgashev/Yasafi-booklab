'use client'

import { Search, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import UnFinishedTasksTab from './UnFinishedTasksTab'
import AllTasksTab from './AllTasksTab'
import FinishedTasksTab from './FinishedTasksTab'
import useQuery from '@/utils/useQuery'

const Tasks = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const { query, setQuery, clearQuery } = useQuery();

    useEffect(() => {
        return () => {
            clearQuery();
        };
    }, [clearQuery]);

    return (
        <div className='space-y-3 font-geist'>
            <div className='flex gap-3 items-center flex-wrap'>
                <div className="flex items-center whitespace-nowrap">
                    <button onClick={() => setActiveTab("all")} className={`${activeTab === "all" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border cursor-pointer px-4 w-35 py-2 rounded-l-md transition-all`}>Barchasi</button>
                    <button onClick={() => setActiveTab("finished")} className={`${activeTab === "finished" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border-y cursor-pointer px-4 w-35 py-2 transition-all`}>Bajarilgan</button>
                    <button onClick={() => setActiveTab("unfinished")} className={`${activeTab === "unfinished" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border cursor-pointer px-4 w-35 py-2 rounded-r-md transition-all`}>Bajarilmagan</button>
                </div>

                <div className='border group/search border-gray-200 focus-within:border-primary/45 transition-all duration-300 ease-in-out flex rounded-md px-3 py-1.5 gap-2 items-center flex-1 min-w-64'>
                    <Search size={22} className='text-slate-400 shrink-0' />
                    <input 
                        type="text" 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        className='outline-none text-primary w-full text-md' 
                        placeholder="Topshiriq matni yoki xodim bo'yicha qidirish..." 
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
                    className='outline-none text-primary w-max ml-auto text-md border border-gray-200 bg-white cursor-pointer rounded-md px-3 py-1.5'
                >
                    <option value="all">Barchasi</option>
                    <option value="today">Bugungi</option>
                    <option value="week">Haftalik</option>
                    <option value="month">Oylik</option>
                </select>
            </div>  
            {activeTab === "all" ? (
                <AllTasksTab dateFilter={dateFilter} searchQuery={query} />
            ) : activeTab === "finished" ? (
                <FinishedTasksTab dateFilter={dateFilter} searchQuery={query} />
            ) : (
                <UnFinishedTasksTab dateFilter={dateFilter} searchQuery={query} />
            )}
        </div>
    )
}

export default Tasks