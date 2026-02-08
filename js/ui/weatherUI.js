import { store } from "../state/store.js";

const weatherContent = document.getElementById("weather-content");
const welcomeText = document.getElementById("welcome-text");
const forecastSection = document.getElementById("forecast-section");

export function renderWeather(data) {
  welcomeText.style.display = "none";
  weatherContent.style.display = "block";
  forecastSection.style.display = "block";

  document.getElementById("city-name").textContent = data.name;
  document.getElementById("temperature").textContent =
    `${Math.round(data.main.temp)}°C`;
  document.getElementById("condition").textContent =
    data.weather[0].description;

  document.getElementById("temp-info").textContent =
    `${Math.round(data.main.temp)}°C`;
  document.getElementById("humidity").textContent =
    `${data.main.humidity}%`;
  document.getElementById("wind").textContent =
    `${Math.round(data.wind.speed * 3.6)} km/h`;
}
