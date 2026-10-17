'use client'

import React, { useEffect, useState } from 'react'
import CustomersTab from './CustomersTab'
import BranchesTab from './BranchesTab'
import { Search, X } from 'lucide-react'
import api from '@/api/axios'
import useQuery from '@/utils/useQuery'

const Customers = () => {
    const [activeTab, setActiveTab] = useState("customers")
    const [customersList, setCustomersList] = useState({
        customers: [],
        total_pages: 1,
        total: 0
    })
    const [branchesData, setBranchesData] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    const { query, setQuery, clearQuery } = useQuery()

    async function fetchCustomers() {
        try {
            setLoading(true)
            const params = { page, limit: 10 }
            if (query && query.trim() !== '') {
                params.q = query.trim()
            }
            const res = await api.get('customers', { params })
            if (Array.isArray(res.data)) {
                setCustomersList({
                    customers: res.data,
                    total_pages: 1,
                    total: res.data.length
                })
            } else {
                setCustomersList(res.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function fetchBranches() {
        try {
            setLoading(true)
            const params = { all: 'true' }
            if (query && query.trim() !== '') {
                params.q = query.trim()
            }
            const res = await api.get('customers', { params })
            const dataArr = Array.isArray(res.data) ? res.data : (res.data?.customers || [])
            setBranchesData(dataArr)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // Sahifadan chiqqanda qidiruv so'zini tozalash
    useEffect(() => {
        return () => {
            clearQuery()
        }
    }, [clearQuery])

    // Qidiruv yoki tab o'zgarganda 1-sahifaga qaytarish
    useEffect(() => {
        setPage(1)
    }, [query, activeTab])

    useEffect(() => {
        if (activeTab === 'customers') {
            fetchCustomers()
        } else {
            fetchBranches()
        }
    }, [page, query, activeTab])

    return (
        <div className='space-y-3 font-geist'>
            <div className='flex gap-3'>
                <div className="flex items-center">
                    <button 
                        onClick={() => setActiveTab("customers")} 
                        className={`${activeTab === "customers" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border cursor-pointer px-4 w-40 py-2 rounded-l-md transition-all`}
                    >
                        Mijozlar
                    </button>
                    <button 
                        onClick={() => setActiveTab("branches")} 
                        className={`${activeTab === "branches" ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200"} border cursor-pointer px-4 w-40 py-2 rounded-r-md transition-all`}
                    >
                        Filiallar
                    </button>
                </div>

                <div className='border group/search border-gray-200 focus-within:border-primary/45 transition-all duration-300 ease-in-out flex rounded-md px-3 py-1.5 gap-2 items-center flex-1 max-w-md'>
                    <Search size={22} className='text-slate-400 shrink-0' />
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none text-primary w-full text-md' 
                        placeholder={activeTab === "customers" ? "Mijozlar ichidan qidirish..." : "Filiallar ichidan qidirish..."} 
                    />
                    {query && (
                        <button 
                            type="button" 
                            onClick={clearQuery} 
                            className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
                            title="Tozalash"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {activeTab === "customers" ? (
                <CustomersTab 
                    data={customersList?.customers || []} 
                    total={customersList?.total || 0}
                    totalPages={customersList?.total_pages || 1}
                    page={page}
                    setPage={setPage}
                    loading={loading}
                    onRefresh={fetchCustomers}
                />
            ) : (
                <BranchesTab data={branchesData} />
            )}
        </div>
    )
}

export default Customers