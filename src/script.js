/*
*      Name:       Francesca Ysabelle Galang
*      Student ID: 101257236
*      Date:       April 13, 2024
*/

//API urls
const randomMealUrl = 'https://www.themealdb.com/api/json/v1/1/random.php';
const categoriesUrl = 'https://www.themealdb.com/api/json/v1/1/categories.php';

const favRecipes = [];

//Main div for dynamic elements
const div=document.getElementById('meal');
const info=document.getElementById('inform');
const table=document.getElementById('ingredient-table');

//When the DOM is loaded, the getMealCategories func is called
document.addEventListener('DOMContentLoaded', loadMealCategories);

//The user's selected category
const categorySelect=document.getElementById('select-category');

//Loads the Meal Categories for the selection
function loadMealCategories(){
    fetch(categoriesUrl)
    .then(response => response.json())
    .then(data =>{
        
        let categories=data.categories;
        for (let i = 0; i < categories.length; i++){
            const category=categories[i].strCategory;
            const option=document.createElement('option');
            option.value=category
            option.textContent=category;
            categorySelect.appendChild(option);
        }
    })
}

//Search for the selected category
const catButton = document.getElementById('category-btn').addEventListener('click', getMealByCategory)

//Based on the user's category selection: the data is filtered using modified API link
function getMealByCategory(){
    const chosenCat=categorySelect.value;

    const url=`https://www.themealdb.com/api/json/v1/1/filter.php?c=${chosenCat}`
    if(categorySelect.value != "None"){
        info.innerHTML='';
        fetch(url)
        .then(response => response.json())
        .then(data =>{
            displayCategoryMeals(data.meals);
        });
    } else {
        div.innerHTML='';
    }
};


//Displays each meal as cards
function displayCategoryMeals(c){

    div.innerHTML='';

    c.forEach(category =>{
        createCard(category);
    })
}

function createCard(category, type){
    var card = document.createElement('div');
    card.classList.add('card');
    card.id=`${category.strMeal}card`

    const mealName = document.createElement('h3');
    mealName.textContent = category.strMeal;
    card.appendChild(mealName);
    
    // Display the meal image
    var image=document.createElement('img');
    image.classList.add('card-img');
    image.src=category.strMealThumb;
    card.appendChild(image);

    const button = document.createElement(`button`);
    button.onclick = () => filterByMealID(category.idMeal, true, "card");
    button.textContent="View Recipe"
    card.appendChild(button);

    if (type==="recipe"){
        const remove = document.createElement(`button`);

        remove.onclick = () => {
            card.remove();
             for(let i = 0; i < favRecipes.length; i++){
                if(favRecipes[i] === category.idMeal){
                    favRecipes.splice(i, 1);
                }
                
            }
        };
        remove.textContent="Remove Recipe";
        card.appendChild(remove);

        card.style.height='250%'
    }
    
    div.appendChild(card)
}

//Uses "Lookup full meal details by id" API link to display meal
function filterByMealID(num, clear, type) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${num}`;
    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (clear === true){
                div.innerHTML=''
            }
            if (type === "card"){
                //displays meal details
                displayMeal(data.meals[0]);
            } else if (type === "recipe"){
                //displays cards - for Recipe List
                createCard(data.meals[0], "recipe");
            }

        })
}

document.getElementById('random-meal-btn').addEventListener('click', getRandomMeal);

//Uses "Lookup a single random meal" API link to fetch data
function getRandomMeal() {
    // Fetch the data
    fetch(randomMealUrl)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            //clears the div
            div.textContent='';
            //displays the meal details
            displayMeal(meal);
        })
};

//displays meal details
function displayMeal(meal) {
    //clears the info div
    info.innerHTML='';

    //create randMealDiv container
    const randMealDiv = document.createElement('div');
    randMealDiv.classList="randMeal";

    // Display the meal name
    const mealName = document.createElement('h3');
    mealName.textContent = meal.strMeal;
    randMealDiv.appendChild(mealName);
    
    // Display the meal image
    var image=document.createElement('img');
    image.src=meal.strMealThumb;
    randMealDiv.appendChild(image);

    var br=document.createElement('br');
    randMealDiv.appendChild(br);
    
    //Creates button to add meal to user's Recipe list
    var add=document.createElement('button');
    add.textContent='Add to Your Recipes';
    add.onclick = () => {
        favRecipes.push(meal.idMeal);
        console.log(favRecipes);

        var addedAlert=document.createElement('h4');
        addedAlert.textContent=`"${meal.strMeal}" Added to Your Recipes`;
        randMealDiv.appendChild(addedAlert);

        add.disabled=true;

    };

    randMealDiv.appendChild(add);
    
    //Create recipeDiv container
    const recipeDiv = document.createElement('div');
    recipeDiv.classList="recipeDiv"; 
    recipeDiv.id="recipeDiv"

    //Display Link to YouTube video
    var youtubeLink=document.createElement('a');
    youtubeLink.href=meal.strYoutube;
    youtubeLink.target="-blank" //opens in a new tab
    var br=document.createElement('br');
    recipeDiv.appendChild(br);

    youtubeLink.textContent="Learn How To Make: " + meal.strMeal;
    recipeDiv.appendChild(youtubeLink);
    
    //Display instructions of how to make meal
    instructions=document.createElement('p');
    instructions.innerHTML=meal.strInstructions;
    recipeDiv.append(instructions);

    const mealTable = document.createElement('table');
    
    //Creating Recipe Table
    var tr=document.createElement('tr');
    var thIng=document.createElement('th');
    thIng.textContent="Ingredients"
    var thMeasure=document.createElement('th');
    thMeasure.textContent="Measurements"
    tr.appendChild(thIng);
    tr.appendChild(thMeasure);
    console.log(tr);
    console.log(mealTable);
    mealTable.appendChild(tr);

    //loops through all ingredients list from API data
    for (let i = 0; i < 20; i++){
        var ing=meal[`strIngredient${i}`]
        var measure=meal[`strMeasure${i}`]
        
        //only prints the keys with valid information
        if(ing != '' && measure != ''){
            var row = document.createElement('tr');
            
            var ingredientCell=document.createElement('td');
            ingredientCell.textContent=ing;
            
            var measurementCell=document.createElement('td');
            measurementCell.textContent=measure;
            
            row.appendChild(ingredientCell);
            row.appendChild(measurementCell);
            mealTable.appendChild(row);
        }
    }

    var br=document.createElement('br');
    recipeDiv.appendChild(br);
    recipeDiv.appendChild(mealTable);

    //appending div container elements to main "meal" div
    div.appendChild(randMealDiv);
    div.appendChild(recipeDiv);
}

const viewButton = document.getElementById("view-btn").addEventListener('click', viewRecipes)

//View Your Recipes
function viewRecipes(){
    //the array is empty
    if(favRecipes.length == 0){
        console.log("empty");
        alert("Your Recipe List is Empty \n Search for meals and Add to Your List \n Or \'Generate a Random Meal\'")
    } else {
        //clears the div
        div.textContent='';
        //loops through the array to display and filter by MealID
        favRecipes.forEach(function (recipe){
            filterByMealID(recipe, false, "recipe");
        });
    }
}