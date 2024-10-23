const searchBox = document.querySelector("#search-box");
const searchBtn = document.querySelector("#search-btn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeContent = document.querySelector(".recipe-content");
const closeBtn = document.querySelector(".closeBtn");

let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

async function getMeal(food) {
  recipeContainer.innerHTML = "<h2>Loading Recipes...</h2>";
  try {
    let res = await axios.get(url + food);
    return res.data.meals;
  } catch (err) {
    console.log("error is ", err);
    return "No meal found";
  }
}

function showRecipe(recipe) {
  recipeContainer.innerHTML = "";
  for (const resp of recipe) {
    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipeBox");

    recipeDiv.innerHTML = `
      <img src="${resp.strMealThumb}">
      <h3>${resp.strMeal}</h3>
      <p><span>${resp.strArea}</span> Dish</p>
      <p>Belongs to <span>${resp.strCategory}</span> Category</p>
    `;

    const btn = document.createElement("button");
    btn.textContent = "View Recipe";
    recipeDiv.appendChild(btn);
    recipeContainer.appendChild(recipeDiv);

    // Adding EventListener to recipe popup btn
    btn.addEventListener("click", () => {
      recipePopup(resp);
    });
  }
}

/* function to get Ingredients */
const getIngredients = (resp) => {
  let ingredientLists = "";

  for (let i = 1; i <= 20; i++) {
    const ingredient = resp[`strIngredient${i}`];
    if (ingredient) {
      const measure = resp[`strMeasure${i}`];
      ingredientLists += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientLists;
};

const recipePopup = (resp) => {
  recipeContent.innerHTML = `
    <h2 class="recipeName">${resp.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingdLists">${getIngredients(resp)}</ul>
    <div class="recpInstructions">
      <h3>Instructions</h3>
      <p>${resp.strInstructions}</p>
    </div>
  `;
  recipeContent.parentElement.style.display = "block";
};

closeBtn.addEventListener("click", () => {
  recipeContent.parentElement.style.display = "none";
});

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  let food = searchBox.value;
  if (!food) {
    recipeContainer.innerHTML = "<h2>Type the meal in the search box<h2>";
    return;
  }
  let recipe = await getMeal(food);
  if (recipe) {
    showRecipe(recipe);
  } else {
    recipeContainer.innerHTML = "<h2>No meal found</h2>";
  }
});
