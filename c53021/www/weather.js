
const apiKey = "55e1790d2023f903d8ea8d5d5327c1f1"; 

document.getElementById('getWeatherBtn').addEventListener('click', () => {
    const address = document.getElementById('addressInput').value.trim();
    if (!address) {
        alert('Please enter an address.');
        return;
    }

    getCurrentWeather(address);
    getWeatherForecast(address);
});

// Get Current Weather using XMLHttpRequest
function getCurrentWeather(address) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${address}&units=metric&appid=${apiKey}`;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log(data);
            displayCurrentWeather(data);
        } else {
            alert('Failed to fetch current weather. Check the address.');
        }
    };

    xhr.send();
}

// Display Current Weather
function displayCurrentWeather(data) {
    const resultsDiv = document.getElementById('weatherResults');
    resultsDiv.innerHTML = `
    <h3>Current Weather</h3>
        <div class="current-weather-item">
            <p>${new Date().toDateString()}</p>
            <p>Temperature: ${data.main.temp} °C</p>
            <p>Max Temp: ${data.main.temp_max} °C</p>
            <p>Min Temp: ${data.main.temp_min} °C</p>
            <p>Windy: ${data.wind.speed > 5 ? 'Yes' : 'No'}</p>
        </div>
    `;
}

// Get Weather Forecast using Fetch API
function getWeatherForecast(address) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${address}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch weather forecast.');
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data); 
            displayForecast(data); 
        })
        .catch(error => alert(error.message));
        
}

// Display Forecast
function displayForecast(data) {
    const resultsDiv = document.getElementById('weatherResults');
    const dailyTemps = {};

    // Aggregate daily temperatures
    data.list.forEach(entry => {
        const date = entry.dt_txt.split(' ')[0];
        if (!dailyTemps[date]) dailyTemps[date] = [];
        dailyTemps[date].push(entry.main.temp);
    });

    const forecastHtml = Object.keys(dailyTemps).map(date => {
        const avgTemp = (dailyTemps[date].reduce((a, b) => a + b) / dailyTemps[date].length).toFixed(1);
        const weatherType = getWeatherType(data.list.find(entry => entry.dt_txt.includes(date)).weather[0].main);

        return `
            <div class="weather-item">
                <img src="${weatherType.icon}" alt="${weatherType.label}">
                <p>${date}: Avg Temp ${avgTemp} °C</p>
            </div>
        `;
    }).join('');

    resultsDiv.innerHTML += `
        <h3>5-Day Forecast</h3>
        ${forecastHtml}
    `;
}

// Determine Weather Type
function getWeatherType(weatherMain) {
    const types = {
        Clear: { label: 'Sunny', icon: 'https://img.icons8.com/color/48/000000/sun--v1.png' },
        Clouds: { label: 'Cloudy', icon: 'https://img.icons8.com/color/48/000000/cloud.png' },
        Rain: { label: 'Rainy', icon: 'https://img.icons8.com/color/48/000000/rain.png' },
        Snow: { label: 'Snowy', icon: 'https://img.icons8.com/color/48/000000/snow.png' },
        Wind: { label: 'Windy', icon: 'https://img.icons8.com/color/48/000000/wind.png' },
    };

    return types[weatherMain] || { label: 'Unknown', icon: '' };
}
