'use client'

import { useEffect, useState } from 'react'
import RequestDashboard from '@/components/RequestDashboard'

function generateClientId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default function Home() {
  const [clientId, setClientId] = useState<string>('')

  useEffect(() => {
    let id = localStorage.getItem('client_id')
    if (!id) {
      id = generateClientId()
      localStorage.setItem('client_id', id)
    }
    setClientId(id)
  }, [])

  if (!clientId) return null

  return <RequestDashboard clientId={clientId} />
}
