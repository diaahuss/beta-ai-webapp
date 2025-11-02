// server.js
const express = require("express");
const path = require("path");
const fetch = require("node-fetch"); // for API calls
require("dotenv").config(); // load .env

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Middleware to parse JSON bodies
app.use(express.json());

// AI endpoint
app.post("/api/ai", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Theo is a friendly health companion." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    res.json({ response: aiReply });

  } catch (error) {
    console.error(error);
    res.json({ response: "Theo: Sorry, I couldn’t reach the AI right now." });
  }
});

// Serve index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
