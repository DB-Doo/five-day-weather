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

    loadSearchHistory()

});

// Function to get coordinates for the city:
//   - Make an API call to the OpenWeatherMap Geocoding API with the city name
//   - If the city is found:
//     - Retrieve the latitude and longitude from the response
//     - Call the function to get current and forecast weather data using those coordinates
//     - Add the city to the search history and save it to localStorage
//   - If the city is not found, display an error message

function searchCity(cityName) {
    // Use the Geocoding API to get the latitude and longitude for the city
    var weatherUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=f6ed25ba170f992f6686c972ac15ffaa`;

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found!');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                var lat = data[0].lat;
                var lon = data[0].lon;
                // Store these coordinates or pass them to another function to fetch weather data
                // For now, let's log them to the console
                console.log(`Coordinates for ${cityName}: ${lat}, ${lon}`);
                getWeather(lat, lon);
                addToSearchHistory(cityName);
            } else {
                alert('City not found, please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching the geocode data:', error);
            alert(error.message);
        });
}

function getWeather(lat, lon) {
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=f6ed25ba170f992f6686c972ac15ffaa`;

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            return response.json();
        })
        .then(data => {
            // Update the UI with current and forecast weather data
            updateCurrentWeather(data.list[0], data.city); 
            updateForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            alert(error.message);
        });
}

function updateCurrentWeather(currentWeather, city) {
    // Format the date from the weather data
    var date = new Date(currentWeather.dt_txt).toLocaleDateString();

    // Update the Current Weather section with new data
    document.getElementById('city-name').textContent = `${city.name} (${date})`;
    document.getElementById('temperature').textContent = `Temp: ${currentWeather.main.temp}°F`;
    document.getElementById('wind').textContent = `Wind: ${currentWeather.wind.speed} MPH`;
    document.getElementById('humidity').textContent = `Humidity: ${currentWeather.main.humidity}%`;
}


function updateForecast(forecastData) {
    var forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear any existing forecast cards

    // Filter out the daily forecasts at noon, Convert the forecast timestamp to a Date object, Check if the time is 12 PM
    var dailyForecasts = forecastData.filter(f => new Date(f.dt_txt).getHours() === 12);

    // Start loop from the second item (index 1) in the filtered array to skip today's forecast
    // Loop through the next 5 items (or until the end of the array)
    for (let i = 1; i < dailyForecasts.length && i < 6; i++) {
        // Get the forecast data for the current item in the loop
        var forecast = dailyForecasts[i];
         // Create a new 'div' element for the forecast card
        var card = document.createElement('div');
        // Format the date from the forecast data so its readable
        var date = new Date(forecast.dt_txt).toLocaleDateString();
        // Set the inner HTML of the card with forecast details
        card.innerHTML = `
            <h4>${date}</h4>
            <p>Temp: ${forecast.main.temp}°F</p>
            <p>Wind: ${forecast.wind.speed} MPH</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
        `;
        card.classList.add('forecast-card'); // Add class from CSS to style 
        forecastContainer.appendChild(card);
    }
}

// Function to add a city to the search history:
//   - Add the city to the history array
//   - Save the updated array to localStorage
//   - Call the function to update the search history display
function addToSearchHistory(cityName) {
    let history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    // if the city is already in the history, remove it
    history = history.filter(city => city.toLowerCase() !== cityName.toLowerCase());
    // adds the new city to the front of the history array
    history.unshift(cityName);
    // saves the new history back to localStorage
    localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
    // Update the search history display
    updateSearchHistoryDisplay(history);
}


// Function to load and display the search history from localStorage:
//   - Retrieve the history array from localStorage
//   - If there's no history, initialize an empty array
//   - Call the function to update the search history display
function loadSearchHistory() {
    // Attempt to retrieve the search history from localStorage
    var history = localStorage.getItem('weatherSearchHistory');
    
    // If there is a history parse it and display it
    if (history) {
        history = JSON.parse(history);
        updateSearchHistoryDisplay(history);
    } else {
        // If not, initialize an empty array for the history
        localStorage.setItem('weatherSearchHistory', JSON.stringify([]));
    }
}

// Function to update the search history display:
//   - Clear the current history display
//   - For each city in the history:
//     - Create a button with the city name
//     - Set up an event listener on the button to re-fetch the weather when clicked
//     - Append the button to the search history container
function updateSearchHistoryDisplay(history) {
    var searchHistoryContainer = document.getElementById('search-history');
    searchHistoryContainer.innerHTML = ''; // clear any existing content

    // create a button for each city in the history and append to the container
    history.forEach(function(city) {
        var button = document.createElement('button');
        button.textContent = city;
        button.classList.add('history-btn'); // Aadd CSS class for styling
        button.addEventListener('click', function() {
            searchCity(city); // Re-fetch weather when clicked
        });
        searchHistoryContainer.appendChild(button);
    });
}

