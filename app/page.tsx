import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import ForgeWorkspace from '@/components/forge-workspace'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return <ForgeWorkspace user={{ name: session.user.name, email: session.user.email }} />
}
