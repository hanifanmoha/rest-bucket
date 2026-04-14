'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface RequestRecord {
  _id: string
  method: string
  path: string
  headers: string
  queries: string
  body: string
  createdAt: string
}

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-500',
  POST: 'bg-blue-500',
  PUT: 'bg-orange-500',
  PATCH: 'bg-purple-500',
  DELETE: 'bg-red-500',
}

function tryParseJSON(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}

function Section({ title, content }: { title: string; content: string }) {
  const formatted = tryParseJSON(content)
  const isEmpty = !content || content === '{}' || content === 'null' || content === ''
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-base-content/40 mb-2">{title}</h3>
      {isEmpty ? (
        <p className="text-xs text-base-content/30 italic">empty</p>
      ) : (
        <pre className="bg-base-200 rounded p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
          {formatted}
        </pre>
      )}
    </div>
  )
}

export default function RequestDashboard({ clientId }: { clientId: string }) {
  const router = useRouter()
  const [requests, setRequests] = useState<RequestRecord[]>([])
  const [selected, setSelected] = useState<RequestRecord | null>(null)
  const [total, setTotal] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [manualId, setManualId] = useState('')
  const loadedPagesRef = useRef(1)
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Reset state when clientId changes
  useEffect(() => {
    setRequests([])
    setSelected(null)
    setTotal(0)
    setInitialLoading(true)
    loadedPagesRef.current = 1
  }, [clientId])

  const fetchPage = async (id: string, page: number) => {
    const res = await fetch(`/api/data/${id}?page=${page}`)
    const json = await res.json()
    return {
      requests: (json.data?.requests ?? []) as RequestRecord[],
      total: (json.data?.total ?? 0) as number,
      limit: (json.data?.limit ?? 10) as number,
    }
  }

  // Polling — refresh page 1, prepend new items
  useEffect(() => {
    if (!clientId) return

    const poll = async () => {
      try {
        const { requests: fresh, total: t } = await fetchPage(clientId, 1)
        setTotal(t)
        setRequests(prev => {
          const existingIds = new Set(prev.map(r => r._id))
          const newItems = fresh.filter(r => !existingIds.has(r._id))
          const merged = prev.map(r => fresh.find(f => f._id === r._id) ?? r)
          return [...newItems, ...merged]
        })
        setSelected(prev => prev ? (fresh.find(r => r._id === prev._id) ?? prev) : null)
      } catch (err) {
        console.error('Failed to fetch requests', err)
      } finally {
        setInitialLoading(false)
      }
    }

    poll()
    const interval = setInterval(poll, 3000)
    return () => clearInterval(interval)
  }, [clientId])

  const handleLoadMore = async () => {
    if (loadingMore || !clientId) return
    setLoadingMore(true)
    try {
      const nextPage = loadedPagesRef.current + 1
      const { requests: more, total: t } = await fetchPage(clientId, nextPage)
      setTotal(t)
      setRequests(prev => {
        const existingIds = new Set(prev.map(r => r._id))
        return [...prev, ...more.filter(r => !existingIds.has(r._id))]
      })
      loadedPagesRef.current = nextPage
    } catch (err) {
      console.error('Failed to load more', err)
    } finally {
      setLoadingMore(false)
    }
  }

  const openModal = () => {
    setManualId('')
    dialogRef.current?.showModal()
  }

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = manualId.trim()
    if (!trimmed) return
    dialogRef.current?.close()
    router.push(`/${trimmed}`)
  }

  const hasMore = requests.length < total

  return (
    <>
      {/* Go-to client modal */}
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Go to Other Client ID</h3>
          <form onSubmit={handleModalSubmit}>
            <input
              type="text"
              value={manualId}
              onChange={e => setManualId(e.target.value)}
              placeholder="Enter client ID…"
              className="input input-bordered w-full font-mono mb-4"
              autoFocus
            />
            <div className="modal-action mt-0">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => dialogRef.current?.close()}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={!manualId.trim()}>
                Go
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left section — 1/3 width */}
        <div className="w-1/3 border-r border-base-300 flex flex-col">
          <div className="p-4 border-b border-base-300">
            <h2 className="text-lg font-bold mb-2">Incoming Requests</h2>

            {/* Client ID row */}
            <div className="flex items-center gap-2">
              <p className="text-xs text-base-content/50 font-mono break-all flex-1">
                Client ID: <span className="text-base-content/80 font-semibold">{clientId}</span>
              </p>
              <button
                onClick={openModal}
                className="btn btn-xs btn-ghost p-1"
                title="Go to a different client ID"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
                  />
                </svg>
              </button>
            </div>

            <p className="text-xs text-base-content/40 font-mono mt-1 break-all">
              /api/r/{clientId}/&lt;any/path&gt;
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-base-200">
            {initialLoading ? (
              <div className="divide-y divide-base-200">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-3 animate-pulse">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-12 rounded bg-base-300" />
                      <div className="h-4 flex-1 rounded bg-base-300" />
                    </div>
                    <div className="mt-2 h-3 w-24 rounded bg-base-300" />
                  </div>
                ))}
              </div>
            ) : requests.length === 0 ? (
              <p className="p-4 text-sm text-base-content/40">No requests yet…</p>
            ) : (
              <>
                {requests.map((req) => {
                  const colorClass = METHOD_COLORS[req.method.toUpperCase()] ?? 'bg-gray-500'
                  const isSelected = selected?._id === req._id
                  return (
                    <div
                      key={req._id}
                      onClick={() => setSelected(req)}
                      className={`p-3 cursor-pointer transition-colors ${isSelected ? 'bg-base-300' : 'hover:bg-base-200'}`}
                    >
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
                })}

                {/* Load More */}
                <div className="p-3">
                  {hasMore ? (
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="btn btn-sm btn-ghost w-full text-xs"
                    >
                      {loadingMore ? 'Loading…' : `Load more (${requests.length} / ${total})`}
                    </button>
                  ) : (
                    <p className="text-center text-xs text-base-content/30 py-1">
                      All {total} request{total !== 1 ? 's' : ''} loaded
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right section — 2/3 width */}
        <div className="flex-1 overflow-y-auto">
          {!selected ? (
            <div className="flex items-center justify-center h-full text-base-content/30 text-sm">
              Select a request to view details
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className={`${METHOD_COLORS[selected.method.toUpperCase()] ?? 'bg-gray-500'} text-white text-sm font-bold px-3 py-1 rounded`}>
                  {selected.method.toUpperCase()}
                </span>
                <span className="font-mono text-base font-semibold break-all">/{selected.path}</span>
              </div>

              <p className="text-xs text-base-content/40">
                {new Date(selected.createdAt).toLocaleString()}
              </p>

              <div className="divider my-0" />

              <Section title="Query Params" content={selected.queries} />
              <Section title="Headers" content={selected.headers} />
              <Section title="Body" content={selected.body} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
