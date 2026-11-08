'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Forge] route error', error)
  }, [error])
  return <main className="grid min-h-dvh place-items-center bg-background px-6 text-center text-foreground"><div><h1 className="text-2xl font-semibold">Something went wrong</h1><p className="mt-2 text-sm text-muted-foreground">Forge could not load this view.</p><button onClick={() => reset()} className="mt-6 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500">Try again</button></div></main>
}
