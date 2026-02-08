export const store = {
  city: null,
  weather: null,
  forecast: [],
  favorites: JSON.parse(localStorage.getItem("favs")) || []
};

export function updateFavorites(favs) {
  store.favorites = favs;
  localStorage.setItem("favs", JSON.stringify(favs));
}
