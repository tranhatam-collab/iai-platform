function startCheckin() {
  document.getElementById("checkinForm").style.display = "block";
}

function setMetricCards(item) {
  clarity.innerText = "Clarity: " + Number(item.clarity).toFixed(1);
  stability.innerText = "Stability: " + Number(item.stability).toFixed(1);
  value.innerText = "Value: " + Number(item.value).toFixed(1);
  legacy.innerText = "Legacy: " + Number(item.legacy).toFixed(1);
}

function drawTrendChart(rows) {
  const canvas = document.getElementById("trendChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  if (!rows || rows.length === 0) {
    ctx.fillStyle = "#b0b7c3";
    ctx.font = "16px Arial";
    ctx.fillText("No check-in trend data yet.", 20, 40);
    return;
  }

  const pad = 26;
  const min = 0;
  const max = 10;
  const chartW = w - pad * 2;
  const chartH = h - pad * 2;
  const xStep = rows.length > 1 ? chartW / (rows.length - 1) : 0;

  function yOf(value) {
    return pad + ((max - value) / (max - min)) * chartH;
  }

  ctx.strokeStyle = "#2d3243";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i += 1) {
    const y = pad + (chartH / 5) * i;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(w - pad, y);
    ctx.stroke();
  }

  function drawLine(key, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    rows.forEach((row, idx) => {
      const x = pad + xStep * idx;
      const y = yOf(Number(row[key]));
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  drawLine("clarity", "#4cafef");
  drawLine("stability", "#8bc34a");
  drawLine("value", "#ffc107");
  drawLine("legacy", "#ff7043");

  ctx.fillStyle = "#d8deea";
  ctx.font = "12px Arial";
  ctx.fillText("Clarity", pad, h - 8);
  ctx.fillText("Stability", pad + 70, h - 8);
  ctx.fillText("Value", pad + 150, h - 8);
  ctx.fillText("Legacy", pad + 205, h - 8);
}

async function loadLatestTrend() {
  const res = await fetch("/api/checkins/latest");
  const rows = await res.json();
  if (Array.isArray(rows) && rows.length > 0) {
    setMetricCards(rows[rows.length - 1]);
  }
  drawTrendChart(rows);
}

async function submitCheckin() {
  const data = {
    energy: +energy.value,
    sleep: +sleep.value,
    stress: +stress.value,
    focus: +focus.value,
    work: +work.value,
    rel: +rel.value,
    contrib: +contrib.value
  };

  const res = await fetch("/api/checkin", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });

  const result = await res.json();

  setMetricCards(result);

  actions.innerHTML = `
    <h3>This Week</h3>
    <ul>
      ${result.actions.map(a=>`<li>${a}</li>`).join("")}
    </ul>
  `;
  await loadLatestTrend();
}

loadLatestTrend();
