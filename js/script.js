document.addEventListener('DOMContentLoaded', (e) => {
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault()

        // validate user input
        if(document.getElementById('input').value.trim().length !== 0){
            handleSearch()
        }else{
            document.getElementById('input').value = ''
        }
    })
})

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
                let space = document.createElement('br')
                let foodContainer = document.createElement('div')

                let name = document.createElement('h2')
                name.innerText = meal.strMeal;

                let image = document.createElement('img')
                image.src = meal.strMealThumb

                let instructions = document.createElement('p')
                instructions.innerText = meal.strInstructions;

                foodContainer.append(name)
                foodContainer.append(instructions)
                foodContainer.append(image)
                foodContainer.append(space)

                resultsContainer.append(foodContainer)
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

function showRandom(){
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(data => {
        const mealsArray = data.meals
        let randomDishContainer = document.querySelector('.random')
        randomDishContainer.innerText = ''

        mealsArray.forEach(meal => {
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

            const recipeLink = document.createElement('p')
            recipeLink.className = 'meal-recipe'
            recipeLink.innerText = 'Link to recipe'

            dish.appendChild(thumbnail)
            dish.appendChild(mealName)
            dish.appendChild(mealOrigin)
            dish.appendChild(recipeLink)

            randomDishContainer.appendChild(dish)
        })
    })
}