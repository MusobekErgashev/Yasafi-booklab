'use client'

import { Bell, Moon, Search, Sun, TextAlignJustify } from 'lucide-react'
import React from 'react'
import useOpenMenu from '@/utils/useOpenMenu'
import useHeaderTitle from '@/utils/useHeaderTitle'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import useDarkMode from '@/utils/useDarkMode'

const Header = () => {
  const { toggle } = useOpenMenu()
  const { title, description } = useHeaderTitle()
  const { isDark, toggle: toggleDarkMode } = useDarkMode()
  const path = usePathname()

  const noSearchPages = ['/profil', '/bildirishnoma', '/mijozlar', '/hisobot', '/dashboard', '/kitoblar', '/topshiriqlar', '/moliya'];

  return (
    <div className='w-full font-geist bg-white justify-between h-17.75 border-b border-gray-100 flex items-center px-4'>
      <div className="flex items-center gap-3 w-50">
        <TextAlignJustify size={24} className='cursor-pointer' onClick={toggle} />

        <div className="flex flex-col gap-0.5">
          <span className="text-[16px] leading-none font-medium text-primary">{path === '/profil' ? 'Profil' : path === '/bildirishnoma' ? 'Bildirishnomalar' : title}</span>
          <span className="text-gray-500 text-sm leading-none">{path === '/profil' ? 'Profil sozlamalari' : path === '/bildirishnoma' ? 'Notifications' : description}</span>
        </div>
      </div>

      {
        noSearchPages.includes(path) ? null : (
          <div className="border group/search border-gray-200 focus-within:border-primary/45 transition-all duration-300 ease-in-out flex rounded-md px-3 py-1.5 gap-2 items-center">
            <Search size={22} className='text-slate-400' />
            <input type="text" placeholder={title + " ichidan qidirish..."} className='outline-none text-primary min-w-100 text-md w-full' />
          </div>
        )
      }

      <div className="flex gap-4 items-center">
        <div className='relative p-2'>
          <Link href="/bildirishnoma" className="cursor-pointer">
            <Bell size={24} className='text-primary' />
            <span className='absolute top-1 right-1.5 w-3.5 h-3.5 bg-red-600 rounded-full text-white text-[9px] flex items-center justify-center'>1</span>
          </Link>
        </div>

        <div onClick={toggleDarkMode} className="relative overflow-hidden h-8 w-20 px-1 border border-primary/20 rounded-full flex items-center cursor-pointer">
          <button
            className="rounded-full text-primary hover:text-primary cursor-pointer transition-all duration-300 relative overflow-hidden flex items-center justify-center border border-transparent hover:border-slate-100"
          >
            <div className={`transition-all duration-500 ease-out transform ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}>
              <Sun size={20} className="text-amber-500" />
            </div>
            <div className={`absolute transition-all duration-500 ease-out transform ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}>
              <Moon size={20} className="text-indigo-500" />
            </div>
          </button>

          <span className={`${isDark ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'} text-[15px] text-primary font-medium transition-all duration-350 ease-in-out absolute top-0.75 right-3.5`}>light</span>
          <span className={`${isDark ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} text-[15px] text-primary font-medium transition-all duration-350 ease-in-out absolute top-0.75 right-3.5`}>dark</span>
        </div>
      </div>
    </div>
  )
}

export default Header