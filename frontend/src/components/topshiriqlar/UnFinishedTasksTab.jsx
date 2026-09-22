'use client'

import React from 'react'

const UnFinishedTasksTab = () => {
  return (
    <div className='space-y-4'>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div>
          <h3 className="text-[16px] font-bold text-slate-800">Bajarilmagan topshiriqlar</h3>
          <p className="text-[13px] text-slate-400 mt-0.5">Bajarilmagan topshiriqlar soni: <span className="font-semibold text-slate-700">{0} ta</span></p>
        </div>

        
      </div>
    </div>
  )
}

export default UnFinishedTasksTab