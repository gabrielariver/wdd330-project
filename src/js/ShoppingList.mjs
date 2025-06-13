const container = document.getElementById("shoppingContainer");
const clearBtn = document.getElementById("clearList");

function loadShoppingList() {
  const shopping = JSON.parse(localStorage.getItem("shopping")) || [];

  if (shopping.length === 0) {
    container.innerHTML = "<p>Your shopping list is empty.</p>";
    return;
  }

  const list = document.createElement("ul");
  list.classList.add("shopping-list");

  shopping.forEach((item, index) => {
    const listItem = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const label = document.createElement("span");
    label.textContent = item;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.addEventListener("click", () => {
      deleteItem(index);
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(deleteBtn);

    list.appendChild(listItem);
  });

  container.innerHTML = "";
  container.appendChild(list);
}

function deleteItem(index) {
  let shopping = JSON.parse(localStorage.getItem("shopping")) || [];
  shopping.splice(index, 1);
  localStorage.setItem("shopping", JSON.stringify(shopping));
  loadShoppingList();
}

clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear your shopping list?")) {
    localStorage.removeItem("shopping");
    loadShoppingList();
  }
});

document.addEventListener("DOMContentLoaded", loadShoppingList);
