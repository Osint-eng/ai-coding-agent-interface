'use client'

import { useMemo, useState, type ReactNode } from 'react'
import {
  Activity,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Code2,
  Copy,
  FileCode2,
  FileJson,
  FileText,
  Folder,
  GitBranch,
  GitPullRequest,
  LayoutPanelLeft,
  ListChecks,
  Loader2,
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
  TerminalSquare,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ToolStatus = 'done' | 'running' | 'queued'

const files = [
  { name: 'app', type: 'folder', depth: 0, open: true },
  { name: 'page.tsx', type: 'ts', depth: 1, active: true },
  { name: 'layout.tsx', type: 'ts', depth: 1 },
  { name: 'globals.css', type: 'css', depth: 1 },
  { name: 'components', type: 'folder', depth: 0, open: false },
  { name: 'ui', type: 'folder', depth: 1, open: false },
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
  ['+', "import { HeroSection } from '@/components/hero-section'", 'add'],
  ['+', "import { FeatureGrid } from '@/components/feature-grid'", 'add'],
  [' ', '', 'context'],
  ['-', 'export default function Page() {', 'remove'],
  ['-', '  return <main>Hello world</main>', 'remove'],
  ['+', 'export default function Page() {', 'add'],
  ['+', '  return (', 'add'],
  ['+', '    <main className="min-h-screen bg-background">', 'add'],
  ['+', '      <HeroSection />', 'add'],
  ['+', '      <FeatureGrid />', 'add'],
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

function ToolCard({ title, detail, status, children }: { title: string; detail: string; status: ToolStatus; children?: ReactNode }) {
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
