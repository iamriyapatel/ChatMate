const styles = { Balanced: 'Give a clear, useful answer of moderate length.', Concise: 'Keep the answer short and direct.', Detailed: 'Explain thoroughly with steps and examples where helpful.' };

export function createChatHandler({ apiKey, model = 'nex-agi/nex-n2.5-mini:free', fetchImpl = fetch } = {}) {
  return async function handle(request) {
    const url = new URL(request.url);
    if (url.pathname === '/api/status' && request.method === 'GET') return Response.json({ configured: Boolean(apiKey) });
    if (url.pathname !== '/api/chat') return Response.json({ error: 'Not found.' }, { status: 404 });
    if (request.method !== 'POST') return Response.json({ error: 'Use POST to send a message.' }, { status: 405 });
    const origin = request.headers.get('origin');
    if (origin && origin !== url.origin) return Response.json({ error: 'This request is not allowed.' }, { status: 403 });
    if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Send a JSON message.' }, { status: 415 });
    let body;
    try { body = await request.json(); } catch { return Response.json({ error: 'Invalid message format.' }, { status: 400 }); }
    const { messages, style = 'Balanced' } = body || {};
    if (!Array.isArray(messages) || !messages.length || messages.length > 200 || !Object.hasOwn(styles, style) || messages.some(m => !m || !['user', 'assistant'].includes(m.role) || typeof m.text !== 'string' || !m.text.trim() || m.text.length > 16000) || messages.at(-1).role !== 'user') {
      return Response.json({ error: 'Please send a valid message. For long conversations, start a new chat.' }, { status: 400 });
    }
    if (!apiKey) return Response.json({ error: 'ChatMate needs an OpenRouter API key on the server before it can reply. Your message is saved here.' }, { status: 503 });
    // Keep a bounded recent context, beginning with a user turn.
    let context = messages.slice(-40);
    if (context[0].role === 'assistant') context = context.slice(1);
    const contents = [];
    for (const message of context) {
      const role = message.role === 'assistant' ? 'model' : 'user';
      if (contents.at(-1)?.role === role) contents.at(-1).parts.push({ text: message.text });
      else contents.push({ role, parts: [{ text: message.text }] });
    }
    try {
      const response = await fetchImpl('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages: [{ role: 'system', content: `You are ChatMate, a friendly, thoughtful AI thinking partner. Start with the useful answer, then add context only when it helps. Match the user’s level and tone, explain unfamiliar ideas in plain language, and break complicated work into manageable steps. Ask one focused question when an important detail is missing, but make a reasonable assumption when you can. Be warm without being gushy, honest about uncertainty, and never claim actions, sources, or access you do not have. Protect private information. Use readable paragraphs, headings and lists; put code in fenced blocks. ${styles[style]}` }, ...contents.map(({ role, parts }) => ({ role: role === 'model' ? 'assistant' : role, content: parts.map(p => p.text).join('') }))], max_tokens: 4096 }),
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(60000)]),
      });
      if (!response.ok) {
        const error = response.status === 429 ? 'ChatMate is a little busy. Please wait a moment and try again.' : [401, 403].includes(response.status) ? 'The AI connection needs attention. Please check the server API key.' : 'The AI service is unavailable right now. Please try again shortly.';
        return Response.json({ error }, { status: response.status === 429 ? 429 : 502 });
      }
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) return Response.json({ error: 'I couldn’t create a reply to that. Try rephrasing your message.' }, { status: 422 });
      return Response.json({ text });
    } catch (error) {
      return Response.json({ error: error.name === 'TimeoutError' ? 'That took longer than expected. Please try again.' : 'The connection was interrupted. Please try again.' }, { status: 504 });
    }
  };
}

// Node/Vite adapter. Reject large requests before buffering the complete body.
export function chatMiddleware(options) {
  const handle = createChatHandler(options);
  return async (req, res, next) => {
    if (!req.url?.startsWith('/api/')) { next(); return; }
    const controller = new AbortController();
    res.on('close', () => { if (!res.writableEnded) controller.abort(); });
    try {
      const chunks = []; let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 256000) { res.writeHead(413, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'This conversation is too long. Please start a new chat.' })); return; }
        chunks.push(chunk);
      }
      const request = new Request(`http://${req.headers.host || 'localhost'}${req.url}`, { method: req.method, headers: req.headers, ...(req.method !== 'GET' && req.method !== 'HEAD' ? { body: Buffer.concat(chunks) } : {}), signal: controller.signal });
      const response = await handle(request);
      res.writeHead(response.status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(await response.text());
    } catch { if (!res.writableEnded) { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'Unable to read this request.' })); } }
  };
}
