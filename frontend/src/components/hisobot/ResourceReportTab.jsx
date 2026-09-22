import { Edit3, Layers, PaintBucket, Plus, Trash2, UserPlus } from 'lucide-react'
import React, { useMemo, useState } from 'react'

// const MOCK_REPORTS = [
//   {
//     id: 1,
//     created_at: '2026-07-12T10:20:00',
//     color_count: 4,
//     paper_count: 500,
//     note: 'Zilola kitobi uchun muqova bosildi, glyanets qog\u2019ozda, to\u2019liq CMYK rejimida.',
//   },
//   {
//     id: 2,
//     created_at: '2026-07-11T15:40:00',
//     color_count: 1,
//     paper_count: 1200,
//     note: 'Ichki sahifalar oq-qora rejimda bosib chiqildi, 80 gr ofset qog\u2019ozda.',
//   },
//   {
//     id: 3,
//     created_at: '2026-07-10T09:15:00',
//     color_count: 2,
//     paper_count: 300,
//     note: '\u201cChinor kitob do\u2019koni\u201d uchun reklama bukleti, ikki rangli bosma ishlatildi.',
//   },
//   {
//     id: 4,
//     created_at: '2026-07-09T13:00:00',
//     color_count: 4,
//     paper_count: 800,
//     note: 'Yangi jild dizayni uchun sinov bosmasi, to\u2019liq rangda ikki varaqli maket.',
//   },
// ]

const formatDate = (iso) => {
  const d = new Date(iso)
  const days = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba']
  const months = [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
    'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
  ]
  const time = d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
  return `${d.getDate()}-${months[d.getMonth()]}, ${days[d.getDay()]} \u00b7 ${time}`
}

const PaperIcon = ({ className = '' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M7 3h7l4 4v14H7V3z"
      stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
    />
    <path d="M14 3v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
)

const IconBtn = ({ onClick, title, children, danger }) => (
  <button
    onClick={onClick}
    title={title}
    className={[
      'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
      danger ? 'text-slate-400 hover:text-[#7A2E35] hover:bg-[#FBEAEA]' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100',
    ].join(' ')}
  >
    {children}
  </button>
)

const ResourceReportTab = ({ data }) => {

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div>
          <h3 className="text-[16px] font-bold text-slate-800">Jami hisobotlar</h3>
          <p className="text-[13px] text-slate-400 mt-0.5">Resurslar bo'yicha jami hisobotlar soni: <span className="font-semibold text-slate-700">{0} ta</span></p>
        </div>

        <div className="flex items-center w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-[14px] font-medium text-white bg-[#0f172a] rounded-lg hover:bg-[#1e293b] transition-all cursor-pointer shadow-sm">
            <Plus className="w-4 h-4" /> Yangi hisobot
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 py-16 text-center">
          <p className="text-slate-500 text-sm">Hozircha resurs hisoboti mavjud emas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((report) => (
            <div
              key={report.id}
              className="group flex gap-4 rounded-xl bg-white border-l-4 border-l-primary hover:shadow-sm transition-all p-3 sm:p-4"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#101826] text-white shrink-0">
                <Layers size={16} />
              </div>

              <div className='flex justify-between w-full'>
                <div className="flex-1 min-w-0">
                  <p className="font-satoshi italic text-[15px] text-slate-700 leading-relaxed">
                    &ldquo;{report.note}&rdquo;
                  </p>

                  <div className="flex flex-wrap items-center gap-5 mt-3">
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-600">
                      <PaperIcon size={18} className="text-primary" />
                      <span className="font-medium text-slate-800">{report.paper_count.toLocaleString('uz-UZ')}</span> dona qog'oz
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-600">
                      <PaintBucket size={18} className="text-primary" />
                      <span className="font-medium text-slate-800">{report.color_count}</span> dona rang
                    </span>
                  </div>

                  <p className="text-[12px] text-slate-500 mt-3 font-hanken">{formatDate(report.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5">
                <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all cursor-pointer" title="Tahrirlash">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer" title="O'chirish">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}


export default ResourceReportTab