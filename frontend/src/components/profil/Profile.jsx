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
  LogOut,
  Globe,
  CircleX,
  VectorSquare,
  CalendarFold
} from 'lucide-react'

import api from '@/api/axios';
import Cookies from 'js-cookie';
import EditProfileModal from './EditProfileModal';
import WarningModal from '../WarningModal';

const Profile = () => {
  const userId = Cookies.get("booklab_userId");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openPasswordChangedModal, setOpenPasswordChangedModal] = useState(false)

  const hintMessages = [
    "Eski parol noto'g'ri!",
    "Yangi parol tasdiqlash bilan bir xil emas!",
    "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak!",
    "Yangi parol 10 ta belgidan oshmasligi kerak!",
    "Yangi parolda kamida 1 ta raqam bo'lishi kerak!",
    "Parol muvaffaqiyatli o'zgartirildi!",
    "Eski parolni kiriting!",
    "Parolni almashtirish uchun barcha maydonlarni to'ldiring!"
  ]

  const [hint, setHint] = useState(hintMessages[7]);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    role: "",
    created_at: "",
    user_id: "",
  })

  useEffect(() => {
    const fetchUser = async () => {
      const response = await api.get(`/users/${userId}`)
      setFormData(response.data)
    }
    fetchUser()
  }, [userId])

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
    const trimmedConfirmPassword = confirmPassword.trim()

    if (!trimmedOldPassword || !trimmedNewPassword || !trimmedConfirmPassword) {
      setHint(hintMessages[6])
      setTimeout(() => {
        setHint(hintMessages[7])
      }, 3000)
      return
    }
    if (trimmedNewPassword.length < 6 || trimmedConfirmPassword.length < 6) {
      setHint(hintMessages[2])
      setTimeout(() => {
        setHint(hintMessages[7])
      }, 3000)
      return
    }
    if (trimmedNewPassword.length > 10 || trimmedConfirmPassword.length > 10) {
      setHint(hintMessages[3])
      setTimeout(() => {
        setHint(hintMessages[7])
      }, 3000)
      return
    }
    if (trimmedNewPassword !== trimmedConfirmPassword) {
      setHint(hintMessages[1])
      setTimeout(() => {
        setHint(hintMessages[7])
      }, 3000)
      return
    }

    const payload = {
      old_password: trimmedOldPassword,
      new_password: trimmedNewPassword,
      confirm_new_password: trimmedConfirmPassword
    }

    api.post(`/auth/change-password/`, payload)
      .then((res) => {
        setHint(hintMessages[5])
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')

        setOpenPasswordChangedModal(true)

        setTimeout(() => {
          setHint(hintMessages[7])
        }, 3000)
      })
      .catch((err) => {
        const resData = err.response?.data
        let errorMsg = hintMessages[0]

        if (typeof resData === 'string') {
          errorMsg = resData
        } else if (resData) {
          if (resData.error) {
            errorMsg = resData.error
          } else if (resData.detail) {
            errorMsg = resData.detail
          } else if (resData.non_field_errors) {
            errorMsg = Array.isArray(resData.non_field_errors) ? resData.non_field_errors[0] : resData.non_field_errors
          } else {
            const firstKey = Object.keys(resData)[0]
            if (firstKey && resData[firstKey]) {
              const val = resData[firstKey]
              errorMsg = Array.isArray(val) ? val[0] : val
            }
          }
        }

        setHint(errorMsg)
        setTimeout(() => {
          setHint(hintMessages[7])
        }, 3000)
      })
  }

  return (
    <div className="px-6 py-2 max-w-6xl mx-auto space-y-6 text-gray-800 font-geist">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl font-bold shadow-md border-2 border-slate-100">
              {formData.name ? formData.name.split(' ')[0].charAt(0).toUpperCase() + formData.name.split(' ')[1].charAt(0).toUpperCase() : ''}
            </div>
            <button
              type="button"
              className="absolute cursor-pointer bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 text-gray-600 hover:text-slate-900 transition-colors"
              title="Rasmni o'zgartirish"
            >
              <Palette className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {formData.name}
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
              <div className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all">
                {formData.name}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-semibold text-gray-600 mb-1.5">Foydalanuvchi nomi</span>
                <div
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all"
                >
                  {formData.username}
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
              <div className="w-full px-3.5 py-2.5 rounded-lg border border-gray-100 bg-gray-50 text-gray-500 text-sm cursor-not-allowed font-medium">
                {formData.role}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Lavozimni o'zgartirish uchun tizim administratoriga murojaat qiling.</p>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-4.5 h-4.5 text-slate-700" />
                  Bildirishnomalar sozlamalari
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Tizim bildirishnomalarini o'zingizga moslab sozlang</p>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white shadow-xs border border-gray-100 text-slate-700">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Yangi buyurtmalar</p>
                      <p className="text-[11px] text-gray-400">Yangi buyurtmalar kelganda ovozli va vizual ogohlantirish</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotification('orders')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifications.orders ? 'bg-slate-900' : 'bg-gray-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${notifications.orders ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white shadow-xs border border-gray-100 text-slate-700">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Hisobotlar eslatmasi</p>
                      <p className="text-[11px] text-gray-400">Kunlik va haftalik sotuv hisobotlari tayyor bo'lganda bildirish</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotification('reports')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifications.reports ? 'bg-slate-900' : 'bg-gray-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${notifications.reports ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white shadow-xs border border-gray-100 text-slate-700">
                      <VectorSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{`Resurslar qoldig'i`}</p>
                      <p className="text-[11px] text-gray-400">{`Resurslar kam qolganligida bildirishnoma olasiz`}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleNotification('email')}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${notifications.email ? 'bg-slate-900' : 'bg-gray-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${notifications.email ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-slate-700" />
                Parolni o'zgartirish
              </h2>
            </div>

            <div className="space-y-3">
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

              <div>
                <label className="block text-[12px] font-semibold text-gray-600 mb-1">Yangi parolni tasdiqlang</label>
                <input
                  type="password"
                  name="confirmPassword"
                  maxLength={10}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-gray-200 text-[16px] focus:outline-none focus:border-slate-800 transition-all"
                />
              </div>

              <div className='space-y-3 h-21.5 flex flex-col justify-end'>
                <p className={`text-[12px] max-w-57.5 mx-auto font-medium text-center ${hint === hintMessages[5] ? " text-emerald-500" : (hint === hintMessages[7] ? "text-slate-900" : "text-red-500")}`}>{hint}</p>

                <button
                  type="button"
                  onClick={ChangePassword}
                  disabled={!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()}
                  className={`w-full py-2.5 px-4 border ${oldPassword.trim() && newPassword.trim() && confirmPassword.trim() ? "bg-slate-800 text-white hover:bg-slate-700 cursor-pointer" : "hover:bg-gray-50 cursor-not-allowed"} border-gray-200 text-gray-700 font-medium text-xs rounded-lg transition-all`}
                >
                  Parolni yangilash
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-700" />
                Faol qurilmalar
              </h2>
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                2 ta faol
              </span>
            </div>

            <div className="space-y-3 h-31 overflow-y-auto relative">
              <div className="flex items-start justify-between p-3 rounded-xl border border-emerald-100 bg-emerald-50/30">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-emerald-200 text-emerald-600 mt-0.5">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-gray-900">Chrome — Linux (Zorin)</p>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Ushbu qurilma • Toshkent</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 mt-0.5">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Safari — iPhone 13</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Oxirgi faollik: 2 soat oldin</p>
                  </div>
                </div>

                <button className='p-2 cursor-pointer hover:bg-rose-50 transition-colors rounded-full'>
                  <CircleX className="w-4 h-4 text-rose-700" />
                </button>
              </div>
            </div>


            <div className='border-t pt-4 border-gray-100'>
              <button
                type="button"
                className="w-full py-2 cursor-pointer text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-rose-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                Boshqa barcha qurilmalardan chiqish
              </button>
            </div>
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
          userId={userId}
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