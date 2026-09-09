import { useEffect, useRef, useState } from 'react';
import { FiPlus, FiSearch, FiMessageSquare, FiArrowUp, FiArrowUpRight, FiSun, FiMoon, FiDownload, FiCopy, FiCheck, FiTrash2, FiMenu, FiX, FiBookOpen, FiCode, FiCompass, FiEdit3, FiStopCircle, FiRefreshCw } from 'react-icons/fi';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';
import './App.css';

marked.setOptions({ breaks: true, gfm: true });
function Markdown({ text }) {
  return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(text), { USE_PROFILES: { html: true } }) }} />;
}
Markdown.propTypes = { text: PropTypes.string.isRequired };

const freshChat = () => ({ id: crypto.randomUUID(), title: 'New conversation', messages: [] });
const starters = [
  { icon: FiEdit3, name: 'Create something', text: 'Find the words you’re looking for.', prompt: 'Help me write a thoughtful thank-you message. Ask me who it is for and what I want to thank them for.', color: 'peach' },
  { icon: FiBookOpen, name: 'Learn something', text: 'Make the complicated feel simple.', prompt: 'Help me understand a new topic, one simple step at a time. First ask me what I would like to learn.', color: 'lavender' },
  { icon: FiCompass, name: 'Make a plan', text: 'Turn a little idea into a next step.', prompt: 'Help me make a realistic plan for a goal. Ask me about my goal and how much time I have.', color: 'green' },
  { icon: FiCode, name: 'Build something', text: 'Work through your next coding idea.', prompt: 'Be my patient coding partner. Ask me what I am building and which language I am using.', color: 'blue' },
];
function readChats() {
  try {
    const saved = JSON.parse(localStorage.getItem('chatmate-chats') || '[]');
    const valid = Array.isArray(saved) ? saved.filter(c => c && typeof c.id === 'string' && typeof c.title === 'string' && Array.isArray(c.messages) && c.messages.every(m => m && typeof m.id === 'string' && ['user', 'assistant'].includes(m.role) && typeof m.text === 'string')) : [];
    return valid.length ? valid : [freshChat()];
  } catch { return [freshChat()]; }
}
export default function App() {
  const [chats, setChats] = useState(readChats);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [style, setStyle] = useState('Balanced');
  const [dark, setDark] = useState(() => { try { return localStorage.getItem('chatmate-theme') === 'dark'; } catch { return false; } });
  const [mobile, setMobile] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [status, setStatus] = useState('checking');
  const [copied, setCopied] = useState(null);
  const controller = useRef(null);
  const bottom = useRef(null);
  const composer = useRef(null);
  const current = chats.find(c => c.id === activeId) || chats[0];
  useEffect(() => {
    try { localStorage.setItem('chatmate-chats', JSON.stringify(chats)); }
    catch { setNotice('Your browser could not save this chat. Export it to keep a copy.'); }
  }, [chats]);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    try { localStorage.setItem('chatmate-theme', dark ? 'dark' : 'light'); } catch { /* Session-only preference. */ }
  }, [dark]);
  useEffect(() => {
    fetch('/api/status').then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(data => setStatus(data.configured ? 'ready' : 'setup')).catch(() => setStatus('offline'));
    return () => controller.current?.abort();
  }, []);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [current.messages, busy]);
  useEffect(() => {
    if (composer.current) { composer.current.style.height = 'auto'; composer.current.style.height = `${Math.min(composer.current.scrollHeight, 160)}px`; }
  }, [input]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 6000); return () => clearTimeout(timer); }, [notice]);
  function selectChat(id) {
    controller.current?.abort(); controller.current = null; setBusy(false);
    setActiveId(id); setInput(''); setError(''); setMobile(false);
  }
  function newChat() {
    const empty = chats.find(c => !c.messages.length);
    if (empty) { selectChat(empty.id); return; }
    const next = freshChat(); setChats(prev => [next, ...prev]); selectChat(next.id);
  }
  function updateMessages(id, messages) {
    setChats(prev => prev.map(c => c.id === id ? { ...c, messages, title: messages.find(m => m.role === 'user')?.text.slice(0, 46) || c.title } : c));
  }
  async function send(retry = false) {
    if (busy || controller.current || (!retry && !input.trim())) return;
    const messages = retry ? current.messages : [...current.messages, { id: crypto.randomUUID(), role: 'user', text: input.trim() }];
    if (messages.at(-1)?.role !== 'user') return;
    const chatId = current.id;
    updateMessages(chatId, messages); setInput(''); setError(''); setBusy(true);
    const request = new AbortController(); controller.current = request;
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: messages.map(({ role, text }) => ({ role, text })), style }), signal: request.signal });
      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await response.json() : { error: 'The chat service returned an unexpected response. Please redeploy and try again.' };
      if (!response.ok) throw new Error(data.error || 'Unable to get a reply. Please try again.');
      if (controller.current !== request) return;
      updateMessages(chatId, [...messages, { id: crypto.randomUUID(), role: 'assistant', text: data.text }]);
    } catch (err) { if (controller.current === request && err.name !== 'AbortError') setError(err.message || 'Connection interrupted. Please try again.'); }
    finally { if (controller.current === request) { setBusy(false); controller.current = null; } }
  }
  function stop() { controller.current?.abort(); controller.current = null; setBusy(false); setError('Reply stopped. You can try again whenever you’re ready.'); }
  function removeChat(id) {
    if (!window.confirm('Delete this conversation from this browser?')) return;
    if (current.id === id) { controller.current?.abort(); controller.current = null; setBusy(false); setActiveId(null); setError(''); setInput(''); }
    setChats(prev => { const remaining = prev.filter(c => c.id !== id); return remaining.length ? remaining : [freshChat()]; });
  }
  async function copy(message) {
    try { await navigator.clipboard.writeText(message.text); setCopied(message.id); setTimeout(() => setCopied(null), 2000); }
    catch { setNotice('Copy is unavailable. Select the message text to copy it.'); }
  }
  function download() {
    const blob = new Blob([`# ${current.title}\n\n${current.messages.map(m => `## ${m.role === 'user' ? 'You' : 'ChatMate'}\n\n${m.text}`).join('\n\n')}`], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'chatmate-conversation.md'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const filtered = chats.filter(c => `${c.title} ${c.messages.map(m => m.text).join(' ')}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="app-shell">
    {mobile && <button className="sidebar-overlay" aria-label="Close navigation" onClick={() => setMobile(false)} />}
    <aside className={`sidebar ${mobile ? 'is-open' : ''}`} aria-label="Chat navigation">
      <a className="brand" href="#" onClick={e => { e.preventDefault(); newChat(); }}><span className="brand-mark">✳</span> ChatMate<span className="brand-dot">.</span></a>
      <button className="new-chat" onClick={newChat}><FiPlus /> New conversation <span>↗</span></button>
      <label className="search"><FiSearch /><input aria-label="Search conversations" placeholder="Search your chats" value={search} onChange={e => setSearch(e.target.value)} /></label>
      <div className="history-heading">YOUR CONVERSATIONS <span>{chats.filter(c => c.messages.length).length}</span></div>
      <nav className="history" aria-label="Saved conversations">
        {filtered.length ? filtered.map(chat => <div key={chat.id} className={`history-row ${chat.id === current.id ? 'selected' : ''}`}><button onClick={() => selectChat(chat.id)} aria-current={chat.id === current.id ? 'page' : undefined}><FiMessageSquare /><span>{chat.title}</span></button><button className="delete-chat" aria-label={`Delete ${chat.title}`} onClick={() => removeChat(chat.id)}><FiTrash2 /></button></div>) : <p className="no-results">No chats found. Try another search.</p>}
      </nav>
      <div className="sidebar-bottom"><div className="little-note"><span>✧</span><strong>A little curiosity goes a long way.</strong><p>Your next idea starts with a conversation.</p></div><button className="theme-toggle" onClick={() => setDark(!dark)}>{dark ? <FiSun /> : <FiMoon />} {dark ? 'Switch to light mode' : 'Switch to dark mode'}</button><div className="profile"><span className="avatar">Y</span><div><strong>Your personal space</strong><small>Chats saved on this device</small></div><span className="online-dot" /></div></div>
    </aside>
    <main className="workspace">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobile(true)}><FiMenu /></button><strong>Your everyday AI companion</strong><span className="beta-label">BETA</span></div><div className="topbar-actions"><span className={`connection ${status}`}><i />{status === 'ready' ? 'Ready to help' : status === 'setup' ? 'Setup needed' : status === 'checking' ? 'Connecting' : 'Not connected'}</span><button className="icon-button" onClick={download} disabled={!current.messages.length} aria-label="Export conversation" title="Export conversation"><FiDownload /></button></div></header>
      <div className={`conversation ${current.messages.length ? 'has-messages' : ''}`}>
        {!current.messages.length ? <section className="welcome"><div className="welcome-art" aria-hidden="true"><span className="spark spark-one">✦</span><div className="mascot"><span className="eyes"><i /><i /></span><span className="smile" /></div><span className="spark spark-two">✧</span></div><div className="eyebrow">A SMALL HELLO. ENDLESS POSSIBILITIES.</div><h1>Hey there, <span>what’s on your mind?</span></h1><p className="welcome-copy">Big questions, little ideas, or just a place to start.<br />I’m here to help you figure it out.</p><div className="starter-grid">{starters.map(({ icon: Icon, ...card }) => <button key={card.name} className={`starter-card ${card.color}`} onClick={() => { setInput(card.prompt); composer.current?.focus(); }}><span className="card-top"><span className="card-icon"><Icon /></span><FiArrowUpRight /></span><strong>{card.name}</strong><span>{card.text}</span></button>)}</div><div className="quick-prompts"><span>Or try</span>{['Give me a creative challenge', 'Help me unwind', 'Surprise me with a fun fact'].map(prompt => <button key={prompt} onClick={() => { setInput(prompt); composer.current?.focus(); }}>{prompt}<FiArrowUpRight /></button>)}</div></section> : <section className="message-list" aria-label="Conversation" aria-live="polite">{current.messages.map(message => <article className={`message ${message.role}`} key={message.id}><span className={`message-avatar ${message.role}`}>{message.role === 'user' ? 'Y' : '✳'}</span><div className="message-content"><div className="message-author">{message.role === 'user' ? 'You' : 'ChatMate'}{message.role === 'assistant' && <span>Your thinking partner</span>}</div><div className="message-text">{<Markdown text={message.text} />}</div><button className="message-copy" onClick={() => copy(message)} aria-label="Copy message">{copied === message.id ? <><FiCheck /> Copied</> : <><FiCopy /> Copy</>}</button></div></article>)}{busy && <div className="thinking" role="status"><span className="message-avatar assistant">✳</span><span>Thinking with you</span><span className="thinking-dots">•••</span></div>}<div ref={bottom} /></section>}
      </div>
      <div className="composer-area">{!busy && (error || current.messages.at(-1)?.role === 'user') && <div className="error-notice" role="alert"><span>{error || 'This message is waiting for a reply.'}</span><button onClick={() => send(true)}><FiRefreshCw /> Try again</button></div>}{status === 'setup' && <div className="setup-notice">Your space is ready. Connect a Gemini API key on the server to start chatting.</div>}
        <form className="composer" onSubmit={e => { e.preventDefault(); send(); }}><label className="sr-only" htmlFor="chat-input">Message ChatMate</label><textarea id="chat-input" ref={composer} value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything, or just say hello…" rows={1} maxLength={12000} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }} /><div className="composer-controls"><label className="style-select"><span>✧</span><select aria-label="Response style" value={style} onChange={e => setStyle(e.target.value)}><option>Balanced</option><option>Concise</option><option>Detailed</option></select></label><div><span className="keyboard-hint">Shift + Enter for a new line</span>{busy ? <button type="button" className="send-button" onClick={stop} aria-label="Stop reply"><FiStopCircle /></button> : <button type="submit" className="send-button" disabled={!input.trim()} aria-label="Send message"><FiArrowUp /></button>}</div></div></form>
        <p className="composer-footer"><span>Made for your curious side.</span> ChatMate can make mistakes. Double-check important details.</p>
      </div>
    </main>{notice && <div className="toast" role="status">{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}><FiX /></button></div>}
  </div>;
}

