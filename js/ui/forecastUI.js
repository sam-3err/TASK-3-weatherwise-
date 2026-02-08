const canvas = document.getElementById("forecastChart");
const ctx = canvas.getContext("2d");

export function renderForecast(list) {
  const daily = [];

  for (let i = 0; i < list.length; i += 8) {
    daily.push({
      temp: Math.round(list[i].main.temp),
      day: new Date(list[i].dt_txt).toLocaleDateString("en-US", {
        weekday: "short"
      })
    });
  }

  drawGraph(daily);
}

function drawGraph(data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const padding = 60;
  const w = canvas.width;
  const h = canvas.height;
  const temps = data.map(d => d.temp);
  const max = Math.max(...temps) + 3;
  const min = Math.min(...temps) - 3;

  // Background grid
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding + i * ((h - padding * 2) / 4);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    ctx.stroke();
  }

  // Build points
  const points = data.map((d, i) => {
    const x = padding + i * ((w - padding * 2) / (data.length - 1));
    const y = h - padding -
      ((d.temp - min) / (max - min)) * (h - padding * 2);
    return { x, y, ...d };
  });

  // Line stroke
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  const lineGrad = ctx.createLinearGradient(padding, 0, w - padding, 0);
  lineGrad.addColorStop(0, "#36f5d7");
  lineGrad.addColorStop(1, "#58a7ff");
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 4;
  ctx.shadowColor = "rgba(60, 214, 255, 0.35)";
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Fill area under curve
  ctx.lineTo(points[points.length - 1].x, h - padding);
  ctx.lineTo(points[0].x, h - padding);
  ctx.closePath();
  const fillGrad = ctx.createLinearGradient(0, padding, 0, h - padding);
  fillGrad.addColorStop(0, "rgba(53, 245, 215, 0.25)");
  fillGrad.addColorStop(1, "rgba(53, 245, 215, 0)");
  ctx.fillStyle = fillGrad;
  ctx.fill();

  // Points + labels
  ctx.fillStyle = "#ffffff";
  ctx.font = "12px Inter, sans-serif";
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#101217";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#36f5d7";
    ctx.stroke();

    ctx.fillStyle = "#cfefff";
    ctx.textAlign = "center";
    ctx.fillText(`${p.temp}°`, p.x, p.y - 10);
    ctx.fillStyle = "#9fb3c8";
    ctx.fillText(p.day, p.x, h - padding + 18);
  });
}
