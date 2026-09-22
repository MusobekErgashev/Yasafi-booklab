'use client'

import { pages } from '@/app/pages-export'
import { LogOut, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import useOpenMenu from '@/utils/useOpenMenu'
import useHeaderTitle from '@/utils/useHeaderTitle'
import WarningModal from './WarningModal'
import Cookies from 'js-cookie'
import api from '@/api/axios'

const Menu = () => {
  const pathname = usePathname()
  const router = useRouter()
  const userId = Cookies.get("booklab_userId");
  const { isOpen } = useOpenMenu()
  const { setTitle } = useHeaderTitle()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const currentPage = pages.find((page) => page.path === pathname)
    if (currentPage) {
      setTitle(currentPage.headTitle, currentPage.headDescription)
    }

    const fetchUser = async () => {
      if (!userId) return
      const response = await api.get(`/users/${userId}`)
      setUser(response.data)
    }
    fetchUser()
  }, [pathname, setTitle, userId])

  const handleLogout = () => {
    Cookies.remove('booklab_token')
    Cookies.remove('booklab_userId')
    Cookies.remove('token')
    setShowLogoutModal(false)
    router.push('/login')
  }

  return (
    <div className={`bg-white w-full border-r transition-all ease-out duration-200 border-gray-100 font-geist h-screen flex flex-col ${isOpen ? 'max-w-70 min-w-70' : 'max-w-16 min-w-16'}`}>
      <div className='px-4 h-16.5 border-b select-none border-gray-100 flex items-center'>
        <Link href="/buyurtmalar" className='flex gap-1.5 items-center'>
          <Image src="/logo-icon.png" alt="Logo" width={32} height={32} className={`h-8 w-auto shrink-0 transition-all ${isOpen ? 'scale-100' : 'scale-115'}`} priority />
          <Image src="/logo-text.png" alt="Logo" width={190} height={40} className={`h-auto w-46 shrink-0 ${isOpen ? 'block' : 'hidden'}`} priority />
        </Link>
      </div>

      <div className="flex p-2 flex-col gap-1">
        {
          pages.map((page) => (
            <Link href={page.path} key={page.id} className={`px-3 py-2.5 text-primary/90 ${isOpen ? 'w-full' : 'w-max'} rounded-lg transition-all ease-in-out flex items-center gap-2 ${pathname === page.path ? 'bg-primary text-white' : 'hover:bg-slate-100'}`}>
              <span>{page.icon}</span>
              <span className={`text-md font-medium ${isOpen ? 'block' : 'hidden'}`}>{page.title}</span>
            </Link>
          ))
        }
      </div>

      <div className="mt-auto p-2 flex gap-3 items-center pb-5 border-t border-gray-100">
        <Link href="/profil" className={`px-3 py-2.5 w-full text-primary/90 cursor-pointer rounded-lg transition-all ease-in-out flex items-center gap-2 ${pathname === '/profil' ? 'bg-primary text-white' : 'bg-slate-100'}`}>
          <User size={22} />

          <div className={`flex flex-col gap-0.5 ${isOpen ? 'block' : 'hidden'}`}>
            <span className='font-medium text-md leading-none truncate whitespace-nowrap'>{user?.username}</span>
            <span className='text-xs leading-none'>{user?.role}</span>
          </div>
        </Link>

        <div onClick={() => setShowLogoutModal(true)} className={`p-1 cursor-pointer ${isOpen ? 'block' : 'hidden'}`}>
          <LogOut size={20} className='text-red-600' />
        </div>
      </div>

      {showLogoutModal && (
        <WarningModal
          type='warning'
          title="Rostdan ham tizimdan chiqmoqchimisiz?"
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  )
}

export default Menu