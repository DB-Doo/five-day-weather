Initialize the application:
  - Set up event listeners for DOMContentLoaded and the search button click
  - Load any previous search history from localStorage and display it

When the search button is clicked:
  - Retrieve the city name from the input field
  - Call the function to get coordinates for the city

Function to get coordinates for the city:
  - Make an API call to the OpenWeatherMap Geocoding API with the city name
  - If the city is found:
    - Retrieve the latitude and longitude from the response
    - Call the function to get current and forecast weather data using those coordinates
    - Add the city to the search history and save it to localStorage
  - If the city is not found, display an error message

Function to get current and forecast weather data:
  - Make an API call to the OpenWeatherMap 5 Day Forecast API with the coordinates
  - If the API call is successful:
    - Retrieve the current weather data and the 5-day forecast from the response
    - Update the Current Weather section with the new data
    - Clear the forecast section and create new forecast cards for the 5-day forecast
    - Append the forecast cards to the forecast section
  - If the API call fails, display an error message

Function to update the Current Weather section:
  - Display the city name, date, weather icon, temperature, wind speed, and humidity

Function to create forecast cards:
  - For each day of the forecast:
    - Create a card element with the date, weather icon, temperature, wind speed, and humidity
    - Append the card to the forecast container

Function to add a city to the search history:
  - Add the city to the history array
  - Save the updated array to localStorage
  - Call the function to update the search history display

Function to update the search history display:
  - Clear the current history display
  - For each city in the history:
    - Create a button with the city name
    - Set up an event listener on the button to re-fetch the weather when clicked
    - Append the button to the search history container

Function to load and display the search history from localStorage:
  - Retrieve the history array from localStorage
  - If there's no history, initialize an empty array
  - Call the function to update the search history display

When a city in the search history is clicked:
  - Retrieve the city name from the button
  - Call the function to get coordinates for the city (this will also fetch and display the weather)