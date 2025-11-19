// scripts/backfill_embeddings.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const EMBED_MODEL = process.env.EMBED_MODEL || 'nomic-embed-text';

// get pending chunks
async function getPending(limit = 20) {
  const { data, error } = await supabase
    .from('chunks')
    .select('id, content')
    .is('embedding', null)
    .limit(limit);
  if (error) throw error;
  return data;
}

async function ollamaEmbed(text) {
  const res = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: EMBED_MODEL, input: text })
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Ollama embed failed: ${res.status} ${t}`);
  }
  const json = await res.json();
  return json.embedding ?? json.embeddings ?? null;
}

(async function main() {
  try {
    const pending = await getPending(50);
    if (!pending.length) return console.log('No pending chunks');

    for (const ch of pending) {
      try {
        console.log('Embedding', ch.id);
        const embedding = await ollamaEmbed(ch.content);
        if (!embedding) throw new Error('No embedding returned');
        const { error } = await supabase.from('chunks').update({ embedding }).eq('id', ch.id);
        if (error) throw error;
        console.log('Updated', ch.id);
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.error('Failed:', ch.id, err.message);
      }
    }
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
