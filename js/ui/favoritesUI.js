import { store, updateFavorites } from "../state/store.js";

export function renderFavorites() {
  const list = document.getElementById("favorites");
  if (!list) return;

  list.innerHTML = "";

  if (!store.favorites.length) {
    const empty = document.createElement("p");
    empty.textContent = "No favorites yet";
    empty.style.color = "#666";
    list.appendChild(empty);
    return;
  }

  store.favorites.forEach(city => {
    const item = document.createElement("p");
    item.textContent = city;
    item.addEventListener("click", () => {
      const input = document.getElementById("search-input");
      const searchBtn = document.getElementById("search-btn");
      if (input) input.value = city;
      if (searchBtn) searchBtn.click();
    });
    list.appendChild(item);
  });
}

export function toggleFavorite(city) {
  let favs = [...store.favorites];

  if (favs.includes(city)) {
    favs = favs.filter(c => c !== city);
  } else {
    favs.push(city);
  }

  updateFavorites(favs);
  renderFavorites();
  updateStar();
}

export function updateStar() {
  const favBtn = document.getElementById("fav-btn");
  if (!favBtn || !store.city) return;

  favBtn.classList.toggle(
    "active",
    store.favorites.includes(store.city)
  );

  favBtn.textContent = store.favorites.includes(store.city) ? "★" : "☆";
}
