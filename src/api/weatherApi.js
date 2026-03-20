const DEFAULT_API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FALLBACK_GEO_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FALLBACK_FORECAST_API_URL = "https://api.open-meteo.com/v1/forecast";

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
const apiBaseUrl = import.meta.env.VITE_OPENWEATHER_API_BASE_URL || DEFAULT_API_BASE_URL;

function buildWeatherUrl(cityName) {
  return `${apiBaseUrl}?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`;
}

function buildGeoLabel(place) {
  if (!place) return "";
  const parts = [place.name, place.admin1, place.country].filter(Boolean);
  return parts.join(", ");
}

function parseApiError(responseStatus) {
  if (responseStatus === 401) {
    return "Invalid API key. Please check VITE_OPENWEATHER_API_KEY.";
  }
  if (responseStatus === 404) {
    return "City not found. Please check spelling.";
  }
  if (responseStatus >= 500) {
    return "Weather service is temporarily unavailable. Please try again.";
  }
  return "Unable to fetch weather data. Please try again.";
}

function mapOpenMeteoCodeToWeather(weatherCode) {
  const code = Number(weatherCode);
  if (code === 0) {
    return { main: "Clear", description: "clear sky", icon: "01d" };
  }
  if (code === 1) {
    return { main: "Clouds", description: "mainly clear", icon: "02d" };
  }
  if (code === 2) {
    return { main: "Clouds", description: "partly cloudy", icon: "03d" };
  }
  if (code === 3) {
    return { main: "Clouds", description: "overcast", icon: "04d" };
  }
  if ([45, 48].includes(code)) {
    return { main: "Mist", description: "foggy", icon: "50d" };
  }
  if ([51, 53, 55, 56, 57].includes(code)) {
    return { main: "Drizzle", description: "drizzle", icon: "09d" };
  }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { main: "Rain", description: "rain showers", icon: "10d" };
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { main: "Snow", description: "snowfall", icon: "13d" };
  }
  if ([95, 96, 99].includes(code)) {
    return { main: "Thunderstorm", description: "thunderstorm", icon: "11d" };
  }
  return { main: "Weather", description: "current conditions", icon: "01d" };
}

function mapFallbackPayload(cityName, place, payload) {
  const current = payload?.current || {};
  const weather = mapOpenMeteoCodeToWeather(current.weather_code);

  return {
    name: place?.name || cityName,
    coord: {
      lat: place?.latitude,
      lon: place?.longitude
    },
    sys: {
      country: place?.country_code || ""
    },
    main: {
      temp: current.temperature_2m,
      feels_like: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      pressure: current.pressure_msl
    },
    wind: {
      speed: current.wind_speed_10m
    },
    visibility: current.visibility,
    weather: [
      {
        main: weather.main,
        description: weather.description,
        icon: weather.icon
      }
    ]
  };
}

async function fetchFallbackWeather(cityName) {
  const geocodingUrl = `${FALLBACK_GEO_API_URL}?name=${encodeURIComponent(
    cityName
  )}&count=1&language=en&format=json`;

  const geocodingResponse = await fetch(geocodingUrl);
  if (!geocodingResponse.ok) {
    throw new Error("Unable to fetch weather data. Please try again.");
  }

  const geocodingData = await geocodingResponse.json();
  const place = geocodingData?.results?.[0];
  if (!place) {
    throw new Error("City not found. Please check spelling.");
  }

  const forecastUrl = `${FALLBACK_FORECAST_API_URL}?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,visibility,weather_code&wind_speed_unit=ms&timezone=auto`;
  const forecastResponse = await fetch(forecastUrl);
  if (!forecastResponse.ok) {
    throw new Error("Unable to fetch weather data. Please try again.");
  }

  const forecastData = await forecastResponse.json();
  return mapFallbackPayload(cityName, place, forecastData);
}

async function geocodeCity(cityName, count = 6) {
  const geocodingUrl = `${FALLBACK_GEO_API_URL}?name=${encodeURIComponent(
    cityName
  )}&count=${count}&language=en&format=json`;
  const response = await fetch(geocodingUrl);
  if (!response.ok) {
    throw new Error("Unable to fetch location suggestions.");
  }
  const payload = await response.json();
  return payload?.results || [];
}

function mapCurrentByCoordinates(place, payload) {
  const current = payload?.current || {};
  const weather = mapOpenMeteoCodeToWeather(current.weather_code);
  return {
    name: place?.name || "Current Location",
    coord: {
      lat: place?.latitude,
      lon: place?.longitude
    },
    sys: {
      country: place?.country_code || ""
    },
    main: {
      temp: current.temperature_2m,
      feels_like: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      pressure: current.pressure_msl
    },
    wind: {
      speed: current.wind_speed_10m
    },
    visibility: current.visibility,
    weather: [
      {
        main: weather.main,
        description: weather.description,
        icon: weather.icon
      }
    ]
  };
}

export async function getWeatherByCoordinates(latitude, longitude, label = "") {
  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error("Invalid coordinates for current location.");
  }

  const forecastUrl = `${FALLBACK_FORECAST_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,visibility,weather_code&wind_speed_unit=ms&timezone=auto`;
  const response = await fetch(forecastUrl);
  if (!response.ok) {
    throw new Error("Unable to fetch weather for current location.");
  }

  const payload = await response.json();
  const place = {
    name: label || "Current Location",
    latitude: lat,
    longitude: lon,
    country_code: ""
  };
  return mapCurrentByCoordinates(place, payload);
}

export async function getCitySuggestions(query, limit = 6) {
  const cleaned = String(query || "").trim();
  if (cleaned.length < 2) return [];
  const results = await geocodeCity(cleaned, limit);
  return results.map((place) => ({
    id: `${place.latitude}-${place.longitude}-${place.id || place.name}`,
    name: place.name,
    label: buildGeoLabel(place),
    latitude: place.latitude,
    longitude: place.longitude
  }));
}

export async function getDailyForecastByCoordinates(latitude, longitude, days = 7) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error("Invalid coordinates for forecast.");
  }

  const url = `${FALLBACK_FORECAST_API_URL}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&forecast_days=${days}&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to fetch forecast data.");
  }
  return response.json();
}

export async function getCityForecast(cityName, days = 7) {
  const places = await geocodeCity(cityName, 1);
  const place = places[0];
  if (!place) {
    throw new Error("Destination not found.");
  }
  const forecast = await getDailyForecastByCoordinates(place.latitude, place.longitude, days);
  return {
    place: {
      name: place.name,
      country: place.country,
      latitude: place.latitude,
      longitude: place.longitude
    },
    forecast
  };
}

export async function getCurrentWeather(cityName) {
  if (!apiKey) {
    return fetchFallbackWeather(cityName);
  }

  const response = await fetch(buildWeatherUrl(cityName));

  if (!response.ok) {
    throw new Error(parseApiError(response.status));
  }

  return response.json();
}
