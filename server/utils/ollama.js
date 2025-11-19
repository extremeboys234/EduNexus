// server/utils/ollama.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
export const CHAT_MODEL = process.env.CHAT_MODEL || 'llama2-uncensored:latest';
export const EMBED_MODEL = process.env.EMBED_MODEL || 'nomic-embed-text';

export async function getEmbedding(text) {
  // Ollama embedding endpoint may be /api/embeddings or /api/embed depending on version
  const urlCandidates = ['/api/embeddings', '/api/embed'];
  let lastErr = null;

  for (const path of urlCandidates) {
    try {
      const res = await fetch(`${OLLAMA_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: EMBED_MODEL, input: text })
      });
      if (!res.ok) {
        lastErr = new Error(`Ollama embed ${path} failed ${res.status}`);
        continue;
      }
      const json = await res.json();
      // Ollama may return different shapes: {embedding: [...] } or { embeddings: [...] }
      return json.embedding ?? json.embeddings ?? (json.data?.[0]?.embedding) ?? null;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error('Embedding failed');
}

export async function chatGenerate(messages, stream = false, model = CHAT_MODEL) {
  const path = '/api/chat'; // or '/api/generate' if you prefer; /api/chat accepts messages array.
  const res = await fetch(`${OLLAMA_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Ollama chat failed: ${res.status} ${txt}`);
  }
  return res.json();
}
