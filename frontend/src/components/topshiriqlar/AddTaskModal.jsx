import api from '@/api/axios'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const AddTaskModal = ({ onClose, onSubmit, isEditing, editingReportId, editingInput }) => {
    const [loading, setLoading] = useState(false)
    const [taskText, setTaskText] = useState("")
    const [taskDeadline, setTaskDeadline] = useState("")
    const [hint, setHint] = useState("")
    const inputRef = useRef(null)
    const [employees, setEmployees] = useState([])
    const [selectedEmployee, setSelectedEmployee] = useState(null)

    async function getEmployees() {
        try {
            const res = await api.get(`users?q=${""}`)
            setEmployees(res.data.employees)
        } catch (error) {}
    }

    useEffect(() => {
        getEmployees()
        if (isEditing && editingInput) {
            setTaskText(editingInput.message || "")
            if (editingInput.deadline) {
                const dateObj = new Date(editingInput.deadline)
                const formattedDate = !isNaN(dateObj) ? dateObj.toISOString().split('T')[0] : String(editingInput.deadline).split('T')[0]
                setTaskDeadline(formattedDate)
            } else {
                setTaskDeadline("")
            }
            setSelectedEmployee(editingInput.user_id || null)
        } else {
            setTaskText("")
            setTaskDeadline("")
            setSelectedEmployee(null)
        }
        inputRef.current?.focus()
    }, [isEditing, editingInput])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setHint("")

        if (!taskText || !taskText.trim()) {
            setHint("Topshiriq matnini kiriting")
            setLoading(false)
            return
        }
        if (!taskDeadline) {
            setHint("Muddatni kiriting")
            setLoading(false)
            return
        }
        if (!selectedEmployee) {
            setHint("Xodimlardan birini tanlang")
            setLoading(false)
            return
        }

        try {
            if (isEditing) {
                const response = await api.put(`tasks/${editingReportId}`, {
                    message: taskText.trim(),
                    deadline: taskDeadline,
                    user_id: selectedEmployee
                })
                if (response.status === 200) {
                    toast.success("Topshiriq muvaffaqiyatli tahrirlandi")
                    setTaskText("")
                    setTaskDeadline("")
                    setSelectedEmployee(null)
                    onClose()
                    onSubmit()
                }
            } else {
                const response = await api.post("tasks", {
                    message: taskText.trim(),
                    user_id: selectedEmployee,
                    deadline: taskDeadline
                })
                if (response.status === 201) {
                    toast.success("Topshiriq muvaffaqiyatli qo'shildi")
                    setTaskText("")
                    setTaskDeadline("")
                    setSelectedEmployee(null)
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
                    <h2 className="text-lg font-bold text-[#0F172A]">{isEditing ? "Topshiriqni tahrirlash" : "Topshiriq qo'shish"}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                            topshiriq matni
                        </label>
                        <input
                            id="name"
                            name="name"
                            type='text'
                            value={taskText}
                            placeholder='Topshiriq matnini kiriting'
                            ref={inputRef}
                            onChange={(e) => setTaskText(e.target.value)}
                            className="w-full rounded-lg resize-none border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:ring-1 focus:ring-[#0F172A] transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="deadline" className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                            muddat
                        </label>
                        <input
                            id="deadline"
                            name="deadline"
                            type='date'
                            value={taskDeadline}
                            onChange={(e) => setTaskDeadline(e.target.value)}
                            className="w-full rounded-lg resize-none border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:ring-1 focus:ring-[#0F172A] transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                            xodim biriktirish
                        </label>

                        <div className="space-y-2 space-x-2">
                            {employees?.map((employee) => (
                                <span key={employee.id} onClick={() => setSelectedEmployee(employee.id)} className={`${selectedEmployee === employee.id ? "bg-[#0F172A] text-white hover:bg-[#0F172A]/70" : "hover:bg-gray-50"} text-[13px] capitalize px-3 py-1 border border-gray-300 transition-colors rounded-md cursor-pointer`}>{employee.first_name + " " + employee.last_name}</span>
                            ))}
                        </div>
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