// routes/chatRag.js
import express from "express";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { supabase } from "../server.js"; // your supabase client

const router = express.Router();

const getUser = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return null;
  }
};

router.post("/rag", async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: "Login required" });

  const { message, topK = 6 } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  try {
    // 1) Get embedding for the query from Ollama
    const embRes = await fetch("http://localhost:11434/api/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "nomic-embed-text", prompt: message })
    });
    if (!embRes.ok) throw new Error("Embedding API error");
    const embJson = await embRes.json();
    const queryEmbedding = embJson.embedding; // array of floats

    // 2) Find top K similar chunks in Supabase
    // Assumes you have an RPC 'match_chunks' that accepts query_embedding (vector) & match_count
    const { data: chunks, error } = await supabase.rpc("match_chunks", {
      query_embedding: queryEmbedding,
      match_count: topK
    });

    if (error) throw error;

    // 3) Build context and sources
    const sources = chunks.map((c, i) => ({
      id: c.id,
      snippet: (c.content || "").slice(0, 400),
      label: `S${i + 1}`,
      metadata: c.metadata || {}
    }));

    const contextText = chunks.map((c, i) => `Source S${i + 1}:\n${c.content}`).join("\n\n");

    // OPTIONAL: include the local image path as example source if you want
    // example: add the uploaded file path as a source (the client/backend should rewrite /mnt/... -> http URL)
    // e.g., contextText += "\n\nImage: /mnt/data/d241a2c0-afe8-47f8-8bd8-a41f0c479efa.png"

    // 4) Ask Ollama LLM to generate an answer grounded in the sources
    const systemPrompt = `You are a helpful study assistant. Use ONLY the provided sources. Cite each fact with the source label like [S1], [S2]. If it is not in the sources, say "Not in your notes."`;

    const chatRes = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.CHAT_MODEL || "llama2-uncensored:latest",
        messages: [
          { role: "system", content: systemPrompt + "\n\nSources:\n" + contextText },
          { role: "user", content: message }
        ],
        stream: false
      })
    });

    const chatJson = await chatRes.json();
    const answer = chatJson?.message?.content || chatJson?.choices?.[0]?.message?.content || "No answer";

    // 5) Return answer and the source snippets for the frontend to show
    res.json({ answer, sources });

  } catch (err) {
    console.error("RAG error:", err);
    res.status(500).json({ error: "RAG error", details: err.message });
  }
});

export default router;
