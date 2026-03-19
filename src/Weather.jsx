import { useEffect, useState } from "react";
import "./Weather.css";
import { getCurrentWeather } from "./api/weatherApi";

function Weather() {
  // User input ke liye controlled state
  const [city, setCity] = useState("");
  // API response ko store karne ke liye
  const [weatherData, setWeatherData] = useState(null);
  // Loading spinner / text show karne ke liye
  const [loading, setLoading] = useState(false);
  // Error message user ko friendly way me dikhane ke liye
  const [error, setError] = useState("");
  // Background style change karne ke liye weather category
  const [bgClass, setBgClass] = useState("default");

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return;

    try {
      setLoading(true);
      setError("");
      const data = await getCurrentWeather(cityName);
      setWeatherData(data);
      updateBackground(data.weather?.[0]?.main);
    } catch (err) {
      setWeatherData(null);
      setBgClass("default");
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateBackground = (condition = "") => {
    const value = condition.toLowerCase();

    if (value.includes("clear")) {
      setBgClass("sunny");
    } else if (
      value.includes("cloud") ||
      value.includes("mist") ||
      value.includes("haze") ||
      value.includes("fog")
    ) {
      setBgClass("cloudy");
    } else if (value.includes("rain") || value.includes("drizzle")) {
      setBgClass("rainy");
    } else if (value.includes("thunder")) {
      setBgClass("storm");
    } else if (value.includes("snow")) {
      setBgClass("snow");
    } else {
      setBgClass("default");
    }
  };

  const handleSearch = () => {
    fetchWeather(city);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchWeather(city);
    }
  };

  const formatValue = (value, suffix = "") => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "--";
    }
    return `${Math.round(Number(value))}${suffix}`;
  };

  useEffect(() => {
    // Initial render par ek default city ka data load karte hain
    fetchWeather("Delhi");
  }, []);

  return (
    <section className={`weather-page ${bgClass}`}>
      <div className="weather-card">
        <header className="card-header">
          <h1>Weather App</h1>
          <p className="subtitle">Search any city to see current weather</p>
        </header>

        <div className="search-form">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(event) => setCity(event.target.value)}
            onKeyDown={handleInputKeyDown}
            aria-label="City name"
          />
          <button type="button" onClick={handleSearch}>
            Get Weather
          </button>
        </div>

        {loading && <p className="info-text">Loading weather data...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && weatherData && (
          <article className="weather-info">
            <h2 className="location-title">
              {weatherData.name}
              {weatherData.sys?.country ? `, ${weatherData.sys.country}` : ""}
            </h2>

            <div className="main-weather">
              <img
                src={
                  weatherData.weather?.[0]?.iconUrl ||
                  `https://openweathermap.org/img/wn/${weatherData.weather?.[0]?.icon}@2x.png`
                }
                alt={weatherData.weather?.[0]?.description || "Weather icon"}
              />
              <div className="temp-block">
                <p className="temperature">{formatValue(weatherData.main?.temp, "deg C")}</p>
                <p className="feels-like">
                  Feels like {formatValue(weatherData.main?.feels_like, "deg C")}
                </p>
              </div>
            </div>

            <p className="condition-pill">
              {weatherData.weather?.[0]?.main} - {weatherData.weather?.[0]?.description}
            </p>

            <div className="details-grid">
              <div className="detail-box">
                <span>Humidity</span>
                <strong>{formatValue(weatherData.main?.humidity, "%")}</strong>
              </div>
              <div className="detail-box">
                <span>Wind Speed</span>
                <strong>
                  {Number.isFinite(Number(weatherData.wind?.speed))
                    ? `${Number(weatherData.wind.speed).toFixed(1)} m/s`
                    : "--"}
                </strong>
              </div>
              <div className="detail-box">
                <span>Pressure</span>
                <strong>{formatValue(weatherData.main?.pressure, " hPa")}</strong>
              </div>
              <div className="detail-box">
                <span>Visibility</span>
                <strong>
                  {Number.isFinite(Number(weatherData.visibility))
                    ? `${(Number(weatherData.visibility) / 1000).toFixed(1)} km`
                    : "--"}
                </strong>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

export default Weather;
