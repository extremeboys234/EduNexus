
// routes/upload.js  ← FINAL WORKING VERSION
import express from 'express';
import { supabase } from '../server.js';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { getEmbedding } from '../utils/ollama.js';
const router = express.Router();

// Get user from JWT (your MongoDB user)
const getUser = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// Chunk text
const chunkText = (text, size = 800) => {
  const words = text.split(/\s+/);
  const chunks = [];
  let current = [];
  for (const word of words) {
    if ((current.join(' ') + ' ' + word).length > size) {
      chunks.push(current.join(' '));
      current = [word];
    } else {
      current.push(word);
    }
  }
  if (current.length) chunks.push(current.join(' '));
  return chunks.filter(c => c.trim().length > 50); // ignore tiny chunks
};

router.post('/notes', async (req, res) => {
  const user = getUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized — login required' });
  }

  const { text, filename } = req.body;

  if (!text || text.trim().length < 10) {
    return res.status(400).json({ error: 'No valid text found in file' });
  }

  try {
    const chunks = chunkText(text);
    let savedCount = 0;

    for (const content of chunks) {
      let embedding = null;
try {
  embedding = await getEmbedding(content);
} catch (e) {
  // Ollama not running -> embedding null (will be backfilled later)
  console.warn('Ollama embed failed, row inserted without embedding');
}
      // Try to get embedding from Ollama (if running)
      try {
        const embedRes = await fetch('http://localhost:11434/api/embeddings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'nomic-embed-text',
            prompt: content
          })
        });
        if (embedRes.ok) {
          const data = await embedRes.json();
          embedding = data.embedding;
        }
      } catch (e) {
        // Ollama not running → embedding stays null (safe)
      }

      const { error } = await supabase.from('chunks').insert({
        user_id: user.id,           // from your MongoDB JWT
        content: content.trim(),
        embedding,
        metadata: {
          filename,
          uploaded_by: user.email || user.name,
          uploaded_at: new Date().toISOString()
        }
      });

      if (error) throw error;
      savedCount++;
    }

    res.json({
      success: true,
      chunks: savedCount,
      message: `${savedCount} chunks saved! Ready for AI chat`
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error — check backend logs' });
  }
});

export default router;