// Replace with your API KEY
const APIKEY = "" // OpenWeatherMap API 

const searchByCityName = (cityName) => { return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKEY}&units=metric`; }

async function getData(location) {
    const response = await fetch(searchByCityName(location));
    const data = await response.json();
    return data;
}
