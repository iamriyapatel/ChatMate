/* global process */
const DEFAULT_MODEL = 'nex-agi/nex-n2.5-mini:free';
const styles = { Balanced: 'Give a clear, useful answer of moderate length.', Concise: 'Keep the answer short and direct.', Detailed: 'Explain thoroughly with steps and examples where helpful.' };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST to send a message.' });
  const { messages, style = 'Balanced' } = req.body || {};
  if (!Array.isArray(messages) || !messages.length || messages.length > 200 || !styles[style] || messages.some(m => !m || !['user', 'assistant'].includes(m.role) || typeof m.text !== 'string' || !m.text.trim() || m.text.length > 16000) || messages.at(-1).role !== 'user') return res.status(400).json({ error: 'Please send a valid message. For long conversations, start a new chat.' });
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return res.status(503).json({ error: 'OpenRouter is not configured for this deployment. Your message is saved here.' });
  const context = messages.slice(-40);
  const apiMessages = [{ role: 'system', content: `You are ChatMate, a friendly, patient AI thinking partner. Be warm, clear and practical without excessive praise. Ask a brief clarifying question when needed. Be honest about uncertainty and never claim actions or access you do not have. Use readable paragraphs and lists; put code in fenced blocks. ${styles[style]}` }, ...context.map(m => ({ role: m.role, content: m.text }))];
  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify({ model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL, messages: apiMessages, max_tokens: 4096 }) });
    if (!upstream.ok) return res.status(upstream.status === 429 ? 429 : 502).json({ error: upstream.status === 429 ? 'ChatMate is a little busy. Please wait a moment and try again.' : 'The AI service is unavailable right now. Please try again shortly.' });
    const data = await upstream.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) return res.status(422).json({ error: 'I couldn’t create a reply to that. Try rephrasing your message.' });
    return res.status(200).json({ text });
  } catch { return res.status(504).json({ error: 'The connection was interrupted. Please try again.' }); }
}
