document.addEventListener('DOMContentLoaded', function() {
    // search button event listener
    document.getElementById('search-button').addEventListener('click', function() {
        var cityName = document.getElementById('city-input').value.trim();
        if (cityName) {
            searchCity(cityName);
        } else {
            alert('Please enter a city name.');
        }
    });

    // load any existing search history/ Create this function

});

