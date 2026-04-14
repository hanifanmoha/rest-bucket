import RequestDashboard from '@/components/RequestDashboard'

export default async function ClientPage({
  params,
}: {
  params: Promise<{ client_id: string }>
}) {
  const { client_id } = await params
  return <RequestDashboard clientId={client_id} />
}
