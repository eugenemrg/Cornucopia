document.addEventListener('DOMContentLoaded', (e) => {

    showFeatured()
    updateNavigationCategories()

    // Search event listener
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault()

        // validate user input
        if (document.getElementById('input').value.trim().length !== 0) {

            let searchCategory = document.getElementById('dropdown').value

            // handle search by type, check if any category is selected or not
            if (searchCategory === 'none') {
                handleSearch()
            } else {
                handleSearchByType(searchCategory)
            }
        } else {
            document.getElementById('input').value = ''
        }
    })

    document.getElementById('featured').addEventListener('click', (e) => {
        e.preventDefault()
        showFeatured()

        // Scroll section into view
        document.querySelector('.section-title').scrollIntoView()
    })

    document.getElementById('ingredients').addEventListener('click', (e) => {
        e.preventDefault()
        document.getElementById('dropdown').value = 'ingredient'
    })

    document.getElementById('random').addEventListener('click', (e) => {
        e.preventDefault()
        showRandom()

        // Scroll section into view
        document.querySelector('.section-title').scrollIntoView()
    })
})

// Fetch list of categories and add them to the category drop down on the navigation
function updateNavigationCategories() {

    // Get navigation categories drop-down container
    const categoryContainer = document.querySelector('.categories-items-container')
    categoryContainer.innerText = ''

    fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
        .then(res => res.json())
        .then(data => {
            data.meals.forEach(categoryObject => {

                // Create category element
                const category = document.createElement('p')
                category.innerText = categoryObject.strCategory;

                // Add click listener to category element to show meals in category when user clicks the category
                category.addEventListener('click', (e) => {
                    e.preventDefault()
                    showMealsForCategories(categoryObject)
                })

                // Append created category alement
                categoryContainer.append(category)
            })
        })
}

// Fetch and display featured meals
function showFeatured() {

    hideAllContainers()
    document.querySelector('#features-section').classList.remove('hide')
    document.querySelector('.section-title').innerText = 'featured'

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

// Display meals for selected meal category
function showMealsForCategories(categoryObject) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryObject.strCategory}`)
        .then(res => res.json())
        .then(data => {

            // Get the results container
            const resultsContainer = document.querySelector('.results')
            resultsContainer.innerText = ''

            // Change the section title
            document.querySelector('.section-title').innerText = `${categoryObject.strCategory} category`

            // Fetch full meal details and append it onto results container
            data.meals.forEach(meal => {
                fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                    .then(res => res.json())
                    .then(data => {
                        populateAndAppendCards(resultsContainer, data.meals[0])
                    })
            });

            hideAllContainers()
            resultsContainer.classList.remove('hide')

            // Scroll section into view
            document.querySelector('.section-title').scrollIntoView()
        })
}

function handleSearch() {
    // Show loading icon
    const searchIcon = document.querySelector('form .fa-solid')
    searchIcon.className = 'fa-solid fa-circle-notch fa-spin fa-2x'

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${document.getElementById('input').value}`)
        .then(res => res.json())
        .then(data => {

            // handle no results found
            if (data.meals === null) {
                // Show search icon after loading is complete
                searchIcon.className = 'fa-solid fa-magnifying-glass fa-2x'
                hideAllContainers()

                document.querySelector('.section-title').innerText = `No results found for '${document.getElementById('input').value}'`
                return
            }

            // Get results container
            const resultsContainer = document.querySelector('.results')
            resultsContainer.innerText = ''
            document.querySelector('.section-title').innerText = `Searching for: ${document.getElementById('input').value}`

            // Append meals on results container
            data.meals.forEach(meal => {
                populateAndAppendCards(resultsContainer, meal)
            });

            // Show search icon after loading is complete
            searchIcon.className = 'fa-solid fa-magnifying-glass fa-2x'
            hideAllContainers()
            resultsContainer.classList.remove('hide')

            // Scroll section into view
            document.querySelector('.section-title').scrollIntoView()
        })
        .catch(err => {
            // Show search icon after loading is complete
            searchIcon.className = 'fa-solid fa-magnifying-glass fa-2x'
            console.error(err)
        })
}

