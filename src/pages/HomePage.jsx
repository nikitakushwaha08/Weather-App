import { getAqiCategory, getHourlyLabel } from "../utils/dashboardUtils";

function HomePage({
  loading,
  error,
  weatherData,
  hourlyForecast,
  dailyForecast,
  aqiValue,
  mapUrl
}) {
  const locationLabel = `${weatherData?.name || "--"}${
    weatherData?.sys?.country ? `, ${weatherData.sys.country}` : ""
  }`;
  const nowLabel = new Date().toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const tips = [];
  if (Number(weatherData?.main?.humidity) > 75) tips.push("High humidity - stay hydrated.");
  if (Number(weatherData?.wind?.speed) > 8) tips.push("Strong winds - secure loose outdoor items.");
  if (Number(aqiValue) > 100) tips.push("Air quality is moderate/poor - limit long outdoor activity.");
  if (weatherData?.weather?.[0]?.main?.toLowerCase().includes("rain")) {
    tips.push("Carry an umbrella.");
  }

  return (
    <section className="page-content home-page">
      {loading && <p className="info-text">Loading weather dashboard...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="glass-card current-weather-card">
        <div>
          <p className="chip">Current Weather</p>
          <h1>{locationLabel}</h1>
          <p className="meta-line">{nowLabel}</p>
          <p className="main-temp">{Math.round(Number(weatherData?.main?.temp || 0))}deg C</p>
          <p className="condition-line">
            {weatherData?.weather?.[0]?.main || "Weather"} -{" "}
            {weatherData?.weather?.[0]?.description || "Current condition"}
          </p>
        </div>
        <img
          className="hero-weather-icon"
          src={
            weatherData?.weather?.[0]?.iconUrl ||
            `https://openweathermap.org/img/wn/${weatherData?.weather?.[0]?.icon || "01d"}@2x.png`
          }
          alt={weatherData?.weather?.[0]?.description || "Weather icon"}
        />
      </div>

      <div className="glass-card section-card">
        <h2>Hourly Forecast</h2>
        <div className="hourly-scroll">
          {hourlyForecast?.map((hour) => (
            <article key={hour.time} className="hour-pill">
              <span>{getHourlyLabel(hour.time)}</span>
              <strong>{Math.round(Number(hour.temp || 0))}deg C</strong>
            </article>
          ))}
        </div>
      </div>

      <div className="home-grid">
        <article className="glass-card section-card">
          <h2>7-Day Forecast</h2>
          <div className="seven-day-list">
            {dailyForecast?.slice(0, 7).map((day) => (
              <div key={day.date} className="day-row">
                <span>{day.weekday}</span>
                <span>{Math.round(Number(day.max || 0))}deg / {Math.round(Number(day.min || 0))}deg</span>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-card section-card">
          <h2>Highlights</h2>
          <div className="metrics-grid">
            <div className="metric-item">
              <span>Humidity 💧</span>
              <strong>{Math.round(Number(weatherData?.main?.humidity || 0))}%</strong>
            </div>
            <div className="metric-item">
              <span>Wind 🌬️</span>
              <strong>{Number(weatherData?.wind?.speed || 0).toFixed(1)} m/s</strong>
            </div>
            <div className="metric-item">
              <span>Pressure</span>
              <strong>{Math.round(Number(weatherData?.main?.pressure || 0))} hPa</strong>
            </div>
            <div className="metric-item">
              <span>UV / AQI</span>
              <strong>{getAqiCategory(aqiValue)}</strong>
            </div>
          </div>
        </article>

        <article className="glass-card section-card">
          <h2>Map Preview</h2>
          {mapUrl ? (
            <iframe
              title="weather-map-preview"
              src={mapUrl}
              className="map-preview"
              loading="lazy"
            />
          ) : (
            <p className="meta-line">Map preview unavailable.</p>
          )}
        </article>
      </div>

      <div className="glass-card section-card">
        <h2>Alerts & AI Suggestion</h2>
        <div className="alerts-wrap">
          <div className="alert-chip">
            🚨 AQI: {aqiValue ?? "--"} ({getAqiCategory(aqiValue)})
          </div>
          {tips.length > 0 ? (
            tips.map((tip) => (
              <div key={tip} className="alert-chip secondary">
                💡 {tip}
              </div>
            ))
          ) : (
            <div className="alert-chip secondary">💡 Conditions are stable. Enjoy your day.</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default HomePage;
