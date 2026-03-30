function startCheckin() {
  document.getElementById("checkinForm").style.display = "block";
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

  clarity.innerText = "Clarity: " + result.clarity;
  stability.innerText = "Stability: " + result.stability;
  value.innerText = "Value: " + result.value;
  legacy.innerText = "Legacy: " + result.legacy;

  actions.innerHTML = `
    <h3>This Week</h3>
    <ul>
      ${result.actions.map(a=>`<li>${a}</li>`).join("")}
    </ul>
  `;
}
