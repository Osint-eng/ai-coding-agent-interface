'use client'

import { FormEvent, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, ShieldCheck } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    await authClient.requestPasswordReset({ email, redirectTo: '/reset-password' })
    setSent(true)
    setPending(false)
  }

  return <main className="grid min-h-dvh place-items-center bg-background px-6 py-12"><div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.14),transparent_45%)]" /><div className="w-full max-w-[420px]"><a href="/sign-in" className="mb-10 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft /> Back to sign in</a><div className="mb-8 flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20"><ShieldCheck /></div><div><div className="text-sm font-semibold tracking-tight">Forge</div><div className="text-xs text-muted-foreground">AI coding workspace</div></div></div>{sent ? <div className="text-center"><div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-400"><CheckCircle2 /></div><h1 className="text-3xl font-semibold tracking-tight">Check your inbox</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">If an account exists for <span className="font-medium text-foreground">{email}</span>, we&apos;ll send a secure password reset link.</p><a href="/sign-in" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300">Return to sign in <ArrowRight /></a></div> : <><h1 className="text-3xl font-semibold tracking-tight">Reset your password</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Enter the email you use for Forge and we&apos;ll send a secure reset link.</p><form onSubmit={submit} className="mt-7 flex flex-col gap-4"><label className="flex flex-col gap-2 text-xs font-medium">Email address<div className="relative"><Mail className="absolute left-3 top-3 text-muted-foreground" /><input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" autoComplete="email" placeholder="you@company.com" className="h-11 w-full rounded-lg border border-input bg-card px-10 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" /></div></label><button disabled={pending} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-violet-600 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 disabled:opacity-70">{pending ? 'Sending...' : 'Send reset link'} {!pending && <ArrowRight />}</button></form></>}</div></main>
}
