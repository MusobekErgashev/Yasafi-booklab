'use client'

import api from '@/api/axios'
import Cookies from 'js-cookie'
import { Briefcase, ChevronDown, Lock, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState } from 'react'

const Login = () => {
  const router = useRouter();

  const hintMessages = [
    "Avval barcha maydonlarni to'ldiring!",
    "Login kiritilishi kerak!",
    "Parol kiritilishi kerak!",
    "Login yoki parol noto'g'ri!",
    "Login kamida 4 ta belgidan iborat bo'lishi kerak!",
    "Parol kamida 6 ta belgidan iborat bo'lishi kerak!",
  ];

  const [hint, setHint] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedLogin = login.trim();
    const trimmedPassword = password.trim();

    if (!trimmedLogin && !trimmedPassword) {
      setHint(hintMessages[0]);
      setTimeout(() => {
        setHint("")
      }, 3000);
      return;
    }
    if (!trimmedLogin) {
      setHint(hintMessages[1]);
      setTimeout(() => {
        setHint("")
      }, 3000);
      return;
    }
    if (!trimmedPassword) {
      setHint(hintMessages[2]);
      setTimeout(() => {
        setHint("")
      }, 3000);
      return;
    }
    if (trimmedLogin.length < 4) {
      setHint(hintMessages[4]);
      setTimeout(() => {
        setHint("")
      }, 3000);
      return;
    }
    if (trimmedPassword.length < 6) {
      setHint(hintMessages[5]);
      setTimeout(() => {
        setHint("")
      }, 3000);
      return;
    }

    try {
      const response = await api.post("/auth/login/", {
        username: trimmedLogin,
        password: trimmedPassword,
      });

      const data = response.data;

      if (response.status === 200 || response.status === 201) {
        Cookies.set('booklab_token', data.access, { expires: 7 });
        Cookies.set('booklab_userId', data.id, { expires: 7 });

        router.push('/buyurtmalar');
      }
    } catch (error) {
      if (error.response) {
        setHint(hintMessages[3]);
        setTimeout(() => {
          setHint("")
        }, 3000);
      } else {
        setHint("Internet bilan bog'lanishda xatolik yuz berdi!");
        setTimeout(() => {
          setHint("")
        }, 3000);
        window.location.reload();
      }
    }
  };

  return (
    <div className='fixed  top-0 left-0 w-full h-screen flex justify-center items-center bg-linear-to-br from-white to-primary'>
      <div className='relative z-10 w-full max-w-[420px] flex flex-col items-center p-6 sm:p-8 bg-white rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100'>
        <div className='flex flex-col items-center gap-6 mb-8 w-full'>
          <div className='flex gap-1.5 mb-3 items-center select-none'>
            <Image src="/logo-icon.png" alt="Yasafi Icon" width={40} height={40} className='h-10 w-auto shrink-0' priority />
            <Image src="/logo-text.png" alt="Yasafi Text" width={190} height={40} className='h-auto w-45 shrink-0 block' priority />
          </div>

          <div className='text-center space-y-1.5'>
            <h1 className='text-[24px] font-bold text-primary tracking-tight'>Xush kelibsiz!</h1>
            <p className='text-[14px] text-slate-400'>{"Tizimga kirish uchun ma'lumotlaringizni kiriting."}</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className='flex flex-col gap-4 w-full'>
          <div className='relative group'>
            <User className='absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 group-focus-within:text-primary transition-colors' />
            <input
              type='text'
              name='login'
              placeholder='Login'
              maxLength={16}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className='w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 text-primary text-[15px] font-medium rounded-xl outline-none transition-all focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/10 placeholder:font-normal'
            />
          </div>

          <div className='relative group'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 group-focus-within:text-primary transition-colors' />
            <input
              type='password'
              name='password'
              placeholder='Parol'
              maxLength={10}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 text-primary text-[15px] font-medium rounded-xl outline-none transition-all focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/10 placeholder:font-normal'
            />
          </div>

          {/* hint */}

          {
            hint && (
              <p className='text-red-500 text-[14px] font-medium text-center'>{hint}</p>
            )
          }

          <button
            type='submit'
            className='w-full cursor-pointer bg-primary text-white font-semibold text-[15px] rounded-xl px-5 py-3.5 shadow-sm shadow-primary/20 hover:bg-primary/95 hover:shadow-md hover:shadow-primary/30 active:scale-[0.98] transition-all flex justify-center items-center gap-2'
          >
            Tizimga kirish
          </button>

          <p className='text-slate-400 text-[14px] font-medium text-center'>{"Hisobingiz yo'qmi? "} <Link href="/register" className='text-primary font-semibold hover:underline'>{"Ro'yxatdan o'tish"}</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Login