import { Download, Edit3, Plus, Trash2, UserPlus } from 'lucide-react'
import React, { useMemo, useState } from 'react'

const MOCK_EMPLOYEES = [
  { id: 1, name: 'Aziz Karimov' },
  { id: 2, name: 'Dilnoza Yusupova' },
  { id: 3, name: 'Bekzod Nazarov' },
  { id: 4, name: 'Madina Tosheva' },
]

const MOCK_REPORTS = [
  {
    id: 1,
    employee_id: 1,
    task_id: 101,
    message:
      'Matnning 1-4 boblarini qayta o\u2019qib chiqdim, imlo xatolarini tuzatdim. Muharrirlik kengashiga taqdim etishga tayyor.',
    finished_at: '2026-07-12T09:40:00',
    point: null,
  },
  {
    id: 2,
    employee_id: 2,
    task_id: 102,
    message:
      'Uchta muqova varianti tayyor bo\u2019ldi: klassik, minimalist va illyustrativ uslublarda. Fayllarni Drive papkasiga joyladim.',
    finished_at: '2026-07-11T17:05:00',
    point: 9,
  },
  {
    id: 3,
    employee_id: 3,
    task_id: 103,
    message:
      '"Chinor kitob do\u2019koni" tarmog\u2019i bilan uchrashuv bo\u2019lib o\u2019tdi, 500 nusxalik birinchi partiya kelishildi.',
    finished_at: '2026-07-11T14:20:00',
    point: 7,
  },
  {
    id: 4,
    employee_id: 4,
    task_id: 104,
    message:
      'Iyul oyi uchun kontent-reja tuzildi, 12 ta post va 4 ta reels g\u2019oyasi bilan birga.',
    finished_at: '2026-07-10T11:15:00',
    point: null,
  },
  {
    id: 5,
    employee_id: 1,
    task_id: 105,
    message:
      'Ombordagi 3-qatordagi kitoblar sanog\u2019ini tekshirdim, 14 ta nomda kamomad aniqlandi, ro\u2019yxatni yubordim.',
    finished_at: '2026-07-09T16:00:00',
    point: 6,
  },
]

const getEmployee = (id) => MOCK_EMPLOYEES.find((e) => e.id === id)

const initials = (name = '') =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

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

const EmployeesReportTab = () => {
  const [reports, setReports] = useState(MOCK_REPORTS)
  const [employeeFilter, setEmployeeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [gradingReport, setGradingReport] = useState(null)

  const filtered = useMemo(() => {
    return reports
      .filter((r) => employeeFilter === 'all' || r.employee_id === Number(employeeFilter))
      .filter((r) => {
        if (!search.trim()) return true
        const q = search.toLowerCase()
        const emp = getEmployee(r.employee_id)?.name.toLowerCase() || ''
        const task = getTask(r.task_id)?.title.toLowerCase() || ''
        return emp.includes(q) || task.includes(q) || r.message.toLowerCase().includes(q)
      })
      .sort((a, b) => new Date(b.finished_at) - new Date(a.finished_at))
  }, [reports, employeeFilter, search])

  const stats = useMemo(() => {
    const total = reports.length
    const graded = reports.filter((r) => r.point !== null)
    const pending = total - graded.length
    const avg = graded.length
      ? (graded.reduce((s, r) => s + r.point, 0) / graded.length).toFixed(1)
      : '—'
    return { total, pending, avg }
  }, [reports])

  const handleSavePoint = (reportId, point) => {
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, point } : r)))
    setGradingReport(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div>
          <h3 className="text-[16px] font-bold text-slate-800">Jami hisobotlar</h3>
          <p className="text-[13px] text-slate-400 mt-0.5">Xodimlar bo'yicha jami hisobotlar soni: <span className="font-semibold text-slate-700">{stats.total} ta</span></p>
        </div>

        <div className="flex items-center w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-[14px] font-medium text-white bg-[#0f172a] rounded-lg hover:bg-[#1e293b] transition-all cursor-pointer shadow-sm">
            <Plus className="w-4 h-4" /> Yangi hisobot
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 py-16 text-center">
          <p className="text-slate-500 text-sm">Ushbu filtr bo'yicha hisobot topilmadi.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((report) => {
            const employee = getEmployee(report.employee_id)

            return (
              <div
                key={report.id}
                className="group flex justify-between gap-4 rounded-xl bg-white hover:shadow-sm transition-all p-3 sm:p-4 border-l-4 border-l-primary"
              >
                <div className='flex gap-4'>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                    style={{ backgroundColor: employee?.avatarColor || '#334155' }}
                  >
                    {initials(employee?.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-slate-900 text-md">{employee?.name}</span>
                    <p className="font-satoshi italic text-[15px] text-slate-700 mt-1 leading-relaxed">
                      &ldquo;{report.message}&rdquo;
                    </p>
                    <p className="text-[12px] text-slate-500 mt-2 font-hanken">{formatDate(report.finished_at)}</p>
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
            )
          })}
        </div>
      )}
    </div>
  )
}

export default EmployeesReportTab