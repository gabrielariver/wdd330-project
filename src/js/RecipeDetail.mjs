const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
const container = document.getElementById('recipeDetail');
const params = new URLSearchParams(window.location.search);
const recipeId = params.get('id');
let source = params.get('source');

// Normalize and validate
source = source ? source.toLowerCase() : null;

if (!container) {
  console.error("Missing container element #recipeDetail.");
} else if (!recipeId || !source) {
  container.innerHTML = '<p>Missing recipe ID or source.</p>';
} else {
  if (source === "spoonacular") {
    fetchSpoonacularRecipe(recipeId);
  } else if (source === "mealdb") {
    fetchMealDBRecipe(recipeId);
  } else {
    container.innerHTML = '<p>Unknown recipe source.</p>';
  }
}

async function fetchSpoonacularRecipe(id) {
  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");

    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error("The API did not return valid JSON");
    }

    const data = await response.json();

    container.innerHTML = `
      <h2>${data.title}</h2>
      <img src="${data.image}" alt="${data.title}" width="300" />
      <p><strong>Ready in:</strong> ${data.readyInMinutes} minutes</p>
      <p><strong>Servings:</strong> ${data.servings}</p>

      <h3>Ingredients:</h3>
      <ul>
        ${data.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}
      </ul>

      <h3>Instructions:</h3>
      <p>${data.instructions || "No instructions available."}</p>

      <button id="addFavorite"> Add to Favorites ❤️ </button>
      <button id="addShopping"> Add to Shopping List 🛒 </button>
    `;

    initButtons(data, 'spoonacular');

  } catch (error) {
    console.error("Error loading Spoonacular recipe:", error);
    container.innerHTML = "<p>Could not load recipe details. Please try again.</p>";
  }
}

async function fetchMealDBRecipe(id) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");

    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error("The API did not return valid JSON");
    }

    const data = await response.json();
    const recipe = data.meals?.[0];

    if (!recipe) throw new Error("Recipe not found");

    container.innerHTML = `
      <h2>${recipe.strMeal}</h2>
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" width="300" />
      <p><strong>Category:</strong> ${recipe.strCategory}</p>
      <p><strong>Area:</strong> ${recipe.strArea}</p>

      <h3>Ingredients:</h3>
      <ul>
        ${getMealDBIngredients(recipe).map(ing => `<li>${ing}</li>`).join('')}
      </ul>

      <h3>Instructions:</h3>
      <p>${recipe.strInstructions || "No instructions available."}</p>

      <button id="addFavorite"> Add to Favorites ❤️ </button>
      <button id="addShopping"> Add to Shopping List 🛒 </button>
    `;

    initButtons(recipe, 'mealdb');

  } catch (error) {
    console.error("Error loading MealDB recipe:", error);
    container.innerHTML = "<p>Could not load recipe details. Please try again.</p>";
  }
}

function getMealDBIngredients(recipe) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push(`${measure} ${ing}`.trim());
    }
  }
  return ingredients;
}

function initButtons(recipe, source) {
  document.getElementById('addFavorite')?.addEventListener('click', () => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push({ recipe, source });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert("Added to Favorites!");
  });

  document.getElementById('addShopping')?.addEventListener('click', () => {
    let shopping = JSON.parse(localStorage.getItem('shopping')) || [];
    let ingredients = [];

    if (source === 'spoonacular') {
      ingredients = recipe.extendedIngredients.map(ing => ing.original);
    } else if (source === 'mealdb') {
      ingredients = getMealDBIngredients(recipe);
    }

    shopping.push(...ingredients);
    localStorage.setItem('shopping', JSON.stringify(shopping));
    alert("Ingredients added to Shopping List!");
  });
}