// Seach ingredient or meal by category
function handleSearchByType(category) {
    // Show loading icon
    const searchIcon = document.querySelector('form .fa-solid')
    searchIcon.className = 'fa-solid fa-circle-notch fa-spin fa-2x'

    if (category === 'ingredient') {

        fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=${category}`)
            .then(res => res.json())
            .then(data => {

                let newObj = []
                const searchInput = document.getElementById('input').value
                console.log(newObj);

                // filter results
                if (data.meals !== null) {
                    data.meals.forEach(ingredient => {
                        if (ingredient.strIngredient.includes(searchInput)) {
                            newObj.push(ingredient)
                        }
                    })
                }

                const searchIcon = document.querySelector('form .fa-solid')
                // Get the ingredients container
                const ingredientsContainer = document.querySelector('.ingredients')
                ingredientsContainer.innerText = ''

                // handle no results found after filter
                if (newObj.length === 0) {
                    // Show search icon after loading is complete
                    searchIcon.className = 'fa-solid fa-magnifying-glass fa-2x'
                    hideAllContainers()

                    document.querySelector('.section-title').innerText = `No results found for '${searchInput}' in the ingredients `
                    return
                }

                // Change the section title
                document.querySelector('.section-title').innerText = `Result for '${searchInput}' in the ingredients`

                console.log(newObj);

                // Fetch full meal details and append it onto results container
                newObj.forEach(ingredient => {
                    console.log(ingredient);
                    let ingredientDiv = document.createElement('div')

                    let iTitle = document.createElement('p')
                    iTitle.className = 'ingredient-title'
                    iTitle.innerText = ingredient.strIngredient

                    let iDescription = document.createElement('p')
                    iDescription.className = 'ingredient-desc'
                    iDescription.innerText = (ingredient.strDescription === null) ? 'No description' : ingredient.strDescription

                    ingredientDiv.appendChild(iTitle)
                    ingredientDiv.appendChild(iDescription)

                    ingredientsContainer.appendChild(ingredientDiv)
                });

                hideAllContainers()
                ingredientsContainer.classList.remove('hide')

                // Show search icon after loading is complete
                searchIcon.className = 'fa-solid fa-magnifying-glass fa-2x'

                // Scroll section into view
                document.querySelector('.section-title').scrollIntoView()
            })

    } else {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
            .then(res => res.json())
            .then(data => {

                let newObj = []
                const searchInput = document.getElementById('input').value
                console.log(newObj);

                // filter results
                if (data.meals !== null) {
                    data.meals.forEach(meal => {
                        if (meal.strMeal.includes(searchInput)) {
                            newObj.push(meal)
                        }
                    })
                }

                const searchIcon = document.querySelector('form .fa-solid')

                // handle no results found after filter
                if (newObj.length === 0) {
                    // Show search icon after loading is complete
                    searchIcon.className = 'fa-solid fa-magnifying-glass fa-2x'
                    hideAllContainers()

                    document.querySelector('.section-title').innerText = `No results found for '${searchInput}' in ${category} category `
                    return
                }

                // Get the results container
                const resultsContainer = document.querySelector('.results')
                resultsContainer.innerText = ''

                // Change the section title
                document.querySelector('.section-title').innerText = `Result for '${searchInput}' in ${category} category`

                console.log(newObj);

                // Fetch full meal details and append it onto results container
                newObj.forEach(meal => {
                    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                        .then(res => res.json())
                        .then(data => {
                            populateAndAppendCards(resultsContainer, data.meals[0])
                        })
                });

                hideAllContainers()
                resultsContainer.classList.remove('hide')

                // Show search icon after loading is complete
                searchIcon.className = 'fa-solid fa-magnifying-glass fa-2x'

                // Scroll section into view
                document.querySelector('.section-title').scrollIntoView()
            })
    }
}

// Fetch a random meal and display it
function showRandom() {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(res => res.json())
        .then(data => {
            const mealsArray = data.meals
            let randomDishContainer = document.querySelector('.random')
            randomDishContainer.innerText = ''
            document.querySelector('.section-title').innerText = 'Random recipe'

            mealsArray.forEach(meal => {
                populateAndAppendCards(randomDishContainer, meal)
            })

            hideAllContainers()
            randomDishContainer.classList.remove('hide')
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
        showRecipeContainer()
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

// Add details recipe section for meal
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

    if (recipeObject.strTags !== undefined) {
        tags.innerText = 'Tags:'
        recipeObject.strTags.split(',').forEach(item => {
            let tagItem = document.createElement('span')
            tagItem.className = 'tag'
            tagItem.innerText = item
            tags.appendChild(tagItem)
        })
    } else {
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

// Format meal object contents e.g. paragraph, remove unnecessary items
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

// Display recipe section
function showRecipeContainer() {

    const recipeContainer = document.querySelector('.recipe-view')

    // Show the recipe container
    recipeContainer.classList.replace('hide', 'show')
    recipeContainer.style.top = window.scrollY + 'px'

    document.addEventListener("scroll", (event) => {
        recipeContainer.classList.replace('show', 'hide')
    })

    // Close/hide recipe container when clicked
    recipeContainer.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopImmediatePropagation()
        e.stopPropagation()

        recipeContainer.classList.replace('show', 'hide')
    })
}

// Remove all containers
function hideAllContainers() {
    document.querySelector('.results').classList.add('hide')
    document.querySelector('.featured').classList.add('hide')
    document.querySelector('.random').classList.add('hide')
    document.querySelector('.ingredients').classList.add('hide')
}