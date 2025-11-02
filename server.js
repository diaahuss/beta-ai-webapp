// server.js
const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// AI endpoint
app.post("/api/ai", async (req, res) => {
  const { message } = req.body;

  if (!OPENAI_KEY) {
    return res.status(500).json({ response: "Missing API key on server." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Theo is a friendly health companion." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error("Invalid response from OpenAI");
    }

    const aiReply = data.choices[0].message.content;
    res.json({ response: aiReply });
  } catch (error) {
    console.error("❌ AI request error:", error.message);
    res.json({ response: "Theo: Sorry, I couldn’t reach the AI right now." });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
