'use client'

import { Search, UserPlus } from 'lucide-react'
import React, { useState } from 'react'
import UnFinishedTasksTab from './UnFinishedTasksTab'
import AllTasksTab from './AllTasksTab'
import FinishedTasksTab from './FinishedTasksTab'

const Tasks = () => {
    const [activeTab, setActiveTab] = useState("all");

    return (
        <div className='space-y-3 font-geist'>
            <div className='flex gap-3'>
                <div className="flex items-center whitespace-nowrap">
                    <button onClick={() => setActiveTab("all")} className={`${activeTab === "all" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border cursor-pointer px-4 w-35 py-2 rounded-l-md`}>Barchasi</button>
                    <button onClick={() => setActiveTab("finished")} className={`${activeTab === "finished" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border-y cursor-pointer px-4 w-35 py-2`}>Bajarilgan</button>
                    <button onClick={() => setActiveTab("unfinished")} className={`${activeTab === "unfinished" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border cursor-pointer px-4 w-35 py-2 rounded-r-md`}>Bajarilmagan</button>
                </div>

                <div className='border group/search border-gray-200 focus-within:border-primary/45 transition-all duration-300 ease-in-out flex rounded-md px-3 py-1.5 gap-2 items-center'>
                    <Search size={22} className='text-slate-400' />
                    <input type="text" className='outline-none text-primary min-w-100 text-md w-full' placeholder="Topshiriqlar nomi bo'yicha qidirish..." />
                </div>

                <select name="" id="" className='outline-none text-primary w-max ml-auto text-md border border-gray-200 bg-white cursor-pointer rounded-md px-3 py-1.5'>
                    <option value="">Barchasi</option>
                    <option value="">Barchasi</option>
                    <option value="">Barchasi</option>
                </select>
            </div>  
            {activeTab === "all" ? <AllTasksTab /> : activeTab === "finished" ? <FinishedTasksTab /> : <UnFinishedTasksTab />}
        </div>
    )
}

export default Tasks