'use client'

import api from "@/api/axios";
import { AtSign, Edit2, Loader2, Phone, User, X } from "lucide-react"
import { useEffect, useState } from "react"

const EditProfileModal = ({ formData, onClose, setFormData, userId }) => {
    const [editFormData, setEditFormData] = useState({
        name: "",
        username: "",
        phone: "",
        role: "",
        created_at: "",
        user_id: "",
    })

    const payload = {
        name: editFormData.name.trim(),
        username: editFormData.username.trim(),
        phone: editFormData.phone.trim(),
        role: editFormData.role,
        created_at: editFormData.created_at,
        user_id: editFormData.user_id,
    }

    useEffect(() => {
        setEditFormData(formData)
    }, [formData])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/users/${userId}/`, payload);
            setFormData(response.data);
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6 text-gray-800 font-geist animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2.5">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                            <Edit2 className="w-5 h-5" />
                        </div>
                        Profilni tahrirlash
                    </h2>
                    <button
                        type="button"
                        className="text-gray-400 cursor-pointer hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Ism Familya
                        </label>
                        <div className="relative">
                            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                className="w-full pl-10 pr-3.5 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="username" className="text-sm font-medium text-gray-700">
                            Foydalanuvchi nomi
                        </label>
                        <div className="relative">
                            <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={editFormData.username}
                                onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                                className="w-full pl-10 pr-3.5 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                            Telefon raqam
                        </label>
                        <div className="relative">
                            <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                maxLength={13}
                                value={editFormData.phone}
                                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                className="w-full pl-10 pr-3.5 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-3 cursor-pointer rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-3 cursor-pointer rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Saqlash
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProfileModal