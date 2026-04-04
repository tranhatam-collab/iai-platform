const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
const dbPath = path.join(__dirname, "life_os_mvp.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS life_checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      energy INTEGER,
      sleep INTEGER,
      stress INTEGER,
      focus INTEGER,
      work_clarity INTEGER,
      relationships INTEGER,
      contribution INTEGER,
      clarity REAL,
      stability REAL,
      value REAL,
      legacy REAL,
      actions_json TEXT,
      created_at TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flow TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
});

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
  const required = ["energy", "sleep", "stress", "focus", "work", "rel", "contrib"];
  const missing = required.filter((k) => Number.isNaN(Number(data[k])));
  if (missing.length > 0) {
    return res.status(400).json({ error: `Invalid fields: ${missing.join(", ")}` });
  }
  const metrics = calculate(data);
  const actions = suggest(data);
  const now = new Date().toISOString();
  const insertCheckin = `
    INSERT INTO life_checkins (
      energy, sleep, stress, focus, work_clarity, relationships, contribution,
      clarity, stability, value, legacy, actions_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(
    insertCheckin,
    [
      data.energy,
      data.sleep,
      data.stress,
      data.focus,
      data.work,
      data.rel,
      data.contrib,
      metrics.clarity,
      metrics.stability,
      metrics.value,
      metrics.legacy,
      JSON.stringify(actions),
      now
    ],
    (checkinErr) => {
      if (checkinErr) {
        return res.status(500).json({ error: "Failed to store check-in" });
      }
      db.run(
        "INSERT INTO runs (flow, status, created_at) VALUES (?, ?, ?)",
        ["Weekly check-in", "completed", now],
        (runErr) => {
          if (runErr) {
            return res.status(500).json({ error: "Failed to store run record" });
          }
          return res.json({ ...metrics, actions });
        }
      );
    }
  );
});

app.get("/api/runs", (_req, res) => {
  db.all(
    "SELECT id, flow, status, created_at FROM runs ORDER BY id DESC LIMIT 20",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Failed to load runs" });
      }
      return res.json(rows);
    }
  );
});

app.get("/api/checkins/latest", (_req, res) => {
  const sql = `
    SELECT * FROM (
      SELECT id, clarity, stability, value, legacy, created_at
      FROM life_checkins
      ORDER BY id DESC
      LIMIT 12
    ) recent
    ORDER BY id ASC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load check-in history" });
    }
    return res.json(rows);
  });
});

app.listen(3000, () => {
  console.log("Running on http://localhost:3000");
});
