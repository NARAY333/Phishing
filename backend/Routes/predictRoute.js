// backend/Routes/predictRoute.js
const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");

router.post("/", (req, res) => {
  const { url } = req.body;

  if (!url || !url.trim()) {
    return res.status(400).json({ error: "URL is required." });
  }

  const python = spawn("python", ["./scripts/predict_url.py", url]);

  let output = "";
  let errorOutput = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  python.on("close", (code) => {
    if (code !== 0 || errorOutput) {
      console.error("Python Error:", errorOutput);
      return res.status(500).json({ error: "Prediction failed." });
    }
    try {
      const result = JSON.parse(output);
      return res.json(result);
    } catch (e) {
      console.error("JSON parse error:", e, "Output:", output);
      return res.status(500).json({ error: "Invalid prediction output." });
    }
  });
});

module.exports = router;
