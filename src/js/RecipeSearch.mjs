const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;

export function setupSearch() {
  const searchBtn = document.getElementById('searchBtn');
  const input = document.getElementById('searchInput');
  const container = document.getElementById('resultsContainer');

  searchBtn.addEventListener('click', async () => {
    const query = input.value.trim();
    if (!query || !apiKey) return;

    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&addRecipeInformation=true&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      container.innerHTML = "";

      data.results.forEach(recipe => {
        const card = document.createElement("div");
        card.classList.add("card-link");
        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
          window.location.href = `recipe.html?id=${recipe.id}`;
        });

        card.innerHTML = `
          <img src="${recipe.image}" alt="${recipe.title}" width="100">
          <h3>${recipe.title}</h3>
          <p><strong>Ready in:</strong> ${recipe.readyInMinutes} min</p>
          <p><strong>Servings:</strong> ${recipe.servings}</p>
        `;
        container.appendChild(card);
      });
    } catch (error) {
      console.error("API error:", error);
      container.innerHTML = "<p>Something went wrong. Try again later.</p>";
    }
  });
}
