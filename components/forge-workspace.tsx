'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Activity,
  AlertCircle,
  Archive,
  ArrowDown,
  ArrowUp,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clipboard,
  Code2,
  Command,
  Copy,
  CornerDownLeft,
  FileCode2,
  FileJson,
  FileText,
  Folder,
  GitBranch,
  GitCommit,
  GitPullRequest,
  GripVertical,
  Hammer,
  Info,
  LayoutPanelLeft,
  ListChecks,
  Loader2,
  LogOut,
  Maximize2,
  Menu,
  MessageSquare,
  Minimize2,
  MoreHorizontal,
  Paperclip,
  PanelRight,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings2,
  Sparkles,
  TerminalSquare,
  TestTube2,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'

type ToolStatus = 'done' | 'running' | 'queued'

const files = [
  { name: 'app', type: 'folder', depth: 0, open: true },
  { name: 'page.tsx', type: 'ts', depth: 1, parent: 'app', active: true },
  { name: 'layout.tsx', type: 'ts', depth: 1, parent: 'app' },
  { name: 'globals.css', type: 'css', depth: 1, parent: 'app' },
  { name: 'components', type: 'folder', depth: 0, open: false },
  { name: 'ui', type: 'folder', depth: 1, parent: 'components', open: false },
  { name: 'lib', type: 'folder', depth: 0, open: false },
  { name: 'package.json', type: 'json', depth: 0 },
  { name: 'tsconfig.json', type: 'json', depth: 0 },
]

const openFiles = [
  { name: 'page.tsx', meta: 'app / page.tsx', icon: FileCode2, color: 'text-sky-400' },
  { name: 'layout.tsx', meta: 'app / layout.tsx', icon: FileCode2, color: 'text-sky-400' },
  { name: 'globals.css', meta: 'app / globals.css', icon: FileText, color: 'text-pink-400' },
]

const codeLines = [
  ['@@', ' -1,5 +1,12 @@', 'context'],
  ['+', "import ForgeWorkspace from '@/components/forge-workspace'", 'add'],
  ['+', "import { AuthForm } from '@/components/auth-form'", 'add'],
  [' ', '', 'context'],
  ['-', 'export default function Page() {', 'remove'],
  ['-', '  return <main>Hello world</main>', 'remove'],
  ['+', 'export default function Page() {', 'add'],
  ['+', '  return (', 'add'],
  ['+', '    <main className="min-h-screen bg-background">', 'add'],
  ['+', '      <ForgeWorkspace user={user} />', 'add'],
  ['+', '      <AuthForm mode="sign-in" />', 'add'],
  ['+', '    </main>', 'add'],
  ['+', '  )', 'add'],
  [' ', '}', 'context'],
]

function IconForFile({ type }: { type: string }) {
  if (type === 'folder') return <Folder className="text-amber-400" />
  if (type === 'json') return <FileJson className="text-yellow-300" />
  if (type === 'css') return <FileText className="text-pink-400" />
  return <FileCode2 className="text-sky-400" />
}

function StatusDot({ status }: { status: ToolStatus }) {
  if (status === 'done') return <CheckCircle2 className="text-emerald-400" />
  if (status === 'running') return <Loader2 className="animate-spin text-violet-400" />
  return <Circle className="text-muted-foreground" />
}

