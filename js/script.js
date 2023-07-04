document.addEventListener('DOMContentLoaded', (e) => {
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault()
        handleSearch()
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