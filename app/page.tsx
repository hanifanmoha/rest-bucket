'use client'

import { useEffect, useState } from 'react'

interface RequestRecord {
  _id: string
  method: string
  path: string
  createdAt: string
}

function generateClientId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-500',
  POST: 'bg-blue-500',
  PUT: 'bg-orange-500',
  PATCH: 'bg-purple-500',
  DELETE: 'bg-red-500',
}

export default function Home() {
  const [clientId, setClientId] = useState<string>('')
  const [requests, setRequests] = useState<RequestRecord[]>([])

  useEffect(() => {
    let id = localStorage.getItem('client_id')
    if (!id) {
      id = generateClientId()
      localStorage.setItem('client_id', id)
    }
    setClientId(id)
  }, [])

  useEffect(() => {
    if (!clientId) return

    const fetchRequests = async () => {
      try {
        const res = await fetch(`/api/data/${clientId}`)
        const json = await res.json()
        setRequests(json.data?.requests ?? [])
      } catch (err) {
        console.error('Failed to fetch requests', err)
      }
    }

    fetchRequests()
    const interval = setInterval(fetchRequests, 3000)
    return () => clearInterval(interval)
  }, [clientId])

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left section — 1/3 width */}
      <div className="w-1/3 border-r border-base-300 flex flex-col">
        <div className="p-4 border-b border-base-300">
          <h2 className="text-lg font-bold mb-1">Incoming Requests</h2>
          <p className="text-xs text-base-content/50 font-mono break-all">
            Client ID: <span className="text-base-content/80 font-semibold">{clientId}</span>
          </p>
          <p className="text-xs text-base-content/40 font-mono mt-1">
            POST /api/r/{clientId}/any/path
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-base-200">
          {requests.length === 0 ? (
            <p className="p-4 text-sm text-base-content/40">No requests yet…</p>
          ) : (
            requests.map((req) => {
              const colorClass = METHOD_COLORS[req.method.toUpperCase()] ?? 'bg-gray-500'
              return (
                <div key={req._id} className="p-3 hover:bg-base-200 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`${colorClass} text-white text-xs font-bold px-2 py-0.5 rounded shrink-0`}>
                      {req.method.toUpperCase()}
                    </span>
                    <span className="text-sm font-mono truncate text-base-content/80">
                      /{req.path}
                    </span>
                  </div>
                  <p className="text-xs text-base-content/40 mt-1 pl-0.5">
                    {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Right section — 2/3 width (empty for now) */}
      <div className="flex-1" />
    </div>
  )
}
