import RequestDashboard from '@/components/RequestDashboard'

export default function Home() {
  // Generate a client ID on the server for SSR
  const clientId = 'default' // This will be overridden by the client component

  return <RequestDashboard clientId={clientId} />
}
