const container = document.getElementById("plannerContainer");

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

document.addEventListener("DOMContentLoaded", () => {
  renderPlanner();
});

function renderPlanner() {
  container.innerHTML = "";

  days.forEach(day => {
    const daySection = document.createElement("div");
    daySection.classList.add("planner-day");

    const label = document.createElement("h3");
    label.textContent = day;

    const assignedRecipe = getAssignedRecipe(day);

    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("assigned-recipe");

    if (assignedRecipe) {
      recipeDiv.innerHTML = `
        <p>${assignedRecipe.title}</p>
        <button data-day="${day}" class="remove-btn">Remove</button>
      `;
    } else {
      recipeDiv.innerHTML = `<button data-day="${day}" class="assign-btn">Assign Recipe</button>`;
    }

    daySection.appendChild(label);
    daySection.appendChild(recipeDiv);
    container.appendChild(daySection);
  });

  document.querySelectorAll(".assign-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const selectedDay = e.target.dataset.day;
      assignRecipe(selectedDay);
    });
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const selectedDay = e.target.dataset.day;
      removeRecipe(selectedDay);
    });
  });
}

function getAssignedRecipe(day) {
  const planner = JSON.parse(localStorage.getItem("planner")) || {};
  return planner[day];
}

function assignRecipe(day) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    alert("No recipes in favorites.");
    return;
  }

  const recipeTitles = favorites.map((r, i) => `${i + 1}: ${r.recipe?.title || "Untitled"}`).join("\n");
  const choice = prompt(`Select recipe for ${day}:\n${recipeTitles}`);

  const selectedIndex = parseInt(choice) - 1;
  if (selectedIndex >= 0 && selectedIndex < favorites.length) {
    const planner = JSON.parse(localStorage.getItem("planner")) || {};
    planner[day] = favorites[selectedIndex].recipe;
    localStorage.setItem("planner", JSON.stringify(planner));
    renderPlanner();
  } else {
    alert("Invalid selection.");
  }
}

function removeRecipe(day) {
  const planner = JSON.parse(localStorage.getItem("planner")) || {};
  delete planner[day];
  localStorage.setItem("planner", JSON.stringify(planner));
  renderPlanner();
}
