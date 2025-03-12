# ChatMate

A welcoming React chat app with a responsive lavender-and-cream workspace, dark mode, prompt starters, searchable device-local conversations, copy and Markdown export, adjustable response styles, code blocks, and stop/retry controls.

## Run locally

Use Node.js 22.15 or later. Install the existing dependencies with `npm install` if needed.

1. Copy `.env.example` to `.env` in this directory.
2. Set `OPENROUTER_API_KEY` to your OpenRouter API key. Do not use a `VITE_` prefix: those variables are exposed to the browser.
3. Optionally set `OPENROUTER_MODEL` (default: `nex-agi/nex-n2.5-mini:free`).
4. Run `npm run dev` and open the URL printed by Vite. Restart after changing `.env`.

Without a key the interface, history, themes, and exports work; chat requests explain the required setup. No simulated AI replies are presented as real responses.

## Build and checks

- `npm run build` — production assets.
- `npm run lint` — frontend lint checks.
- `npm test` — API validation, context, style, errors, and credential boundary tests with a mocked provider.
- `npm run preview` — inspect the build locally with the API middleware.
- `npm start` — serve the production build and API on localhost:3000. Reads `.env`. Set `PORT` to change the port.

## How it works

`src/App.jsx` owns the workspace and conversation state. `server/chat.mjs` handles the Gemini request on the server, shared by Vite and the standalone Node server. The browser never receives the API key. The integration follows [Google's generateContent API](https://ai.google.dev/api/generate-content).

Chats are saved in this browser's local storage, without account sync. Deleting a chat removes its local copy. Clearing browser data also removes saved conversations. Sending a message transmits the recent conversation to Gemini; up to 40 recent messages are included for context. Requests are limited to 256 KB and 200 messages; start a new conversation when the limit is reached.

The included server binds to loopback for local use. Before exposing a shared installation, add authentication, per-user rate limits, and an HTTPS-aware reverse proxy/origin configuration. A static-only host cannot run the chat endpoint; use a Node-capable host or adapt the handler to your platform.

Existing legacy components remain in `src/components` but are no longer mounted by the redesigned app.
