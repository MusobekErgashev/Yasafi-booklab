import api from '@/api/axios'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

const AddResourceReportModal = ({ onClose, onSubmit, isEditing, editingReportId, editingInput }) => {
    const [loading, setLoading] = useState(false)
    const [reportText, setReportText] = useState("")
    const [paperInput, setPaperInput] = useState(0)
    const [colorInput, setColorInput] = useState(0)
    const [hint, setHint] = useState("")
    const inputRef = useRef(null)

    useEffect(() => {
        if(editingInput) {
            setReportText(editingInput.message)
            setPaperInput(editingInput.paper_count)
            setColorInput(editingInput.color_count)
            inputRef.current?.focus()
        }
    }, [editingInput])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setHint("")
        try {
            if (isEditing) {
                const response = await api.put(`resource-reports/${editingReportId}`, { message: reportText.trim(), paper_count: paperInput, color_count: colorInput })
                if (response.status === 200) {
                    toast.success("Hisobot muvaffaqiyatli tahrirlandi")
                    setReportText("")
                    setPaperInput(0)
                    setColorInput(0)
                    onClose()
                    onSubmit()
                }
            } else {
                const response = await api.post("resource-reports", { message: reportText.trim(), paper_count: paperInput, color_count: colorInput })
                if (response.status === 201) {
                    toast.success("Hisobot muvaffaqiyatli qo'shildi")
                    setReportText("")
                    setPaperInput(0)
                    setColorInput(0)
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
                            rows={3}
                            value={reportText}
                            ref={inputRef}
                            onChange={(e) => setReportText(e.target.value)}
                            className="w-full rounded-lg resize-none border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:ring-1 focus:ring-[#0F172A] transition-all"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div>
                            <label htmlFor="color" className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                                {`qog'oz`}
                            </label>
                            <div className="flex gap-2">
                                <button type='button' onClick={() => setPaperInput(prev => prev > 0 && prev - 1)} className='border cursor-pointer border-gray-200 px-4 rounded-lg'>-</button>
                                <input
                                    id="color"
                                    name="color"
                                    type='number'
                                    min={0}
                                    value={paperInput}
                                    onChange={(e) => setPaperInput(e.target.value)}
                                    className="w-full rounded-lg resize-none border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:ring-1 focus:ring-[#0F172A] transition-all"
                                />
                                <button type='button' onClick={() => setPaperInput(prev => prev + 1)} className='border cursor-pointer border-gray-200 px-4 rounded-lg'>+</button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="color" className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                                {`rang`}
                            </label>
                            <div className="flex gap-2">
                                <button type='button' onClick={() => setColorInput(prev => prev > 0 && prev - 1)} className='border cursor-pointer border-gray-200 px-4 rounded-lg'>-</button>
                                <input
                                    id="color"
                                    name="color"
                                    type='number'
                                    min={0}
                                    value={colorInput}
                                    onChange={(e) => setColorInput(e.target.value)}
                                    className="w-full rounded-lg resize-none border border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-900 outline-none focus:ring-1 focus:ring-[#0F172A] transition-all"
                                />
                                <button type='button' onClick={() => setColorInput(prev => prev + 1)} className='border cursor-pointer border-gray-200 px-4 rounded-lg'>+</button>
                            </div>
                        </div>
                    </div>

                    <p className="text-[13px] text-red-500 my-3">{hint}</p>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
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

export default AddResourceReportModal