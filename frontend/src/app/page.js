'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()
  React.useEffect(() => {
    router.push('/buyurtmalar')
  }, [router])
  return null
}

export default Page