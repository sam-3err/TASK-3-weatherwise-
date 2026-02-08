import { fetchWeather, fetchForecast } from "./weatherApi.js";
import { store } from "./state/store.js";
import { renderWeather } from "./ui/weatherUI.js";
import { renderForecast } from "./ui/forecastUI.js";
import {
  toggleFavorite,
  renderFavorites,
  updateStar
} from "./ui/favoritesUI.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");

  const searchBtn = document.getElementById("search-btn");
  const input = document.getElementById("search-input");
  const favBtn = document.getElementById("fav-btn");

  if (!searchBtn || !input) {
    console.error("Search input or button not found");
    return;
  }

  searchBtn.addEventListener("click", searchCity);


  input.addEventListener("keydown", e => {
    if (e.key === "Enter") searchCity();
  });


  if (favBtn) {
    favBtn.addEventListener("click", () => {
      if (store.city) toggleFavorite(store.city);
    });
  }

  renderFavorites();
  updateStar();
});

async function searchCity() {
  const input = document.getElementById("search-input");
  const city = input.value.trim();
  if (!city) return;

  try {
    const weather = await fetchWeather(city);
    const forecast = await fetchForecast(city);

    store.city = city;
    store.weather = weather;
    store.forecast = forecast.list;

document.getElementById("welcome-text").style.display = "none";
document.getElementById("weather-content").classList.add("show");
document.getElementById("forecast-section").classList.add("show");


    renderWeather(weather);
    renderForecast(forecast.list);
    renderFavorites();
    updateStar();

    input.value = "";
  } catch (err) {
    alert(err.message || "City not found");
  }
}

