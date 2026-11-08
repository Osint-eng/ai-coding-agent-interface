import { tool, streamText } from 'ai'
import { promises as fs } from 'node:fs'
import pathModule from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { z } from 'zod'

const execFileAsync = promisify(execFile)
const workspaceRoot = process.cwd()

function resolveWorkspacePath(relativePath: string) {
  const resolved = pathModule.resolve(workspaceRoot, relativePath || '.')
  if (resolved !== workspaceRoot && !resolved.startsWith(`${workspaceRoot}${pathModule.sep}`)) {
    throw new Error('Path must stay inside the workspace')
  }
  return resolved
}

const tools = {
  listFiles: tool({
    description: 'List files and folders in a workspace directory.',
    inputSchema: z.object({ path: z.string().default('.') }),
    execute: async ({ path: relativePath }) => {
      const entries = await fs.readdir(resolveWorkspacePath(relativePath), { withFileTypes: true })
      return entries.map((entry) => ({ name: entry.name, type: entry.isDirectory() ? 'directory' : 'file' }))
    },
  }),
  readFile: tool({
    description: 'Read a text file from the workspace. Use this before proposing edits.',
    inputSchema: z.object({ path: z.string().min(1) }),
    execute: async ({ path: relativePath }) => {
      const content = await fs.readFile(resolveWorkspacePath(relativePath), 'utf8')
      return { path: relativePath, content: content.slice(0, 30000) }
    },
  }),
  writeFile: tool({
    description: 'Write a complete text file to the workspace after the user has explicitly requested the change.',
    inputSchema: z.object({ path: z.string().min(1), content: z.string() }),
    execute: async ({ path: relativePath, content }) => {
      const destination = resolveWorkspacePath(relativePath)
      await fs.mkdir(pathModule.dirname(destination), { recursive: true })
      await fs.writeFile(destination, content, 'utf8')
      return { path: relativePath, bytes: Buffer.byteLength(content), status: 'written' }
    },
  }),
  runCommand: tool({
    description: 'Run a safe project inspection or validation command. Only use the approved commands.',
    inputSchema: z.object({ command: z.enum(['git status --short', 'pnpm exec tsc --noEmit', 'pnpm run build', 'pnpm lint', 'pnpm test']) }),
    execute: async ({ command }) => {
      const [executable, ...args] = command.split(' ')
      const result = await execFileAsync(executable, args, { cwd: workspaceRoot, timeout: 120000, maxBuffer: 200000 })
      return { command, stdout: result.stdout, stderr: result.stderr, status: 'completed' }
    },
  }),
}

export async function POST(request: Request) {
  const body = await request.json()
  const messages = Array.isArray(body.messages) ? body.messages : []
  const result = streamText({
    model: 'google/gemini-3.6-flash',
    system: 'You are Forge, a careful AI coding agent. Inspect files before editing. Use tools for real workspace state, explain every change, and never claim a command or edit succeeded unless its tool returned success. Only write files when the user explicitly asks to change code.',
    messages,
    tools,
    maxOutputTokens: 2048,
  })
  return result.toTextStreamResponse()
}
