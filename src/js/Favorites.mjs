const container = document.getElementById("favoritesContainer");

function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    container.innerHTML = "<p>You have no favorite recipes yet.</p>";
    return;
  }

  const grid = document.createElement("div");
  grid.classList.add("favorites-grid");

  favorites.forEach(fav => {
    let recipe;
    let source;

    if (fav.recipe && fav.source) {
      recipe = fav.recipe;
      source = fav.source;
    } else {
      recipe = fav;
      source = "Spoonacular";
    }

    const card = document.createElement("div");
    card.classList.add("favorite-card");
    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
      const realId = recipe.id || recipe.idMeal;
      window.location.href = `recipe.html?source=${source}&id=${realId}`;
    });

    card.innerHTML = `
      <img src="${recipe.image || recipe.strMealThumb}" alt="${recipe.title || recipe.strMeal}" />
      <h3>${recipe.title || recipe.strMeal}</h3>
      <p><strong>Source:</strong> ${source}</p>
    `;

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

document.addEventListener("DOMContentLoaded", loadFavorites);
