'use client'

import api from '@/api/axios'
import { UserPlus, CalendarDays, Flag, PlayCircle, CheckCircle2, Circle, Rocket, Plus, Flame } from 'lucide-react'
import React, { useEffect, useState } from 'react'

// Har bir status uchun rang va ikonka sozlamalari
const STATUS_CONFIG = {
  not_completed: {
    label: 'Bajarilmagan',
    text: 'text-slate-500',
    bg: 'bg-slate-100',
    ring: 'ring-slate-200',
    dot: 'bg-slate-400',
    bar: 'bg-slate-300',
    icon: Circle,
  },
  completing: {
    label: 'Bajarilmoqda',
    text: 'text-amber-600',
    bg: 'bg-amber-50',
    ring: 'ring-amber-200',
    dot: 'bg-amber-500',
    bar: 'bg-gradient-to-r from-amber-400 to-amber-500',
    icon: PlayCircle,
  },
  completed: {
    label: 'Bajarildi',
    text: 'text-emerald-600',
    bg: 'bg-emerald-50',
    ring: 'ring-emerald-200',
    dot: 'bg-emerald-500',
    bar: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
    icon: CheckCircle2,
  },
}

const MetaItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
    <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
    <span className="text-slate-400">{label}:</span>
    <span className="font-medium text-slate-700">{value}</span>
  </div>
)

const AllTasksTab = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const [editingReportId, setEditingReportId] = useState(null)
  const [editingInput, setEditingInput] = useState("")
  const [openWaringModal, setOpenWaringModal] = useState(false);
  const [deletingReportId, setDeletingReportId] = useState(null);
  const [tasks, setTasks] = useState([])

  async function fetchTasks() {
    try {
      const response = await api.get("tasks")

      setTasks(response.data)
    } catch (error) { }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  return (
    <div className='space-y-4'>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div>
          <h3 className="text-[16px] font-bold text-slate-800">Jami topshiriqlar</h3>
          <p className="text-[13px] text-slate-400 mt-0.5">Jami topshiriqlar soni: <span className="font-semibold text-slate-700">{tasks?.total || 0} ta</span></p>
        </div>

        <div className="flex items-center w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-[14px] font-medium text-white bg-[#0f172a] rounded-lg hover:bg-[#1e293b] transition-all cursor-pointer shadow-sm">
            <Plus className="w-4 h-4" /> Yangi topshiriq
          </button>
        </div>
      </div>

      {!tasks?.tasks?.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 py-16 text-center">
          <p className="text-slate-500 text-sm">Topshiriqlar topilmadi.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks?.tasks?.map((task) => {
            const cfg = STATUS_CONFIG[task.state]
            return (
              <div key={task.id} className="group relative bg-white rounded-2xl border border-slate-100 p-5 flex flex-col shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:border-slate-200 transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#0f172a] text-white text-[13px] font-semibold shrink-0">
                      {String(task.id).padStart(2, '0')}
                    </div>
                    <h1 className="text-[16px] font-semibold font-satoshi text-slate-800 truncate">
                      {task.message}
                    </h1>
                  </div>

                  <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium ${cfg.bg} ${cfg.text} ring-1 ${cfg.ring} shrink-0`}>
                    <Flame className="w-3.5 h-3.5" />
                    {cfg.label}
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-6 mt-3 gap-y-2 pl-12">
                  <MetaItem icon={CalendarDays} label="Berilgan sana" value={formatDate(task.created_at)} />
                  <MetaItem icon={Flag} label="Deadline" value={formatDate(task.deadline)} />
                  <MetaItem icon={Rocket} label="Boshlangan sana" value={task.started_at ? formatDate(task.started_at) : "-"} />
                  <MetaItem icon={CheckCircle2} label="Bajarilgan sana" value={task.finished_at ? formatDate(task.finished_at) : "-"} />
                </div>

                <div className="flex items-center gap-4 pl-12 mt-2">
                  <div className="flex-1 flex items-center gap-3">
                    <div className="relative w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cfg.bar} transition-all duration-500`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-semibold text-slate-500 w-9 text-right shrink-0">
                      {task.progress}%
                    </span>
                  </div>

                  <div className="relative shrink-0">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${cfg.dot}`} />
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className={`border-0 outline-0 cursor-pointer rounded-lg pl-7 pr-8 py-1.5 text-[13px] font-medium ${cfg.bg} ${cfg.text} ring-1 ${cfg.ring} focus:ring-2 focus:ring-offset-1 transition-all`}
                    >
                      <option value="bajarilmagan">Bajarilmagan</option>
                      <option value="bajarilmoqda">Bajarilmoqda</option>
                      <option value="bajarildi">Bajarildi</option>
                    </select>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AllTasksTab