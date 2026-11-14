const apiKey = "08706aaeabd8b31089e81920bf262bf5"; // Yahan apni API key dalein
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        alert("Kripya kisi shehar ka naam likhein!");
    }
});

async function getWeatherData(city) {
    try {
        // 1. Live Current Weather Fetch karna
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const currentRes = await fetch(currentUrl);
        if (!currentRes.ok) throw new Error("Shehar nahi mila!");
        const currentData = await currentRes.json();

        displayCurrentWeather(currentData);

        // 2. 5-Day Forecast Fetch karna
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();

        displayForecast(forecastData);

    } catch (error) {
        alert(error.message);
    }
}

function displayCurrentWeather(data) {
    document.getElementById("current-weather").classList.remove("hidden");
    document.getElementById("city-name").innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById("description").innerText = data.weather[0].description.toUpperCase();
    document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s`;
    
    const iconCode = data.weather[0].icon;
    document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById("forecast-container");
    document.getElementById("forecast-title").classList.remove("hidden");
    forecastContainer.innerHTML = ""; // Purana data clear karein

    // API har 3 ghante ka data deti hai, isliye hum roz dopahar 12:00 PM ka data filter karenge
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: 'short', day: 'numeric' });
        const temp = Math.round(day.main.temp);
        const humidity = day.main.humidity;
        const icon = day.weather[0].icon;

        const card = `
            <div class="forecast-item">
                <p><strong>${date}</strong></p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon">
                <p>${temp}°C</p>
                <p>Hum: ${humidity}%</p>
            </div>
        `;
        forecastContainer.innerHTML += card;
    });
}
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});
window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
            const res = await fetch(currentUrl);
            const data = await res.json();
            displayCurrentWeather(data);

            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
            const fRes = await fetch(forecastUrl);
            const fData = await fRes.json();
            displayForecast(fData);
        });
    }
});