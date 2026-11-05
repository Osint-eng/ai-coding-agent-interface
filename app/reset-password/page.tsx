'use client'

import { FormEvent, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export default function ResetPasswordPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError('')
    const result = await authClient.resetPassword({ newPassword: password, token: params.get('token') ?? '' })
    if (result.error) setError('This reset link is invalid or expired.')
    else router.push('/sign-in')
    setPending(false)
  }
  return <main className="grid min-h-dvh place-items-center bg-background px-6 py-12"><div className="w-full max-w-[420px]"><div className="mb-8 flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white"><ShieldCheck /></div><div><div className="text-sm font-semibold">Forge</div><div className="text-xs text-muted-foreground">AI coding workspace</div></div></div><h1 className="text-3xl font-semibold tracking-tight">Choose a new password</h1><p className="mt-2 text-sm text-muted-foreground">Use at least 8 characters to secure your account.</p><form onSubmit={submit} className="mt-7 flex flex-col gap-4"><label className="flex flex-col gap-2 text-xs font-medium">New password<div className="relative"><input value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} type={show ? 'text' : 'password'} className="h-11 w-full rounded-lg border border-input bg-card px-3 pr-10 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-muted-foreground">{show ? <EyeOff /> : <Eye />}</button></div></label>{error && <div role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</div>}<button disabled={pending} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-violet-600 text-sm font-semibold text-white hover:bg-violet-500">{pending ? 'Updating...' : 'Update password'} {!pending && <ArrowRight />}</button></form></div></main>
}
