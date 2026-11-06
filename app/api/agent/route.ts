import { streamText } from 'ai'

export async function POST(request: Request) {
  const body = await request.json()
  const messages = Array.isArray(body.messages) ? body.messages : []

  const result = streamText({
    model: 'google/gemini-3.6-flash',
    system: `You are Forge, a careful AI coding agent. Help the user understand and improve their Next.js TypeScript project. Be concise but practical. When suggesting changes, explain the file and show a focused code snippet. Do not claim to have edited or run files unless a tool explicitly did so.`,
    messages,
  })

  return result.toTextStreamResponse()
}
