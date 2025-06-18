document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("preferencesForm");
  const dietSelect = document.getElementById("diet");
  const intolerancesInput = document.getElementById("intolerances");
  const savedMsg = document.getElementById("savedMsg");
  const displayDiet = document.getElementById("displayDiet");
  const displayIntolerances = document.getElementById("displayIntolerances");
  const clearBtn = document.getElementById("clearPreferences");

  // display preferences forms
  function displayPreferences() {
    const saved = JSON.parse(localStorage.getItem("userPreferences"));
    if (displayDiet) {
      displayDiet.textContent = `Diet: ${saved?.diet || "—"}`;
    }
    if (displayIntolerances) {
      displayIntolerances.textContent = `Intolerances: ${saved?.intolerances || "—"}`;
    }
  }

  // update preferences form
  const saved = JSON.parse(localStorage.getItem("userPreferences"));
  if (saved) {
    dietSelect.value = saved.diet || "";
    intolerancesInput.value = saved.intolerances || "";
  }

  // save preferences
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.textContent = "";
  
    const intolerances = intolerancesInput.value.trim();
  
    // Validation: only letters, spaces, commas
    const invalidChars = /[^a-zA-Z,\s]/.test(intolerances);
    const tooLong = intolerances.length > 100;
  
    if (invalidChars) {
      errorMsg.textContent = "Only letters and commas are allowed (e.g. dairy, peanut).";
      return;
    }
  
    if (tooLong) {
      errorMsg.textContent = "Intolerances list is too long. Keep it under 100 characters.";
      return;
    }
  
    const preferences = {
      diet: dietSelect.value,
      intolerances: intolerances.toLowerCase()
    };
  
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    savedMsg.style.display = "block";
    setTimeout(() => savedMsg.style.display = "none", 2000);
    displayPreferences();
  });
  

  // Clean preferences
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("userPreferences");
      dietSelect.value = "";
      intolerancesInput.value = "";
      displayPreferences();
      alert("Preferences cleared.");
    });
  }

  
  displayPreferences();
});
