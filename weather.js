// Weather API Key and URLs
const weatherApiKey = '1b5398b650e4a3edef0dc32752facbf8';
const baseApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const geocodingApiUrl = 'https://api.openweathermap.org/geo/1.0/direct';
const airPollutionApiUrl = 'https://api.openweathermap.org/data/2.5/air_pollution';

// Function to fetch weather data
function getWeatherData(location) {
    let url;
    if (typeof location === 'string') {
        url = `${baseApiUrl}?q=${location}&units=imperial&appid=${weatherApiKey}`;
    } else {
        url = `${baseApiUrl}?lat=${location.lat}&lon=${location.lon}&units=imperial&appid=${weatherApiKey}`;
    }

    console.log('Fetching weather data from:', url);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Weather data received:', data);
            updateWeatherUI(data);
            getAirQualityData(data.coord.lat, data.coord.lon);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Function to fetch air quality data from OpenWeather
function getAirQualityData(lat, lon) {
    const url = `${airPollutionApiUrl}?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`;
    console.log('Fetching air quality data from:', url);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Air quality data received:', data);
            updateAirQualityUI(data);
        })
        .catch(error => {
            console.error('Error fetching air quality data:', error);
            updateAirQualityUI(null);
        });
}

// Function to update weather UI
function updateWeatherUI(data) {
    let locationName = data.name;
    if (data.sys.country === 'US') {
        locationName += ', ' + getStateAbbreviation(data.coord.lat, data.coord.lon);
    } else {
        locationName += ', ' + data.sys.country;
    }
    document.getElementById('location-name').innerText = locationName;
    document.getElementById('temperature').innerText = Math.round(data.main.temp) + ' F';
    document.getElementById('humidity').innerText = data.main.humidity + '%';
    document.getElementById('wind').innerText = Math.round(data.wind.speed) + ' mph';
    
    let precipitation = (data.weather[0].main === 'Rain') ? 100 : 0; 
    document.getElementById('precipitation').innerText = precipitation + '%';
}

// Function to update air quality UI
function updateAirQualityUI(data) {
    if (data && data.list && data.list.length > 0) {
        const airQuality = data.list[0].components;
        document.getElementById('pm25').innerText = airQuality.pm2_5.toFixed(1) + ' µg/m³';
        document.getElementById('pm10').innerText = airQuality.pm10.toFixed(1) + ' µg/m³';

        const aqi = data.list[0].main.aqi;
        const aqiText = getAQIText(aqi);
        document.getElementById('aqi').innerText = `${aqi} - ${aqiText}`;
    } else {
        document.getElementById('pm25').innerText = 'N/A';
        document.getElementById('pm10').innerText = 'N/A';
        document.getElementById('aqi').innerText = 'N/A - Data unavailable';
    }
}

// Function to get AQI text
function getAQIText(aqi) {
    switch(aqi) {
        case 1: return 'Good';
        case 2: return 'Fair';
        case 3: return 'Moderate';
        case 4: return 'Poor';
        case 5: return 'Very Poor';
        default: return 'Unknown';
    }
}

// Function to get state abbreviation from coordinates
function getStateAbbreviation(lat, lon) {
    // This is a simplified version. For a more accurate result, you might want to use a geocoding service.
    const states = {
        'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
        'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
        'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
        'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
        'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
        'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
        'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
        'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
        'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
        'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
    };

    // This is a very basic approximation and won't be accurate for all locations
    const latRanges = [
        { min: 31, max: 42, long: -114, states: ['CA', 'NV', 'UT', 'AZ'] },
        { min: 42, max: 49, long: -124, states: ['WA', 'OR', 'ID', 'MT', 'WY'] },
        // Add more ranges for other states...
    ];

    for (let range of latRanges) {
        if (lat >= range.min && lat <= range.max) {
            if (lon <= range.long) {
                return range.states[0];  // Return the first state in the range
            }
        }
    }

    return 'US';  // Default to 'US' if no match found
}

// Function to get user's current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log('Geolocation successful:', position.coords);
                const location = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                getWeatherData(location);
            },
            error => {
                console.error('Error getting location:', error);
                getWeatherData('Long Beach,US'); // Default location if geolocation fails
            }
        );
    } else {
        console.log('Geolocation is not supported by this browser.');
        getWeatherData('Long Beach,US'); // Default location if geolocation is not supported
    }
}

// Function to fetch city suggestions (US only)
function getCitySuggestions(query) {
    const url = `${geocodingApiUrl}?q=${query},US&limit=5&appid=${weatherApiKey}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => data
            .filter(city => city.country === 'US')
            .map(city => `${city.name}, ${city.state}`));
}

// Function to update suggestions dropdown
function updateSuggestions(suggestions) {
    const datalist = document.getElementById('city-suggestions');
    datalist.innerHTML = '';
    suggestions.forEach(suggestion => {
        const option = document.createElement('option');
        option.value = suggestion;
        datalist.appendChild(option);
    });
}

// Function to handle input changes
function handleInputChange() {
    const searchInput = document.getElementById('location-search');
    const query = searchInput.value.trim();
    if (query.length >= 3) {
        getCitySuggestions(query)
            .then(updateSuggestions)
            .catch(error => console.error('Error fetching suggestions:', error));
    }
}

// Function to handle search
function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('location-search');
    const location = searchInput.value.trim();
    if (location) {
        console.log('Searching for location:', location);
        getWeatherData(location);
    }
}

// Initialize weather functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded, initializing weather functionality');
    getCurrentLocation();

    // Add event listener for search form
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', handleSearch);

    // Add event listener for input changes
    const searchInput = document.getElementById('location-search');
    searchInput.addEventListener('input', handleInputChange);
});