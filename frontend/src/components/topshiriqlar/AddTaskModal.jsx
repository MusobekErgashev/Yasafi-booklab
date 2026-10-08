import api from '@/api/axios'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const AddTaskModal = ({ onClose, onSubmit, isEditing, editingReportId, editingInput }) => {
    const [loading, setLoading] = useState(false)
    const [reportText, setReportText] = useState("")
    const [hint, setHint] = useState("")
    const inputRef = useRef(null)

    useEffect(() => {
        setReportText(editingInput)
        inputRef.current?.focus()
    }, [editingInput])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setHint("")
        try {
            if (isEditing) {
                const response = await api.patch(`resource-reports/${editingReportId}`, { message: reportText.trim() })
                if (response.status === 200) {
                    toast.success("Hisobot muvaffaqiyatli tahrirlandi")
                    setReportText("")
                    onClose()
                    onSubmit()
                }
            } else {
                const response = await api.post("resource-reports", { message: reportText.trim() })
                if (response.status === 201) {
                    toast.success("Hisobot muvaffaqiyatli qo'shildi")
                    setReportText("")
                    onClose()
                    onSubmit()
                }
            }
        } catch (error) {
            setHint(error.response?.data?.message || "Xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-bold text-[#0F172A]">{`Hisobot qo'shish`}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4">
                    <div>
                        <label htmlFor="name" className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                            Hisobot matni
                        </label>
                        <textarea
                            id="name"
                            name="name"
                            rows={4}
                            value={reportText}
                            ref={inputRef}
                            onChange={(e) => setReportText(e.target.value)}
                            className="w-full rounded-lg resize-none border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:ring-1 focus:ring-[#0F172A] transition-all"
                        />
                    </div>

                    <p className="text-[13px] text-red-500">{hint}</p>

                    <div className="flex items-center justify-end mt-4 gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-lg cursor-pointer border border-gray-200 px-4 py-2 text-[15px] font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg cursor-pointer bg-[#0F172A] px-5 py-2 text-[15px] font-medium text-white hover:bg-[#1E293B] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? "Saqlanmoqda..." : "Saqlash"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddTaskModal