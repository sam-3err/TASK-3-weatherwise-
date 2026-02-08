const API_KEY = "f9f9fe84b1ac5bb42c671723c3a5c9be";
const searchBtn = document.getElementById("search-btn");
const input = document.getElementById("search-input");

const weatherContent = document.getElementById("weather-content");
const welcomeText = document.getElementById("welcome-text");
const forecastSection = document.getElementById("forecast-section");

const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const tempInfo = document.getElementById("temp-info");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

const favBtn = document.getElementById("fav-btn");
const favContainer = document.getElementById("favorites");

const canvas = document.getElementById("forecastChart");
const ctx = canvas.getContext("2d");

weatherContent.style.display = "none";
forecastSection.style.display = "none";
renderFavorites();


searchBtn.addEventListener("click", searchCity);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") searchCity();
});
favBtn.addEventListener("click", toggleFavorite);


function searchCity() {
  const city = input.value.trim();
  if (!city) return;
  loadWeather(city);
  input.value = "";
}

async function loadWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();

    
    welcomeText.style.display = "none";
    weatherContent.style.display = "block";
    forecastSection.style.display = "block";

   
    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    condition.textContent = data.weather[0].description;
    tempInfo.textContent = `${Math.round(data.main.temp)}°C`;
    humidityEl.textContent = `${data.main.humidity}%`;
    windEl.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;

    
    const favs = JSON.parse(localStorage.getItem("favs")) || [];
    const isFav = favs.includes(data.name);
    favBtn.textContent = isFav ? "★" : "☆";
    favBtn.classList.toggle("active", isFav);

    loadForecast(data.name);

  } catch (err) {
    alert(err.message);
  }
}

async function loadForecast(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
  );
  const data = await res.json();

  const dailyData = [];
  for (let i = 0; i < data.list.length; i += 8) {
    dailyData.push({
      temp: Math.round(data.list[i].main.temp),
      day: new Date(data.list[i].dt_txt).toLocaleDateString("en-US", {
        weekday: "short"
      })
    });
  }

  drawGraph(dailyData);
}


function drawGraph(data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const padding = 60;
  const temps = data.map(d => d.temp);
  const max = Math.max(...temps) + 3;
  const min = Math.min(...temps) - 3;

  const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bg.addColorStop(0, "#141418");
  bg.addColorStop(1, "#0b0b0f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  lineGradient.addColorStop(0, "#18e0c4");
  lineGradient.addColorStop(1, "#4facfe");

  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.shadowColor = "#18e0c4";
  ctx.shadowBlur = 12;

  ctx.beginPath();

  const points = [];

  data.forEach((item, i) => {
    const x =
      padding +
      i * ((canvas.width - padding * 2) / (data.length - 1));
    const y =
      canvas.height -
      padding -
      ((item.temp - min) / (max - min)) *
        (canvas.height - padding * 2);

    points.push({ x, y, item });

    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });

  ctx.stroke();
  ctx.shadowBlur = 0;


  ctx.beginPath();
  ctx.moveTo(points[0].x, canvas.height - padding);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, canvas.height - padding);
  ctx.closePath();

  const fillGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  fillGradient.addColorStop(0, "rgba(24,224,196,0.35)");
  fillGradient.addColorStop(1, "rgba(24,224,196,0)");

  ctx.fillStyle = fillGradient;
  ctx.fill();


  points.forEach(p => {
    // Point
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

   
    ctx.fillStyle = "#18e0c4";
    ctx.font = "14px Inter";
    ctx.fillText(`${p.item.temp}°`, p.x - 10, p.y - 12);

    ctx.fillStyle = "#bfbfbf";
    ctx.font = "13px Inter";
    ctx.fillText(p.item.day, p.x - 14, canvas.height - 20);
  });
}

function toggleFavorite() {
  const city = cityName.textContent;
  if (!city || city === "Search a city") return;

  let favs = JSON.parse(localStorage.getItem("favs")) || [];

  if (favs.includes(city)) {
    favs = favs.filter(c => c !== city);
    favBtn.textContent = "☆";
    favBtn.classList.remove("active");
  } else {
    favs.push(city);
    favBtn.textContent = "★";
    favBtn.classList.add("active");
  }

  localStorage.setItem("favs", JSON.stringify(favs));
  renderFavorites();
}

function renderFavorites() {
  favContainer.innerHTML = "";
  const favs = JSON.parse(localStorage.getItem("favs")) || [];

  favs.forEach(city => {
    const p = document.createElement("p");
    p.textContent = city;
    p.onclick = () => loadWeather(city);
    favContainer.appendChild(p);
  });
}
