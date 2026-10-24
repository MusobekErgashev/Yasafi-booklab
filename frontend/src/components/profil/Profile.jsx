'use client'

import React, { useEffect, useState } from 'react'
import {
  User,
  Phone,
  KeyRound,
  Bell,
  Edit2,
  Palette,
  ShoppingBag,
  FileText,
  Monitor,
  Smartphone,
  Tablet,
  LogOut,
  Globe,
  CircleX,
  VectorSquare,
  CalendarFold,
  Loader2
} from 'lucide-react'

import toast from 'react-hot-toast';
import api from '@/api/axios';
import EditProfileModal from './EditProfileModal';
import WarningModal from '../WarningModal';

const Profile = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openPasswordChangedModal, setOpenPasswordChangedModal] = useState(false)

  const [hint, setHint] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    login: "",
    phone: "",
    role: "",
  })

  const [sessions, setSessions] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [terminatingId, setTerminatingId] = useState(null)
  const [terminatingOthers, setTerminatingOthers] = useState(false)

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true)
      const response = await api.get('/auth/sessions')
      setSessions(response.data?.sessions || [])
    } catch (error) {
      console.error('Failed to load sessions', error)
    } finally {
      setLoadingSessions(false)
    }
  }

  const handleTerminateSession = async (sessionId) => {
    try {
      setTerminatingId(sessionId)
      const response = await api.delete(`/auth/sessions/${sessionId}`)
      toast.success(response.data?.message || "Seans muvaffaqiyatli yakunlandi!")
      if (response.data?.isCurrent) {
        window.location.href = '/login'
        return
      }
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    } catch (error) {
      toast.error(error.response?.data?.message || "Seansni yakunlashda xatolik yuz berdi!")
    } finally {
      setTerminatingId(null)
    }
  }

  const handleTerminateOthers = async () => {
    try {
      setTerminatingOthers(true)
      const response = await api.delete('/auth/sessions/others')
      toast.success(response.data?.message || "Boshqa barcha qurilmalardan chiqildi!")
      setSessions((prev) => prev.filter((s) => s.is_current))
    } catch (error) {
      toast.error(error.response?.data?.message || "Xatolik yuz berdi!")
    } finally {
      setTerminatingOthers(false)
    }
  }

  const formatLastActive = (dateString) => {
    if (!dateString) return "Yaqinda"
    const date = new Date(dateString)
    const now = new Date()
    const diffSec = Math.floor((now - date) / 1000)

    if (diffSec < 60) return "Hozirda faol"
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin} daqiqa oldin`
    const diffHours = Math.floor(diffMin / 60)
    if (diffHours < 24) return `${diffHours} soat oldin`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return "Kecha"
    if (diffDays < 7) return `${diffDays} kun oldin`

    return date.toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  const getDeviceIcon = (deviceType) => {
    if (deviceType === 'mobile') return <Smartphone className="w-4 h-4" />
    if (deviceType === 'tablet') return <Tablet className="w-4 h-4" />
    return <Monitor className="w-4 h-4" />
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/me`)
        setFormData(response.data)
      } catch (err) {
        console.error('Failed to load user', err)
      }
    }
    fetchUser()
    fetchSessions()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };

    const formatted = date.toLocaleString("uz-UZ", options);

    return formatted.replace(",", "");
  };

  const [notifications, setNotifications] = useState({
    orders: true,
    reports: true,
    email: false,
  })

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function ChangePassword(e) {
    e.preventDefault()
    const trimmedOldPassword = oldPassword.trim()
    const trimmedNewPassword = newPassword.trim()

    const payload = {
      oldPassword: trimmedOldPassword,
      newPassword: trimmedNewPassword,
    }

    api.post(`/auth/change-password`, payload)
      .then((res) => {
        setHint("Parol muvaffaqiyatli o'zgartirildi!")
        setOldPassword('')
        setNewPassword('')

        setOpenPasswordChangedModal(true)

        setTimeout(() => {
          setHint('')
        }, 3000)
      })
      .catch((err) => {
        const resData = err.response?.data
        let errorMsg = "Parolni o'zgartirishda xatolik yuz berdi!"

        if (typeof resData === 'string') {
          errorMsg = resData
        } else if (resData?.message) {
          errorMsg = resData.message
        } else if (resData?.error) {
          errorMsg = resData.error
        }

        setHint(errorMsg)
        setTimeout(() => {
          setHint('')
        }, 3000)
      })
  }

  return (
    <div className="px-6 py-2 max-w-6xl mx-auto space-y-6 text-gray-800 font-geist">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl font-bold shadow-md border-2 border-slate-100">
              {formData.first_name && formData.last_name ? formData.first_name.charAt(0).toUpperCase() + formData.last_name.charAt(0).toUpperCase() : ''}
            </div>
          </div>

          <div>
            <h1 className="text-2xl capitalize font-bold text-gray-900">
              {formData.first_name} {formData.last_name}
            </h1>
            <p className="text-sm text-gray-500 font-medium">{formData.role}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CalendarFold className="w-3.5 h-3.5" /> {formatDate(formData.created_at)}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpenEditModal(true)}
          className="flex items-center cursor-pointer gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <Edit2 className="w-4 h-4" />
          Tahrirlash
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-700" />
              Shaxsiy ma'lumotlar
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Tizimdagi profilingiz ma'lumotlarini yangilang</p>
          </div>

          <div className="space-y-5">
            <div>
              <span className="block text-xs font-semibold text-gray-600 mb-1.5">Ism Familiya</span>
              <div className="w-full px-3.5 py-2.5 rounded-lg capitalize border border-gray-200 text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all">
                {formData.first_name} {formData.last_name}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-semibold text-gray-600 mb-1.5">Login</span>
                <div
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all"
                >
                  {formData.login}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-gray-600 mb-1.5">Telefon raqam</span>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <div
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all"
                  >
                    {formData.phone}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-600 mb-1.5">Lavozim (Rol)</span>
              <div className="w-full px-3.5 py-2.5 rounded-lg border border-gray-100 bg-gray-50 text-gray-500 text-sm cursor-not-allowed font-medium capitalize">
                {formData.is_admin ? 'Admin' : 'Ishchi'}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Lavozimni o'zgartirish uchun tizim administratoriga murojaat qiling.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-slate-700" />
                Parolni o'zgartirish
              </h2>
            </div>

            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">Amaldagi parol</label>
                <input
                  type="password"
                  name="oldPassword"
                  maxLength={10}
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-[16px] focus:outline-none focus:border-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">Yangi parol</label>
                <input
                  type="password"
                  name="newPassword"
                  maxLength={10}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-[16px] focus:outline-none focus:border-slate-800 transition-all"
                />
              </div>

              <div className='flex flex-col items-end gap-3'>
                <button
                  type="button"
                  onClick={ChangePassword}
                  disabled={!oldPassword.trim() || !newPassword.trim()}
                  className={`w-full py-3 whitespace-nowrap px-4 border ${oldPassword.trim() && newPassword.trim() ? "bg-slate-800 text-white hover:bg-slate-700 cursor-pointer" : "hover:bg-gray-50 cursor-not-allowed"} border-gray-200 text-gray-700 font-medium text-xs rounded-lg transition-all`}
                >
                  Parolni yangilash
                </button>
              </div>
            </div>

            <p className={`text-[12px] w-full font-medium ${hint ? "text-emerald-500" : "text-slate-900"}`}>{hint}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-700" />
                Faol qurilmalar
              </h2>
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                {sessions.length} ta faol
              </span>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto py-2 relative mt-1">
              {loadingSessions ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
                  <p className="text-xs">Qurilmalar yuklanmoqda...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  Faol seanslar mavjud emas
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-start justify-between p-3 rounded-xl border transition-all ${
                      session.is_current
                        ? 'border-emerald-100 bg-emerald-50/30'
                        : 'border-gray-100 bg-gray-50/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg bg-white border mt-0.5 ${
                          session.is_current
                            ? 'border-emerald-200 text-emerald-600'
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        {getDeviceIcon(session.device_type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className={`text-xs font-bold ${session.is_current ? 'text-gray-900' : 'text-gray-800'}`}>
                            {session.browser || 'Brauzer'} — {session.os || 'Tizim'}
                          </p>
                          {session.is_current && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                        </div>
                        <p className={`text-[11px] font-medium mt-0.5 ${session.is_current ? 'text-emerald-700' : 'text-gray-500'}`}>
                          {session.is_current
                            ? `Ushbu qurilma • ${session.location || 'Toshkent'}`
                            : `Oxirgi faollik: ${formatLastActive(session.last_active)} • ${session.location || 'Toshkent'}`}
                        </p>
                      </div>
                    </div>

                    {!session.is_current && (
                      <button
                        type="button"
                        onClick={() => handleTerminateSession(session.id)}
                        disabled={terminatingId === session.id}
                        title="Ushbu qurilmadan chiqish"
                        className="p-2 cursor-pointer hover:bg-rose-50 transition-colors rounded-full text-rose-600 disabled:opacity-50"
                      >
                        {terminatingId === session.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                        ) : (
                          <CircleX className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t pt-4 border-gray-100 mt-3">
            <button
              type="button"
              onClick={handleTerminateOthers}
              disabled={terminatingOthers || sessions.filter((s) => !s.is_current).length === 0}
              className="w-full py-2 cursor-pointer text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 disabled:hover:bg-transparent disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-rose-100"
            >
              {terminatingOthers ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              Boshqa barcha qurilmalardan chiqish
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {openEditModal && (
        <EditProfileModal
          isOpen={openEditModal}
          onClose={() => setOpenEditModal(false)}
          formData={formData}
          setFormData={setFormData}
          userId={formData.id}
        />
      )}

      {/* Password changed Modal */}
      {openPasswordChangedModal && (
        <WarningModal
          type='info'
          title="Parol o'zgartirildi"
          message="Parolingiz muvaffaqiyatli o'zgartirildi"
          onConfirm={() => setOpenPasswordChangedModal(false)}
          confirmText='Yaxshi'
        />
      )}
    </div>
  )
}

export default Profile