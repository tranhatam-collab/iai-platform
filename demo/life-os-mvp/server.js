const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

function calculate(data) {
  const clarity = (data.focus + data.work) / 2;
  const stability = (data.sleep + (10 - data.stress)) / 2;
  const value = (data.work + data.contrib) / 2;
  const legacy = (data.contrib + data.rel) / 2;

  return { clarity, stability, value, legacy };
}

function suggest(d) {
  const actions = [];

  if (d.sleep < 5) actions.push("Fix sleep schedule");
  if (d.stress > 7) actions.push("Reduce workload");
  if (d.focus < 5) actions.push("Plan deep work");

  return actions;
}

app.post("/api/checkin", (req, res) => {
  const data = req.body;
  const metrics = calculate(data);
  const actions = suggest(data);

  res.json({...metrics, actions});
});

app.get("/api/runs", (_req, res) => {
  res.json([
    { flow: "Weekly check-in", status: "completed" },
    { flow: "Focus reset", status: "running" }
  ]);
});

app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
