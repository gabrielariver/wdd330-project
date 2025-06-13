const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
const container = document.getElementById('recipeDetail');
const params = new URLSearchParams(window.location.search);
const recipeId = params.get('id');
let source = params.get('source');

//normalized source to see recipe
source = source ? source.toLowerCase() : null;

if (!recipeId || !source) {
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

// spoonacular
async function fetchSpoonacularRecipe(id) {
  const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
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
    console.error("Error loading recipe details:", error);
    container.innerHTML = "<p>Could not load recipe details. Please try again.</p>";
  }
}

// mealdb
async function fetchMealDBRecipe(id) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const recipe = data.meals[0];

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

// mealdb 
function getMealDBIngredients(recipe) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure} ${ingredient}`.trim());
    }
  }
  return ingredients;
}

// add to favorites and shopping list
function initButtons(recipe, source) {
  document.getElementById('addFavorite').addEventListener('click', () => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push({ recipe, source });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert("Added to Favorites!");
  });

  document.getElementById('addShopping').addEventListener('click', () => {
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