function ToolCard({ title, detail, status, children }: { title: string; detail: string; status: ToolStatus; children?: React.ReactNode }) {
  const [expanded, setExpanded] = useState(status === 'running')
  return (
    <div className="rounded-xl border border-border/70 bg-card/70 shadow-sm transition-colors hover:border-border">
      <button onClick={() => setExpanded(!expanded)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <StatusDot status={status} />
        <span className="text-sm font-medium text-foreground">{title}</span>
        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{detail}</span>
        {expanded ? <ChevronDown className="text-muted-foreground" /> : <ChevronRight className="text-muted-foreground" />}
      </button>
      {expanded && children && <div className="border-t border-border/60 px-4 py-3">{children}</div>}
    </div>
  )
}

function Sidebar({ collapsed, setCollapsed, user }: { collapsed: boolean; setCollapsed: (value: boolean) => void; user: { name: string; email: string } }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [activeFile, setActiveFile] = useState('page.tsx')
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ app: true })
  const [loggingOut, setLoggingOut] = useState(false)
  const logout = async () => {
    setLoggingOut(true)
    await authClient.signOut()
    router.push('/sign-in')
    router.refresh()
  }
  const visibleFiles = useMemo(() => files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(query.toLowerCase())
    const isVisible = file.depth === 0 || (file.parent ? expandedFolders[file.parent] : false)
    return matchesSearch && isVisible
  }), [expandedFolders, query])
  return (
    <aside className={cn('flex shrink-0 flex-col border-r border-border bg-sidebar transition-[width] duration-300', collapsed ? 'w-[68px]' : 'w-[250px]')}>
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        <div className={cn('flex items-center gap-2 overflow-hidden', collapsed && 'mx-auto')}>
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/20"><Code2 /></div>
          {!collapsed && <div><div className="text-sm font-semibold tracking-tight">Forge</div><div className="text-[10px] text-muted-foreground">AI coding workspace</div></div>}
        </div>
        <button aria-label="Collapse sidebar" onClick={() => setCollapsed(!collapsed)} className={cn('rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground', collapsed && 'hidden')}><Minimize2 /></button>
      </div>
      {collapsed ? (
        <div className="flex flex-col items-center gap-4 py-5"><button aria-label="Expand sidebar" onClick={() => setCollapsed(false)} className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"><LayoutPanelLeft /></button><Search /><GitBranch /><Settings2 /></div>
      ) : <>
        <div className="flex items-center gap-2 border-b border-border px-3 py-3"><div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5"><Search className="shrink-0 text-muted-foreground" /><input aria-label="Search files" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search files" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground" /><kbd className="text-[10px] text-muted-foreground">⌘K</kbd></div><button aria-label="Add file" className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><Plus /></button></div>
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <div className="mb-2 flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"><span>Explorer</span><MoreHorizontal /></div>
          <div className="flex flex-col gap-0.5">{visibleFiles.map((file) => <button type="button" key={`${file.depth}-${file.name}`} onClick={() => file.type === 'folder' ? setExpandedFolders((current) => ({ ...current, [file.name]: !current[file.name] })) : setActiveFile(file.name)} className={cn('group flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-left text-xs', file.name === activeFile ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent/70 hover:text-foreground')} style={{ paddingLeft: `${10 + file.depth * 16}px` }}>{file.type === 'folder' ? (expandedFolders[file.name] ? <ChevronDown /> : <ChevronRight />) : <span className="size-4" />}{file.type === 'folder' ? <IconForFile type="folder" /> : <IconForFile type={file.type} />}<span className="truncate">{file.name}</span>{file.name === activeFile && <span className="ml-auto size-1.5 rounded-full bg-amber-400" />}</button>)}</div>
          <div className="mb-2 mt-7 flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"><span>Open files</span><span className="rounded bg-accent px-1.5 py-0.5 text-[9px]">3</span></div>
          <div className="flex flex-col gap-0.5">{openFiles.map(({ name, meta, icon: FileIcon, color }) => <button type="button" key={name} onClick={() => setActiveFile(name)} className={cn('flex items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-muted-foreground hover:bg-accent/70 hover:text-foreground', activeFile === name && 'bg-accent/60')}><FileIcon className={color} /><div className="min-w-0"><div className="truncate text-foreground/80">{name}</div><div className="truncate text-[10px] text-muted-foreground">{meta}</div></div><X aria-label={`Close ${name}`} className="ml-auto" /></button>)}</div>
        </div>
        <div className="border-t border-border p-3"><div className="mb-3 flex items-center gap-2 rounded-lg bg-background/60 p-2.5"><div className="relative"><div className="size-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600" /><span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-sidebar bg-emerald-400" /></div><div className="min-w-0 flex-1"><div className="truncate text-xs font-medium">{user.name}</div><div className="truncate text-[10px] text-muted-foreground">{user.email}</div></div><button aria-label="Log out" onClick={logout} disabled={loggingOut} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-60">{loggingOut ? <Loader2 className="animate-spin" /> : <LogOut />}</button></div><div className="flex items-center gap-2 px-1 text-[10px] text-muted-foreground"><GitBranch className="text-emerald-400" /><span>main</span><span className="ml-auto text-amber-400">2 changes</span></div></div>
      </>}
    </aside>
  )
}

function Topbar({ setRightOpen, rightOpen, collapsed, setCollapsed }: { setRightOpen: (v: boolean) => void; rightOpen: boolean; collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const [mode, setMode] = useState('Act')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  return <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-3 backdrop-blur-sm sm:px-5">
    <div className="flex min-w-0 items-center gap-2 sm:gap-4"><button aria-label="Toggle file sidebar" onClick={() => setCollapsed(!collapsed)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground sm:hidden"><Menu /></button><div className="flex min-w-0 items-center gap-2"><div className="flex size-7 items-center justify-center rounded-md border border-border bg-card text-violet-400"><TerminalSquare /></div><span className="truncate text-sm font-semibold">acme-dashboard</span><ChevronDown className="hidden text-muted-foreground sm:block" /></div><div className="hidden h-5 w-px bg-border sm:block" /><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><GitBranch className="text-emerald-400" />main <span className="size-1 rounded-full bg-muted-foreground" /> <span>Synced</span></div></div>
    <div className="flex items-center gap-1.5 sm:gap-2"><div className="hidden items-center rounded-lg border border-border bg-card p-0.5 md:flex">{['Plan', 'Act', 'Ask'].map((item) => <button key={item} onClick={() => setMode(item)} className={cn('rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors', mode === item ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground')}>{item}</button>)}</div><div className="relative"><button aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)} className={cn('rounded-md p-2 hover:bg-accent hover:text-foreground', notificationsOpen ? 'text-violet-400' : 'text-muted-foreground')}><Bell /></button>{notificationsOpen && <div className="absolute right-0 top-11 z-30 w-72 rounded-xl border border-border bg-card p-3 text-xs shadow-2xl"><div className="mb-3 flex items-center justify-between font-semibold"><span>Notifications</span><button onClick={() => setNotificationsOpen(false)} className="text-muted-foreground hover:text-foreground">Close</button></div><div className="flex items-start gap-2 rounded-lg bg-accent/60 p-2.5"><span className="mt-1 size-2 rounded-full bg-emerald-400" /><div><div className="font-medium">Workspace ready</div><div className="mt-1 text-muted-foreground">Forge is connected and ready for your next task.</div></div></div></div>}</div><button aria-label="Toggle diff panel" onClick={() => setRightOpen(!rightOpen)} className={cn('rounded-md p-2 hover:bg-accent hover:text-foreground', rightOpen ? 'text-violet-400' : 'text-muted-foreground')}><PanelRight /></button><Button onClick={() => { const composer = document.querySelector<HTMLTextAreaElement>('textarea[aria-label="Message the coding agent"]'); composer?.focus(); composer?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }} className="ml-1 hidden h-8 gap-2 bg-violet-600 px-3 text-xs text-white shadow-lg shadow-violet-600/20 hover:bg-violet-500 sm:flex"><Play data-icon="inline-start" />Run agent</Button></div>
  </header>
}

function Message({ children, user, time, avatar }: { children: React.ReactNode; user?: boolean; time: string; avatar: string }) {
  return <div className={cn('flex gap-3', user && 'flex-row-reverse')}><div className={cn('mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg text-[10px] font-bold', user ? 'bg-emerald-500/15 text-emerald-300' : 'bg-violet-500/15 text-violet-300')}>{avatar}</div><div className={cn('max-w-[90%] sm:max-w-[78%]', user && 'items-end')}><div className={cn('mb-1.5 flex items-center gap-2 text-[10px] text-muted-foreground', user && 'justify-end')}><span className="font-medium text-foreground/80">{user ? 'You' : 'Forge'}</span><span>{time}</span></div><div className={cn('text-[13px] leading-6 text-foreground/90', user ? 'rounded-2xl rounded-tr-md bg-accent px-4 py-3' : '')}>{children}</div></div></div>
}

function ChatPanel() {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<{ text: string; time: string; user?: boolean }[]>([])
  const [agentRunning, setAgentRunning] = useState(false)
  const [planFirst, setPlanFirst] = useState(false)
  const [attachment, setAttachment] = useState('')
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const send = async () => {
    const text = draft.trim()
    if (!text || agentRunning) return
    const nextMessages = [...messages, { text, time: 'now', user: true }]
    setMessages(nextMessages)
    setDraft('')
    setAgentRunning(true)
    try {
      const response = await fetch('/api/agent', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: nextMessages.map(({ text: content, user }) => ({ role: user ? 'user' : 'assistant', content })) }) })
      if (!response.ok || !response.body) throw new Error('Agent request failed')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let answer = ''
      setMessages((current) => [...current, { text: '', time: 'now' }])
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        answer += decoder.decode(value, { stream: true })
        setMessages((current) => [...current.slice(0, -1), { text: answer, time: 'now' }])
      }
    } catch {
      setMessages((current) => [...current, { text: 'The agent could not connect. Check the AI Gateway configuration and try again.', time: 'now' }])
    } finally {
      setAgentRunning(false)
    }
  }
  return <section className="flex min-h-0 flex-1 flex-col">
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-border px-4"><div className="flex items-center gap-2"><MessageSquare className="text-violet-400" /><span className="text-xs font-semibold">Agent session</span><span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">Live</span></div><div className="flex items-center gap-3 text-[10px] text-muted-foreground"><span className="hidden sm:inline">Gemini 3.6 Flash</span><Activity className="text-emerald-400" /> 12.4k tokens</div></div>
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8"><div className="mx-auto flex max-w-3xl flex-col gap-7">
      <Message time="10:42 AM" avatar="F"><p>I&apos;ve mapped the project. The dashboard currently has a basic shell, so I&apos;ll start by creating the hero section and a responsive feature grid.</p><div className="mt-4 flex flex-col gap-2"><ToolCard title="Read project files" detail="app/page.tsx · package.json · 3 files" status="done"><div className="flex flex-col gap-1 font-mono text-[11px] text-muted-foreground"><span>✓ app/page.tsx <b className="font-normal text-foreground/80">(42 lines)</b></span><span>✓ package.json <b className="font-normal text-foreground/80">(Next.js 16)</b></span><span>✓ tsconfig.json <b className="font-normal text-foreground/80">(strict)</b></span></div></ToolCard><ToolCard title="Plan implementation" detail="4 steps · estimated 2 min" status="done"><div className="flex flex-col gap-2 text-xs text-muted-foreground"><div className="flex gap-2"><Check className="text-emerald-400" /> Build layout and responsive shell</div><div className="flex gap-2"><Check className="text-emerald-400" /> Add accessible hero and feature sections</div><div className="flex gap-2"><Loader2 className="animate-spin text-violet-400" /> Applying changes to page.tsx</div></div></ToolCard></div></Message>
      <Message user time="10:43 AM" avatar="MC"><p>Great. Keep the visual language minimal — dark canvas, soft violet accents, and a CTA that feels intentional.</p></Message>
      <Message time="10:43 AM" avatar="F"><p>On it. I&apos;ve also kept the existing spacing tokens and added a subtle gradient for depth. Here&apos;s the proposed change:</p><div className="mt-4 flex flex-col gap-2"><ToolCard title="Applying changes" detail="app/page.tsx · +12 -3 lines" status="running"><div className="rounded-md bg-background/80 p-3 font-mono text-[11px] leading-5 text-muted-foreground"><div><span className="text-emerald-400">+</span> <span className="text-foreground/80">import {'{ HeroSection }'} from &apos;@/components/hero-section&apos;</span></div><div><span className="text-emerald-400">+</span> <span className="text-foreground/80">import {'{ FeatureGrid }'} from &apos;@/components/feature-grid&apos;</span></div><div><span className="text-emerald-400">+</span> <span className="text-foreground/80">&lt;HeroSection /&gt;</span></div></div></ToolCard></div></Message>
      {messages.map((message, index) => <Message key={`${message.time}-${index}`} user={message.user} time={message.time} avatar={message.user ? 'MC' : 'F'}><p>{message.text || (agentRunning && index === messages.length - 1 ? 'Thinking…' : '')}</p></Message>)}
    </div></div>
    <div className="border-t border-border bg-background px-4 py-3 sm:px-8"><div className="mx-auto max-w-3xl"><div className="rounded-xl border border-border bg-card shadow-xl shadow-black/10 focus-within:border-violet-500/60"><input ref={fileRef} type="file" className="hidden" onChange={(e) => setAttachment(e.target.files?.[0]?.name ?? '')} /><textarea ref={composerRef} aria-label="Message the coding agent" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) { e.preventDefault(); send() } }} placeholder="Ask Forge to edit your code..." rows={2} className="w-full resize-none bg-transparent px-4 pt-3 text-sm outline-none placeholder:text-muted-foreground" /><div className="flex items-center justify-between px-3 pb-2 pt-1"><div className="flex items-center gap-1"><button type="button" aria-label="Attach file" onClick={() => fileRef.current?.click()} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"><Paperclip /></button><button type="button" onClick={() => setPlanFirst(!planFirst)} className={cn('hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] sm:flex', planFirst ? 'bg-violet-500/15 text-violet-300' : 'text-muted-foreground hover:bg-accent hover:text-foreground')}><ListChecks /> {planFirst ? 'Planning first' : 'Plan first'}</button>{attachment && <span className="max-w-32 truncate rounded bg-accent px-2 py-1 text-[10px] text-muted-foreground">{attachment}</span>}<span className="hidden text-[10px] text-muted-foreground sm:inline">Shift + Enter for new line</span></div><div className="flex items-center gap-2"><span className="hidden text-[10px] text-muted-foreground sm:inline">Gemini 3.6 Flash <ChevronDown /></span><Button aria-label="Send message" onClick={send} size="icon" className="size-8 bg-violet-600 text-white hover:bg-violet-500"><Send data-icon="inline-start" /></Button></div></div></div></div></div>
  </section>
}

function TerminalPanel() {
  const [expanded, setExpanded] = useState(true)
  const [cleared, setCleared] = useState(false)
  const [command, setCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const terminalText = 'git status --short\n M app/page.tsx\npnpm lint\n✓ No ESLint warnings or errors\npnpm test\nTest Suites: 3 passed, 3 total\nTests: 14 passed, 14 total'
  const runCommand = () => {
    const nextCommand = command.trim()
    if (!nextCommand) return
    setCommandHistory((history) => [...history, nextCommand])
    setCommand('')
    setCleared(false)
  }
  return <section className={cn('shrink-0 border-t border-border bg-[#0b0d12] transition-[height] duration-300', expanded ? 'h-[235px]' : 'h-10')}><div className="flex h-10 items-center justify-between border-b border-border/70 px-4"><div className="flex items-center gap-3"><button onClick={() => setExpanded(!expanded)} className="flex items-center gap-2 text-xs font-semibold"><TerminalSquare className="text-emerald-400" />Terminal <ChevronDown className={cn('text-muted-foreground transition-transform', !expanded && '-rotate-90')} /></button><span className="hidden rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400 sm:inline">zsh</span><span className="hidden text-[10px] text-muted-foreground sm:inline">~/projects/acme-dashboard</span></div><div className="flex items-center gap-2 text-muted-foreground"><button aria-label="Copy terminal output" onClick={() => navigator.clipboard?.writeText(terminalText)} className="rounded p-1 hover:bg-accent hover:text-foreground"><Copy /></button><button aria-label="Clear terminal" onClick={() => setCleared(true)} className="rounded p-1 hover:bg-accent hover:text-foreground"><RefreshCw /></button><button aria-label="Maximize terminal" className="rounded p-1 hover:bg-accent hover:text-foreground"><Maximize2 /></button></div></div>{expanded && !cleared && <div className="h-[195px] overflow-y-auto p-4 font-mono text-[11px] leading-5"><div className="text-muted-foreground"><span className="text-violet-400">forge</span> <span className="text-emerald-400">➜</span> <span className="text-sky-300">acme-dashboard</span> <span className="text-foreground">git status --short</span></div><div className="text-amber-300"> M app/page.tsx</div><div className="mt-3 text-muted-foreground"><span className="text-violet-400">forge</span> <span className="text-emerald-400">➜</span> <span className="text-sky-300">acme-dashboard</span> <span className="text-foreground">pnpm lint</span></div><div className="text-emerald-400">✓ No ESLint warnings or errors</div><div className="mt-3 text-muted-foreground"><span className="text-violet-400">forge</span> <span className="text-emerald-400">➜</span> <span className="text-sky-300">acme-dashboard</span> <span className="text-foreground">pnpm test</span></div><div className="text-muted-foreground">Test Suites: <span className="text-emerald-400">3 passed</span>, 3 total</div><div className="text-muted-foreground">Tests: <span className="text-emerald-400">14 passed</span>, 14 total</div><div className="mt-2 flex items-center gap-2 text-muted-foreground"><span className="text-violet-400">forge</span><span className="text-emerald-400">➜</span><span className="text-sky-300">acme-dashboard</span><span className="text-foreground">_</span><span className="inline-block h-3 w-1.5 animate-pulse bg-emerald-400" /></div>{commandHistory.map((item, index) => <div key={`${item}-${index}`} className="mt-2 text-foreground"><span className="text-violet-400">forge</span> <span className="text-emerald-400">➜</span> {item}<div className="text-emerald-400">✓ Command queued for agent execution</div></div>)}<div className="mt-3 flex items-center gap-2 border-t border-border/50 pt-2"><span className="text-emerald-400">$</span><input aria-label="Terminal command" value={command} onChange={(event) => setCommand(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); runCommand() } }} placeholder="Type a command and press Enter" className="min-w-0 flex-1 bg-transparent text-[11px] text-foreground outline-none placeholder:text-muted-foreground" /></div></div>}</section>
}

function DiffPanel({ onClose }: { onClose: () => void }) {
  const [accepted, setAccepted] = useState(false)
  return <aside className="flex w-[390px] shrink-0 flex-col border-l border-border bg-sidebar max-xl:w-[340px] max-lg:absolute max-lg:right-0 max-lg:top-14 max-lg:z-20 max-lg:h-[calc(100%-56px)] max-lg:shadow-2xl">
    <div className="flex h-11 items-center justify-between border-b border-border px-4"><div className="flex items-center gap-2"><GitPullRequest className="text-violet-400" /><span className="text-xs font-semibold">Proposed changes</span><span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-400">1 file</span></div><button aria-label="Close diff panel" onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"><X /></button></div><div className="flex items-center justify-between border-b border-border px-4 py-3"><div className="flex items-center gap-2 text-xs"><FileCode2 className="text-sky-400" /><span>app/page.tsx</span></div><div className="flex items-center gap-2 text-[10px]"><span className="text-emerald-400">+12</span><span className="text-rose-400">-3</span></div></div><div className="flex-1 overflow-auto bg-[#0c0e13] p-3 font-mono text-[10px] leading-5">{accepted ? <div className="grid min-h-40 place-items-center text-center text-muted-foreground"><CheckCircle2 className="mb-2 text-emerald-400" /><span>Changes accepted<br /><span className="text-[9px]">page.tsx is up to date</span></span></div> : codeLines.map(([sign, text, kind], index) => <div key={index} className={cn('flex min-w-max', kind === 'add' && 'bg-emerald-500/10 text-emerald-300', kind === 'remove' && 'bg-rose-500/10 text-rose-300', kind === 'context' && 'text-muted-foreground')}><span className="sticky left-0 inline-block w-5 select-none bg-[#0c0e13] text-center text-muted-foreground">{sign}</span><span className="mr-3 inline-block w-5 select-none text-right text-muted-foreground/50">{index + 1}</span><span>{text || ' '}</span></div>)}</div><div className="flex items-center gap-2 border-t border-border p-3"><Button onClick={() => setAccepted(true)} disabled={accepted} className="h-8 flex-1 gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-500"><Check data-icon="inline-start" />Accept all</Button><Button variant="outline" className="h-8 gap-1.5 border-border bg-transparent text-xs text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"><X data-icon="inline-start" />Reject</Button><button aria-label="More diff actions" className="rounded-md border border-border p-2 text-muted-foreground hover:bg-accent hover:text-foreground"><MoreHorizontal /></button></div></aside>
}

export default function Page({ user }: { user: { name: string; email: string } }) {
  const [collapsed, setCollapsed] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)
  return <main className="flex h-dvh overflow-hidden bg-background text-foreground"><Sidebar collapsed={collapsed} setCollapsed={setCollapsed} user={user} /><div className="relative flex min-w-0 flex-1 flex-col"><Topbar setRightOpen={setRightOpen} rightOpen={rightOpen} collapsed={collapsed} setCollapsed={setCollapsed} /><div className="flex min-h-0 flex-1"><div className="flex min-w-0 flex-1 flex-col"><ChatPanel /><TerminalPanel /></div>{rightOpen && <DiffPanel onClose={() => setRightOpen(false)} />}</div></div></main>
}
