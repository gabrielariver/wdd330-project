document.addEventListener("DOMContentLoaded", () => {
  const spoonKey = import.meta.env.VITE_SPOONACULAR_KEY;

  const searchBtn = document.getElementById('searchBtn');
  const input = document.getElementById('searchInput');
  const container = document.getElementById('resultsContainer');

  searchBtn.addEventListener('click', async () => {
    const query = input.value.trim();
    if (!query) return;

    container.innerHTML = "<p>Loading...</p>";

    try {
      // const spoonResults = await fetchSpoonacular(query, spoonKey);

      const mealDBResults = await fetchMealDB(query);

      // const combinedResults = [...spoonResults, ...mealDBResults];
      const combinedResults = [...mealDBResults];

      renderResults(combinedResults);
    } catch (error) {
      console.error("API error:", error);
      container.innerHTML = "<p>Something went wrong. Try again later.</p>";
    }
  });

  // spoonacular temporarily disabled
  async function fetchSpoonacular(query, apiKey) {
    const url = `/spoonacular/recipes/complexSearch?query=${query}&number=10&addRecipeInformation=true&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    return data.results.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes || 'N/A',
      servings: recipe.servings || 'N/A',
      source: "spoonacular"
    }));
  }

  // mealdb active
  async function fetchMealDB(query) {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.meals) {
      return [];
    }

    return data.meals.map(meal => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      readyInMinutes: 'N/A',
      servings: 'N/A',
      source: "mealdb" 
    }));
  }

  function renderResults(results) {
    container.innerHTML = "";

    results.forEach(recipe => {
      const card = document.createElement("div");
      card.classList.add("card-link");

      card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}" width="100">
        <h3>${recipe.title}</h3>
        <p><strong>Servings:</strong> ${recipe.servings}</p>
        <p><strong>Source:</strong> ${recipe.source}</p>
      `;

      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        window.location.href = `/recipe.html?source=${recipe.source}&id=${recipe.id}`;
      });

      container.appendChild(card);
    });
  }
});