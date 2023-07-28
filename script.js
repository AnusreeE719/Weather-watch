const apiKey = "d60bfe2cfa92c196fe395a805e4b4251";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";


const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".location-btn");
const weatherIcon = document.querySelector(".weather-icon");
const errorElement = document.querySelector(".error");
const weatherElement = document.querySelector(".weather");
const loadingElement = document.querySelector(".loading");

async function getWeatherByCity(city) {
    if (searchBox.value == "") {
        showError("Please enter a city name")
        return;
    }
    showLoading();
    try{
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (!response.ok) {
        handleFetchError(response)
    }
    else {
        const data = await response.json();
        updateWeatherData(data);
    }
    }
    catch(error){
        handleFetchError(error);
    }
    finally{
        hideLoading();
    }
}
async function getWeatherByLocation() {
    
    if ('geolocation' in navigator) {
        showLoading();
        navigator.geolocation.getCurrentPosition(async position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            try{
            const response = await fetch(apiUrl + `&lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
            if (!response.ok) {
                handleFetchError(response)
            }
            else {
                const data = await response.json();
                updateWeatherData(data);
            }
            }
            catch(error){
                handleFetchError(error);
            }
            finally{
                hideLoading();
            }
        })
    }
    else {
        showError("Geolocation is not supported by the user")
    }
}
function handleFetchError(response) {
    if (response && response.status === 404) {
        showError("City not found. Please enter a valid city name.");
      } 
      else{
   showError(response.message || "An error occured. Please try again later")
    }
}
    function showError(message){
        errorElement.textContent = message;
        errorElement.style.display = "block";
        weatherElement.style.display = "none";
    }
function showLoading(){
    loadingElement.style.display = "block";
    weatherElement.style.display = "none";
    errorElement.style.display = "none";
}
function hideLoading() {
    loadingElement.style.display = "none";
}
function updateWeatherData(data) {

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    if (data.weather[0].main == "Clouds") {
        weatherIcon.src = "images/clouds.png"
    }
    else if (data.weather[0].main == "Clear") {
        weatherIcon.src = "images/clear.png"
    }
    else if (data.weather[0].main == "Rain") {
        weatherIcon.src = "images/rain.png"
    }
    else if (data.weather[0].main == "Snow") {
        weatherIcon.src = "images/snow.png"
    }
    else if (data.weather[0].main == "Drizzle") {
        weatherIcon.src = "images/drizzle.png"
    }
    else if (data.weather[0].main == "Mist") {
        weatherIcon.src = "images/mist.png"
    }
    weatherElement.style.display = "block";
    errorElement.style.display = "none";
}
searchBtn.addEventListener('click', () => {
    getWeatherByCity(searchBox.value);
})

locationBtn.addEventListener('click', () => {
    getWeatherByLocation();
})
