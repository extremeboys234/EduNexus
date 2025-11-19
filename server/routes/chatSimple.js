import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/simple", async (req, res) => {
  const { message } = req.body;

  if (!message) return res.json({ answer: "No message received." });

  try {
    const llmRes = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama2-uncensored:latest",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message }
        ],
        stream: false
      })
    });

    const data = await llmRes.json();

    const answer =
      data?.message?.content ||
      data?.choices?.[0]?.message?.content ||
      "AI gave no response.";

    res.json({ answer });

  } catch (err) {
    console.log("AI ERROR:", err);
    res.json({ answer: "AI offline or unreachable." });
  }
});

export default router;
