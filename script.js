const apiKey = "1a2bfcbe7702466ea40124236261701";

// Popular cities
const popularCities = [
    "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata",
    "Hyderabad", "Pune", "Jaipur", "Ahmedabad",
    "New York", "London", "Paris", "Tokyo", "Dubai",
    "Sydney", "Singapore"
];

// Search history
let searchHistory = JSON.parse(localStorage.getItem("cities")) || [];

/* Auto-detect location */
window.onload = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            fetchWeather(`${lat},${lon}`);
        });
    }
};

/* Get weather from input */
function getWeather() {
    const city = document.getElementById("city").value;
    if (!city) {
        alert("Please enter city name");
        return;
    }
    saveCity(city);
    fetchWeather(city);
}

/* Fetch API */
function fetchWeather(query) {
    document.getElementById("loader").style.display = "block";
    document.getElementById("result").innerHTML = "";
    document.getElementById("forecast").innerHTML = "";

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=5`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("loader").style.display = "none";

            if (data.error) throw new Error();

            setBackground(data.current.condition.text);

            document.getElementById("result").innerHTML = `
                <h2>${data.location.name}, ${data.location.country}</h2>
                <img src="https:${data.current.condition.icon}">
                <p><b>${data.current.condition.text}</b></p>
                <p>🌡 ${data.current.temp_c} °C</p>
                <p>💧 Humidity: ${data.current.humidity}%</p>
            `;

            data.forecast.forecastday.forEach(day => {
                document.getElementById("forecast").innerHTML += `
                    <div>
                        <p>${day.date.slice(5)}</p>
                        <img src="https:${day.day.condition.icon}" width="40">
                        <p>${day.day.avgtemp_c}°C</p>
                    </div>
                `;
            });
        })
        .catch(() => {
            document.getElementById("loader").style.display = "none";
            document.getElementById("result").innerHTML =
                "<p style='color:red;'>City not found!</p>";
        });
}

/* Background Images */
function setBackground(condition) {
    condition = condition.toLowerCase();

    if (condition.includes("sun") || condition.includes("clear")) {
        document.body.style.backgroundImage =
            "url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')";
    } else if (condition.includes("rain")) {
        document.body.style.backgroundImage =
            "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29')";
    } else if (condition.includes("cloud")) {
        document.body.style.backgroundImage =
            "url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63')";
    } else if (condition.includes("snow")) {
        document.body.style.backgroundImage =
            "url('https://images.unsplash.com/photo-1608889175123-8ee362201f81')";
    } else {
        document.body.style.backgroundImage =
            "url('https://images.unsplash.com/photo-1503264116251-35a269479413')";
    }
}

/* Save search */
function saveCity(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.unshift(city);
        searchHistory = searchHistory.slice(0, 5);
        localStorage.setItem("cities", JSON.stringify(searchHistory));
    }
}

/* City Suggestions */
function showSuggestions() {
    const input = document.getElementById("city").value.toLowerCase();
    const box = document.getElementById("suggestions");
    box.innerHTML = "";

    if (input.length === 0) return;

    const cities = [...new Set([...searchHistory, ...popularCities])];

    cities
        .filter(city => city.toLowerCase().startsWith(input))
        .slice(0, 5)
        .forEach(city => {
            const div = document.createElement("div");
            div.innerText = city;
            div.onclick = () => {
                document.getElementById("city").value = city;
                box.innerHTML = "";
                getWeather();
            };
            box.appendChild(div);
        });
}
