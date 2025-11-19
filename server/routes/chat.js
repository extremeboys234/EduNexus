// routes/chat.js
import express from 'express';
import { supabase } from '../server.js';
import jwt from 'jsonwebtoken';
import { getEmbedding, CHAT_MODEL, EMBED_MODEL, chatGenerate } from '../utils/ollama.js';

const router = express.Router();

const getUser = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

router.post('/', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: 'Login required' });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    let embedding = null;
    try {
      embedding = await getEmbedding(message);
    } catch (e) {
      console.warn('Embedding failed:', e.message);
    }

    let chunks;
    if (embedding) {
      // call RPC match_chunks (you must create this function in Supabase SQL)
      const { data, error } = await supabase.rpc('match_chunks', {
        query_embedding: embedding,
        match_count: 8
      });
      if (error) throw error;
      chunks = data;
    } else {
      // fallback: most recent chunks
      const { data, error } = await supabase
        .from('chunks')
        .select('id, content, metadata')
        .order('created_at', { ascending: false })
        .limit(8);
      if (error) throw error;
      chunks = data;
    }

    const context = chunks.map((c, i) => `Source S${i + 1}:\n${c.content}`).join('\n\n');

    const messages = [
      {
        role: 'system',
        content: `You are a helpful study assistant. Use ONLY the provided sources. Cite sources as [S1], [S2], etc.
Sources:
${context || 'No notes available.'}`
      },
      { role: 'user', content: message }
    ];

    const llmData = await chatGenerate(messages, false, CHAT_MODEL);

    // extract answer robustly (Ollama shapes vary)
    const answer =
      llmData?.choices?.[0]?.message?.content ||
      llmData?.message?.content ||
      llmData?.output?.[0]?.content?.[0]?.text ||
      llmData?.output?.[0] ||
      'No answer';

    const sources = chunks.map((c, i) => ({ id: c.id, label: `S${i + 1}`, snippet: (c.content||'').slice(0,300) }));

    res.json({ answer, sources });
  } catch (err) {
    console.error('RAG Error:', err);
    res.status(500).json({ error: 'AI offline or server error — try again later' });
  }
});

export default router;
