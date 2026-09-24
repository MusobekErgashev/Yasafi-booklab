'use client'

import React, { useEffect, useState, useRef } from 'react'
import BooksTab from './BooksTab'
import { Search, ChevronDown, Check, Filter } from 'lucide-react'
import CategoriesTab from './CategoriesTab'
import api from '@/api/axios'
import toast from 'react-hot-toast'

const CustomSelect = ({ options, value, onChange, placeholder = "Barchasi" }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const selectedOption = options.find((opt) => String(opt.value) === String(value)) || options[0]

    return (
        <div className="relative ml-auto font-geist shrink-0" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-3 min-w-48 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs transition-all cursor-pointer outline-none"
            >
                <div className="flex items-center gap-2 truncate">
                    <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{selectedOption?.label || placeholder}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-40 mt-1.5 w-60 bg-white border border-slate-100 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="max-h-64 overflow-y-auto custom-scrollbar p-1 space-y-0.5">
                        {options.map((option) => {
                            const isSelected = String(option.value) === String(value)
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-medium rounded-lg transition-colors cursor-pointer ${isSelected
                                        ? "bg-primary text-white"
                                        : "text-slate-700 hover:bg-slate-100/80"
                                        }`}
                                >
                                    <span className="truncate">{option.label}</span>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {option.count !== undefined && (
                                            <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                                                }`}>
                                                {option.count}
                                            </span>
                                        )}
                                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

const Books = () => {
    const [activeTab, setActiveTab] = useState("books")
    const [categories, setCategories] = useState([])
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("")

    async function getData() {
        setLoading(true)
        try {
            const [responseCat, responseBook] = await Promise.all([
                api.get('/categories/'),
                api.get('/books/')
            ])
            setCategories(responseCat.data)
            setBooks(responseBook.data)
        } catch (error) {
            toast.error("Ma'lumotlarni olishda xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    async function deleteBook(id) {
        try {
            setLoading(true)
            await api.delete(`/books/${id}/`)
            toast.success("Kitob muvaffaqiyatli o'chirildi")
            await getData()
        } catch (error) {
            toast.error("Kitobni o'chirishda xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    async function deleteCategory(id) {
        try {
            setLoading(true)
            await api.delete('/categories/', { data: { id } })
            toast.success("Kategoriya muvaffaqiyatli o'chirildi")
            await getData()
        } catch (error) {
            toast.error("Kategoriyani o'chirishda xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    const filteredBooks = books.filter((book) => {
        let matchesCategory = true
        if (selectedCategory === "uncategorized") {
            matchesCategory = !book.category_name && (!book.category_id || !categories.some((c) => c.id === book.category_id))
        } else if (selectedCategory !== "") {
            const catObj = categories.find((c) => String(c.id) === String(selectedCategory))
            matchesCategory = (catObj && book.category_name === catObj.name) || String(book.category_id) === String(selectedCategory)
        }
        return matchesCategory
    })

    const categoryOptions = [
        { value: "", label: "Barchasi", count: books.length },
        ...categories.map((cat) => ({
            value: cat.id,
            label: cat.name || cat.category_name,
            count: cat.books ? cat.books.length : books.filter((b) => b.category_name === cat.name || b.category_id === cat.id).length
        }))
    ]

    const uncategorizedCount = books.filter(
        (b) => !b.category_name && (!b.category_id || !categories.some((c) => c.id === b.category_id))
    ).length

    if (uncategorizedCount > 0) {
        categoryOptions.push({
            value: "uncategorized",
            label: "Kategoriyasiz",
            count: uncategorizedCount
        })
    }

    return (
        <div className='space-y-3 font-geist'>
            <div className='flex gap-3 items-center flex-wrap'>
                <div className="flex items-center">
                    <button onClick={() => setActiveTab("books")} className={`${activeTab === "books" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border cursor-pointer px-4 w-40 py-1.5 rounded-l-md`}>Kitoblar</button>
                    <button onClick={() => setActiveTab("categories")} className={`${activeTab === "categories" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border cursor-pointer px-4 w-40 py-1.5 rounded-r-md`}>Kategoriyalar</button>
                </div>

                <div className='flex gap-3 justify-between flex-1'>
                    <div className='border w-full group/search border-gray-200 focus-within:border-primary/45 transition-all duration-300 ease-in-out flex rounded-md px-3 py-1.5 gap-2 items-center'>
                        <Search size={22} className='text-slate-400' />
                        <input type="text" className='outline-none text-primary min-w-100 text-md w-full' placeholder={activeTab === "books" ? "Kitoblar ichidan qidirish..." : "Kategoriyalar ichidan qidirish..."} />
                    </div>

                    {
                        activeTab === "books" ? (
                            <CustomSelect
                                options={categoryOptions}
                                value={selectedCategory}
                                onChange={(val) => setSelectedCategory(val)}
                                placeholder="Barcha kategoriyalar"
                            />
                        ) : null
                    }
                </div>
            </div>
            {activeTab === "books" ? (
                <BooksTab
                    categories={categories}
                    books={filteredBooks}
                    deleteBook={deleteBook}
                    refreshData={getData}
                    loading={loading}
                />
            ) : (
                <CategoriesTab
                    categories={categories}
                    books={books}
                    deleteCategory={deleteCategory}
                    refreshData={getData}
                    loading={loading}
                />
            )}
        </div>
    )
}

export default Books