import test from 'node:test';
import assert from 'node:assert/strict';
import { createChatHandler } from './chat.mjs';

const message = { role: 'user', text: 'Hello' };
const request = (body, headers = {}) => new Request('http://localhost/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
test('status reports missing setup without disclosing credentials', async () => {
  const response = await createChatHandler() (new Request('http://localhost/api/status'));
  assert.deepEqual(await response.json(), { configured: false });
  assert.equal((await createChatHandler()(request({ messages: [message] }))).status, 503);
});
test('rejects malformed messages and cross-origin requests before contacting AI', async () => {
  const handle = createChatHandler({ apiKey: 'test', fetchImpl: () => assert.fail('Unexpected upstream call') });
  for (const messages of [[], [null], [{ role: 'system', text: 'bad' }], [{ role: 'user', text: '' }], [{ role: 'user', text: 'x'.repeat(16001) }]]) assert.equal((await handle(request({ messages }))).status, 400);
  assert.equal((await handle(request({ messages: [message] }, { origin: 'https://other.example' }))).status, 403);
});
test('preserves conversation context and selected style; key only goes upstream', async () => {
  const handle = createChatHandler({ apiKey: 'private-key', fetchImpl: async (url, options) => {
    assert.ok(!url.includes('private-key'));
    assert.equal(options.headers.Authorization, 'Bearer private-key');
    const body = JSON.parse(options.body);
    assert.deepEqual(body.messages.slice(1).map(c => c.role), ['user', 'assistant', 'user']);
    assert.match(body.messages[0].content, /short and direct/);
    return Response.json({ choices: [{ message: { content: 'Hi there!' } }] });
  } });
  const result = await handle(request({ messages: [message, { role: 'assistant', text: 'Hi!' }, { role: 'user', text: 'What did I say?' }], style: 'Concise' }));
  assert.deepEqual(await result.json(), { text: 'Hi there!' });
});
test('handles quota, empty output and network failure with actionable messages', async () => {
  for (const [fetchImpl, status] of [[async () => new Response('', { status: 429 }), 429], [async () => Response.json({ candidates: [] }), 422], [async () => { throw new Error('private diagnostic'); }, 504]]) {
    const result = await createChatHandler({ apiKey: 'test', fetchImpl })(request({ messages: [message] }));
    assert.equal(result.status, status);
    assert.ok(!(await result.json()).error.includes('private diagnostic'));
  }
});
test('bounds long histories and merges consecutive unanswered messages', async () => {
  const messages = Array.from({ length: 45 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', text: `Message ${i}` }));
  messages.push(message);
  const handle = createChatHandler({ apiKey: 'test', fetchImpl: async (_, options) => {
    const body = JSON.parse(options.body);
    assert.ok(body.messages.length <= 41);
    assert.equal(body.messages[1].role, 'user');
    return Response.json({ choices: [{ message: { content: 'OK' } }] });
  } });
  assert.equal((await handle(request({ messages }))).status, 200);
});
