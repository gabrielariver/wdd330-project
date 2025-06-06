const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
const container = document.getElementById('recipeDetail');

const params = new URLSearchParams(window.location.search);
const recipeId = params.get('id');

if (!recipeId || !apiKey) {
  container.innerHTML = '<p>Missing recipe ID or API key.</p>';
} else {
  fetchRecipeDetails(recipeId);
}

async function fetchRecipeDetails(id) {
  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    container.innerHTML = `
      <h2>${data.title}</h2>
      <img src="${data.image}" alt="${data.title}" width="300" />
      <p><strong>Ready in:</strong> ${data.readyInMinutes} minutes</p>
      <p><strong>Servings:</strong> ${data.servings}</p>
      <p><strong>Summary:</strong> ${data.summary}</p>
    `;
  } catch (error) {
    console.error("Error loading recipe details:", error);
    container.innerHTML = "<p>Could not load recipe details. Please try again.</p>";
  }
}
