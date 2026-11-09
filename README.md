# Forge — AI Coding Agent Interface

A premium, modern UI for an AI coding agent workspace. Built with Next.js, Tailwind CSS v4, and shadcn/ui patterns.

> **Note**: This is currently a high-fidelity **UI prototype / mock**. The chat, tool cards, terminal, and diff panels are interactive at the UI level but do not yet connect to a real AI agent or file system.

## Features

- Dark-first IDE-style layout
- File explorer sidebar (collapsible)
- Agent chat panel with expandable tool-call cards
- Live terminal panel
- Diff / proposed-changes panel with Accept / Reject
- Responsive design considerations
- Accessible controls (aria-labels)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Install & Run

```bash
# using pnpm (recommended)
pnpm install
pnpm dev

# or with npm
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
app/
  layout.tsx          # Root layout + metadata
  page.tsx            # Main IDE UI (currently monolithic)
  globals.css         # Tailwind + theme tokens
components/
  ui/button.tsx       # Button primitive
lib/
  utils.ts            # cn() helper
public/               # Icons & placeholders
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4, `@base-ui/react`, lucide-react
- **Styling**: CSS variables + oklch color tokens, dark mode support
- **Analytics**: Vercel Analytics (production only)

## Known Limitations (Hackathon / Prototype)

- No real AI agent backend or tool execution
- File tree, terminal, and diffs are mocked
- `app/page.tsx` is a large single client component (should be split)
- No persistence or real file system

## Roadmap Ideas

1. Connect a real LLM + tool-calling loop
2. Virtual file system + real diff application
3. Split `page.tsx` into feature components
4. Add proper loading / error / empty states
5. Keyboard shortcuts and command palette

## License

Private / Hackathon project.
