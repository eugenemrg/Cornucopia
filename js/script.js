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
    dish.addEventListener('click', (e) => {
        populateRecipe(meal)
    })

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

function populateRecipe(mealObject) {
    const ingredients = document.querySelector('.recipe-ingredients')
    const instructions = document.querySelector('.instructions-text')
    const tags = document.querySelector('.recipe-tags')

    // Clear elements
    ingredients.innerText = ''

    const recipeObject = cleanAndFormatRecipeDetails(mealObject)

    document.querySelector('.recipe-name').innerText = recipeObject.strMeal
    document.querySelector('.recipe-origin').innerText = recipeObject.strArea
    document.querySelector('.recipe-category').innerText = recipeObject.strCategory
    document.querySelector('.recipe-thumbnail').src = recipeObject.strMealThumb

    if(recipeObject.strTags !== undefined){
        tags.innerText = 'Tags:'
        recipeObject.strTags.split(',').forEach(item => {
            let tagItem = document.createElement('span')
            tagItem.className = 'tag'
            tagItem.innerText = item
            tags.appendChild(tagItem)
        })
    }else{
        tags.innerText = 'Tags: No tags found'
    }

    recipeObject.ingredients.forEach(item => {
        let ingredient = document.createElement('p')
        ingredient.className = 'ingredient-item'
        ingredient.innerText = item
        ingredients.append(ingredient)
    })

    instructions.innerHTML = recipeObject.strInstructions
}

function cleanAndFormatRecipeDetails(mealObject) {
    const cleanObject = {}
    Object.keys(mealObject).forEach(key => {
        if (mealObject[key] !== undefined && mealObject[key] !== null && mealObject[key] != '') {
            cleanObject[key] = mealObject[key]
        }
    })

    const formattedObject = {}
    formattedObject.ingredients = []

    Object.keys(cleanObject).forEach(key => {
        if (key === 'strInstructions') {
            formattedObject[key] = cleanObject[key].replace(/(\r\n|\r|\n)/g, '<br>')
        } else if (!key.startsWith('strIngredient') && !key.startsWith('strMeasure')) {
            formattedObject[key] = cleanObject[key]
        } else {
            if (key.startsWith('strIngredient')) {
                let index = key.replace('strIngredient', '')
                let quantity = cleanObject[`strMeasure${index}`]
                let ingredient = cleanObject[key]
                formattedObject.ingredients.push(`${quantity} ${ingredient}`)
            }
        }
    })

    return formattedObject
}