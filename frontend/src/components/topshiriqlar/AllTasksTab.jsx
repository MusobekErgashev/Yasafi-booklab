'use client'

import api from '@/api/axios'
import { UserPlus, CalendarDays, Flag, PlayCircle, CheckCircle2, Circle, Rocket, Plus, Flame, Edit3, Edit2, Trash, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AddTaskModal from './AddTaskModal'
import WarningModal from '../WarningModal'

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

const AllTasksTab = ({ dateFilter = "all", searchQuery = "" }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editingInput, setEditingInput] = useState("")
  const [openWaringModal, setOpenWaringModal] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState({ total: 0, total_pages: 1, page: 1, limit: 10, tasks: [] })

  useEffect(() => {
    setPage(1)
  }, [dateFilter, searchQuery])

  async function fetchTasks() {
    setLoading(true)
    try {
      const params = {
        status: "all",
        page,
        limit: 10
      }
      if (dateFilter && dateFilter !== "all") {
        params.date = dateFilter
      }
      if (searchQuery && searchQuery.trim() !== "") {
        params.q = searchQuery.trim()
      }
      const response = await api.get('tasks', { params })
      setTasks(response.data)
    } catch (error) {
      setTasks({ total: 0, total_pages: 1, page: 1, limit: 10, tasks: [] })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [page, dateFilter, searchQuery])

  useEffect(() => {
    async function fetchMe() {
      try {
        const response = await api.get('users/me')
        setCurrentUser(response.data)
      } catch (error) { }
    }
    fetchMe()
  }, [])

  async function changeStatus(id, status) {
    const targetTask = tasks?.tasks?.find(t => t.id === id)
    if (targetTask && currentUser?.id && Number(targetTask.user_id) !== Number(currentUser?.id)) {
      toast.error("Topshiriq statusini faqat biriktirilgan xodim o'zgartira oladi")
      return
    }

    setTasks(prev => {
      if (!prev?.tasks) return prev
      return {
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === id ? { ...task, status, state: status } : task
        )
      }
    })

    try {
      await api.patch(`tasks/status/${id}`, { status })
      toast.success("Topshiriq statusi o'zgartirildi")
      fetchTasks()
    } catch (error) {
      toast.error(error.response?.data?.message || "Statusni o'zgartirishda xatolik yuz berdi")
      console.log(error)
      fetchTasks()
    }
  }

  const handleDeleteTask = async () => {
    try {
      const response = await api.delete(`tasks/${deletingTaskId}`)
      if (response.status === 200) {
        toast.success("Topshiriq muvaffaqiyatli o'chirildi")
        setOpenWaringModal(false)
        setDeletingTaskId(null)
        fetchTasks()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi")
      setOpenWaringModal(false)
      setDeletingTaskId(null)
    }
  }

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingTaskId(null);
    setEditingInput(null);
    setOpenAddModal(true);
  }

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
          <button onClick={handleOpenAddModal} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-[14px] font-medium text-white bg-[#0f172a] rounded-lg hover:bg-[#1e293b] transition-all cursor-pointer shadow-sm">
            <Plus className="w-4 h-4" /> Yangi topshiriq
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-100 bg-white py-16 text-center text-slate-400 font-medium">
          Yuklanmoqda...
        </div>
      ) : !tasks?.tasks || tasks.tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 py-16 text-center">
          <p className="text-slate-500 text-sm">Topshiriqlar topilmadi.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.tasks.map((task, index) => {
            const currentStatus = task.status || task.state || 'not_completed'
            const cfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.not_completed
            const canEditStatus = currentUser?.id && Number(task.user_id) === Number(currentUser?.id)
            return (
              <div key={task.id} className="group relative bg-white rounded-2xl border border-slate-100 p-5 flex flex-col shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:border-slate-200 transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#0f172a] text-white text-[13px] font-semibold shrink-0">
                      {String((page - 1) * 10 + index + 1).padStart(2, '0')}
                    </div>
                    <h1 className="text-[16px] font-semibold font-satoshi text-slate-800 truncate">
                      {task.message}
                    </h1>
                  </div>

                  <div className='flex gap-2'>
                    <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium ${cfg.bg} ${cfg.text} ring-1 ${cfg.ring} shrink-0`}>
                      <Flame className="w-3.5 h-3.5" />
                      {cfg.label}
                    </div>

                    {
                      currentUser?.is_admin == true && (
                        <div className="flex gap-1 items-center">
                          <Edit2 onClick={() => { setEditingTaskId(task.id); setIsEditing(true); setOpenAddModal(true); setEditingInput({message: task.message, user_id: task.user_id, deadline: task.deadline}) }} size={24} className='text-blue-500 p-1 shrink-0 cursor-pointer hover:bg-blue-500/10 rounded-lg transition-colors' />
                          <Trash2 onClick={() => { setDeletingTaskId(task.id); setOpenWaringModal(true) }} size={24} className='text-red-500 p-1 shrink-0 cursor-pointer hover:bg-red-500/10 rounded-lg transition-colors' />
                        </div>
                      )
                    }
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-4 mt-3 gap-y-1 pl-12">
                  <div className='flex gap-x-4 flex-wrap'>
                    {(task.first_name || task.last_name) && (
                      <MetaItem icon={UserPlus} label="Biriktirilgan xodim" value={`${task.first_name || ''} ${task.last_name || ''}`} />
                    )}
                    <MetaItem icon={CalendarDays} label="Berilgan sana" value={formatDate(task.created_at)} />
                    <MetaItem icon={Flag} label="Deadline" value={formatDate(task.deadline)} />
                  </div>
                  <div className='flex gap-x-4 flex-wrap'>
                    {
                      task.started_at && (
                        <MetaItem icon={Rocket} label="Boshlangan sana" value={formatDate(task.started_at)} />
                      )
                    }
                    {
                      task.finished_at && (
                        <MetaItem icon={CheckCircle2} label="Bajarilgan sana" value={formatDate(task.finished_at)} />
                      )
                    }
                  </div>
                </div>

                <div className="flex items-center gap-4 pl-12 mt-2">
                  <div className="flex-1 flex items-center gap-3">
                    <div className="relative w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cfg.bar} transition-all duration-500`}
                        style={{ width: `${task.status === "not_completed" ? 0 : task.status === "completing" ? 50 : task.status === "completed" ? 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-[12px] font-semibold text-slate-500 w-9 text-right shrink-0">
                      {task.status === "not_completed" ? 0 : task.status === "completing" ? 50 : task.status === "completed" ? 100 : 0}%
                    </span>
                  </div>

                  <div className="relative shrink-0">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${cfg.dot}`} />
                    <select
                      value={currentStatus}
                      disabled={!canEditStatus}
                      onChange={(e) => changeStatus(task.id, e.target.value)}
                      className={`border-0 outline-0 rounded-lg pl-7 pr-8 py-1.5 text-[13px] font-medium ${cfg.bg} ${cfg.text} ring-1 ${cfg.ring} focus:ring-2 focus:ring-offset-1 transition-all ${canEditStatus ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
                        }`}
                      title={canEditStatus ? "" : "Topshiriq statusini faqat biriktirilgan xodim o'zgartira oladi"}
                    >
                      <option value="not_completed">Bajarilmagan</option>
                      <option value="completing">Bajarilmoqda</option>
                      <option value="completed">Bajarildi</option>
                    </select>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Sodda Pagination */}
      <div className="flex items-center justify-between px-6 py-3.5 border border-slate-100 rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <span className="text-xs font-medium text-slate-400">
          Jami: <span className="font-bold text-slate-700">{tasks.total || 0}</span> ta
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Oldingi sahifa"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-[13px] font-semibold text-slate-600 px-2 select-none">
            {page} / {tasks.total_pages || 1}
          </span>

          <button
            type="button"
            disabled={page >= (tasks.total_pages || 1) || loading}
            onClick={() => setPage(prev => Math.min(tasks.total_pages || 1, prev + 1))}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Keyingi sahifa"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {
        openAddModal && (
          <AddTaskModal
            onClose={() => setOpenAddModal(false)}
            isEditing={isEditing}
            editingInput={editingInput}
            editingReportId={editingTaskId}
            onSubmit={fetchTasks}
          />
        )
      }

      {
        openWaringModal && (
          <WarningModal
            title="Topshiriqni o'chirish"
            text="Topshiriqni o'chirishga ishonchingiz komilmi?"
            message="Ushbu amalni qaytarib bo'lmaydi"
            type='warning'
            onConfirm={handleDeleteTask}
            onCancel={() => setOpenWaringModal(false)}
          />
        )
      }
    </div>
  )
}

export default AllTasksTab