'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, GitBranch, Globe2, Loader2, Mail, ShieldCheck } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    const result = mode === 'sign-in'
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({ name, email, password })
    if (result.error) setError('We couldn’t complete that request. Check your details and try again.')
    else { router.push('/'); router.refresh() }
    setPending(false)
  }

  async function continueWithGoogle() {
    setPending(true)
    setError('')
    try {
      const response = await fetch('/api/auth/sign-in/social', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'include', body: JSON.stringify({ provider: 'google', callbackURL: `${window.location.origin}/` }) })
      const result = await response.json()
      if (!response.ok || !result.url) throw new Error('oauth-start-failed')
      window.location.assign(result.url)
    } catch {
      setError('Google sign-in could not start. Check the Google OAuth client and callback URL configuration.')
      setPending(false)
    }
  }

  return <div className="w-full max-w-[420px]">
    <div className="mb-8 flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20"><ShieldCheck /></div><div><div className="text-sm font-semibold tracking-tight">Forge</div><div className="text-xs text-muted-foreground">AI coding workspace</div></div></div>
    <div className="mb-7"><h1 className="text-3xl font-semibold tracking-tight">{mode === 'sign-in' ? 'Welcome back' : 'Create your workspace'}</h1><p className="mt-2 text-sm text-muted-foreground">{mode === 'sign-in' ? 'Sign in to continue shipping with Forge.' : 'Start building with an AI coding partner that understands your codebase.'}</p></div>
    <div className="grid grid-cols-2 gap-3"><button type="button" onClick={continueWithGoogle} disabled={pending} className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card text-sm font-medium transition hover:bg-accent disabled:opacity-60"><Globe2 /> Google</button><button type="button" disabled className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card text-sm font-medium opacity-60"><GitBranch /> GitHub</button></div>
    <div className="my-6 flex items-center gap-3 text-[11px] text-muted-foreground"><span className="h-px flex-1 bg-border" />OR CONTINUE WITH EMAIL<span className="h-px flex-1 bg-border" /></div>
    <form onSubmit={submit} className="flex flex-col gap-4">
      {mode === 'sign-up' && <label className="flex flex-col gap-2 text-xs font-medium">Full name<input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder="Maya Chen" className="h-11 rounded-lg border border-input bg-card px-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" /></label>}
      <label className="flex flex-col gap-2 text-xs font-medium">Email address<input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" autoComplete="email" placeholder="you@company.com" className="h-11 rounded-lg border border-input bg-card px-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" /></label>
      <label className="flex flex-col gap-2 text-xs font-medium">Password<div className="relative"><input value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} type={showPassword ? 'text' : 'password'} autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} placeholder="8+ characters" className="h-11 w-full rounded-lg border border-input bg-card px-3 pr-10 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
      {mode === 'sign-in' && <div className="-mt-1 flex justify-end"><a href="/forgot-password" className="text-xs font-medium text-violet-400 hover:text-violet-300">Forgot password?</a></div>}
      {error && <div role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</div>}
      <button disabled={pending} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-violet-600 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 disabled:cursor-wait disabled:opacity-70">{pending ? <Loader2 className="animate-spin" /> : mode === 'sign-in' ? 'Sign in' : 'Create account'} {!pending && <ArrowRight />}</button>
    </form>
    <p className="mt-7 text-center text-sm text-muted-foreground">{mode === 'sign-in' ? 'New to Forge?' : 'Already have an account?'} <a href={mode === 'sign-in' ? '/sign-up' : '/sign-in'} className="font-medium text-foreground underline decoration-border underline-offset-4 hover:text-violet-300">{mode === 'sign-in' ? 'Create an account' : 'Sign in'}</a></p>
    <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground"><Mail /> By continuing, you agree to Forge&apos;s Terms and Privacy Policy.</p>
  </div>
}
