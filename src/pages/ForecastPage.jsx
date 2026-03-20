function ForecastPage({ hourlyForecast, dailyForecast }) {
  const maxTemp = Math.max(...hourlyForecast.map((item) => Number(item.temp || 0)), 1);

  return (
    <section className="page-content">
      <article className="glass-card section-card">
        <h2>Detailed Forecast</h2>
        <p className="meta-line">Hourly trend, rain probability, sunrise and sunset overview.</p>
      </article>

      <article className="glass-card section-card">
        <h3>Temperature Graph 📈</h3>
        <div className="temp-chart">
          {hourlyForecast.map((hour) => {
            const value = Number(hour.temp || 0);
            const height = `${Math.max(10, (value / maxTemp) * 100)}%`;
            return (
              <div key={hour.time} className="temp-bar-item">
                <div className="temp-bar" style={{ height }} />
                <span>{new Date(hour.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            );
          })}
        </div>
      </article>

      <div className="home-grid">
        <article className="glass-card section-card">
          <h3>Rain Probability</h3>
          <div className="seven-day-list">
            {dailyForecast.slice(0, 7).map((day) => (
              <div key={day.date} className="day-row">
                <span>{day.weekday}</span>
                <span>{Math.round(Number(day.rainProbability || 0))}%</span>
              </div>
            ))}
          </div>
        </article>
        <article className="glass-card section-card">
          <h3>Sunrise / Sunset</h3>
          <div className="seven-day-list">
            {dailyForecast.slice(0, 4).map((day) => (
              <div key={day.date} className="day-row">
                <span>{day.weekday}</span>
                <span>
                  {day.sunrise || "--:--"} / {day.sunset || "--:--"}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default ForecastPage;
