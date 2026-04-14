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
  // Generate initial client ID on server for SSR
  const initialClientId = generateClientId()

  return <RequestDashboard clientId={initialClientId} />
}
