document.addEventListener('DOMContentLoaded', (e) => {

    showFeatured()

    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault()

        // validate user input
        if (document.getElementById('input').value.trim().length !== 0) {
            handleSearch()
        } else {
            document.getElementById('input').value = ''
        }
    })
})

function showFeatured() {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
        .then(res => res.json())
        .then(data => {

            let featuredContainer = document.querySelector('.featured')
            featuredContainer.innerText = ''

            data.meals.forEach(meal => {
                populateAndAppendCards(featuredContainer, meal)
            })
        })
}

function handleSearch() {
    // Show loading icon
    const searchIcon = document.querySelector('form .fa-solid')
    searchIcon.className = 'fa-solid fa-circle-notch fa-spin fa-2x'

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${document.getElementById('input').value}`)
        .then(res => res.json())
        .then(data => {

            const resultsContainer = document.querySelector('.results')
            resultsContainer.innerText = ''

            data.meals.forEach(meal => {
                populateAndAppendCards(resultsContainer, meal)
            });

            // Show search icon after loading is complete
            searchIcon.className = 'fa-solid fa-magnifying-glass fa-2x'
        })
        .catch(err => {
            // Show search icon after loading is complete
            searchIcon.className = 'fa-solid fa-magnifying-glass fa-2x'
            console.error(err)
        })
}

function showRandom() {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(res => res.json())
        .then(data => {
            const mealsArray = data.meals
            let randomDishContainer = document.querySelector('.random')
            randomDishContainer.innerText = ''

            mealsArray.forEach(meal => {
                populateAndAppendCards(randomDishContainer, meal)
            })
        })
}

/**
 * Generate card containing meal details using meal object passed as second parameter, 
 * append generated card to container element passed as first parameter
 * 
 * @param {Element} containerElement Element holding the generated cards
 * @param {object} meal Meal object containing details about meal to be added to generated card
 */
function populateAndAppendCards(containerElement, meal) {
    const dish = document.createElement('div')
    dish.className = 'dish'

    const thumbnail = document.createElement('img')
    thumbnail.className = 'meal-thumbnail'
    thumbnail.src = meal.strMealThumb
    thumbnail.alt = meal.strMealThumb

    const mealName = document.createElement('p')
    mealName.className = 'meal-name'
    mealName.innerText = meal.strMeal

    const mealOrigin = document.createElement('p')
    mealOrigin.className = 'meal-origin'
    mealOrigin.innerText = meal.strArea

    const mealCategory = document.createElement('p')
    mealCategory.className = 'meal-category'
    mealCategory.innerText = meal.strCategory

    const recipeLink = document.createElement('p')
    recipeLink.className = 'meal-recipe'
    recipeLink.innerText = 'Show recipe'

    const recipeLinkIcon = document.createElement('i')
    recipeLinkIcon.className = 'fa-solid fa-chevron-right'

    recipeLink.appendChild(recipeLinkIcon)
    dish.appendChild(thumbnail)
    dish.appendChild(mealName)
    dish.appendChild(mealOrigin)
    dish.appendChild(mealCategory)
    dish.appendChild(recipeLink)

    containerElement.appendChild(dish)
}