# Forge AI Coding Workspace

Forge is a dark, developer-focused coding workspace with authenticated sessions, a real Gemini agent route, workspace inspection tools, streamed responses, terminal command controls, file explorer actions, and diff review UI.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Authentication requires the Neon integration and `BETTER_AUTH_SECRET`. Google sign-in also requires `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and the callback URI configured in Google Cloud Console:

`/api/auth/callback/google`

## Agent behavior

The agent endpoint is `POST /api/agent`. It uses the connected Vercel AI Gateway with Google Gemini and can inspect files, read files, write explicitly requested files, and run a small allowlist of project checks. Workspace file paths are sandboxed to the project root; arbitrary shell execution is intentionally not exposed to the browser.

## Validation

```bash
pnpm exec tsc --noEmit
pnpm run build
```
