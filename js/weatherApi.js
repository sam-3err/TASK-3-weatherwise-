const API_KEY = "f9f9fe84b1ac5bb42c671723c3a5c9be";
const BASE = "https://api.openweathermap.org/data/2.5";

export async function fetchWeather(city) {
  const res = await fetch(
    `${BASE}/weather?q=${city}&units=metric&appid=${API_KEY}`
  );
  if (!res.ok) throw new Error("City not found");
  return res.json();
}

export async function fetchForecast(city) {
  const res = await fetch(
    `${BASE}/forecast?q=${city}&units=metric&appid=${API_KEY}`
  );
  return res.json();
}
