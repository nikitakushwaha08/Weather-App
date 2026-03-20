import { getAqiCategory } from "../utils/dashboardUtils";

function AirQualityPage({ aqiValue, airDetails }) {
  return (
    <section className="page-content">
      <article className="glass-card section-card">
        <h2>Air Quality Index 🌫️</h2>
        <p className="aqi-value-large">{aqiValue ?? "--"}</p>
        <p className="meta-line">{getAqiCategory(aqiValue)}</p>
      </article>

      <div className="home-grid">
        <article className="glass-card section-card">
          <h3>Pollutants</h3>
          <div className="seven-day-list">
            <div className="day-row">
              <span>PM2.5</span>
              <span>{airDetails.pm2_5 ?? "--"} ug/m3</span>
            </div>
            <div className="day-row">
              <span>PM10</span>
              <span>{airDetails.pm10 ?? "--"} ug/m3</span>
            </div>
            <div className="day-row">
              <span>CO</span>
              <span>{airDetails.carbon_monoxide ?? "--"} ug/m3</span>
            </div>
          </div>
        </article>
        <article className="glass-card section-card">
          <h3>Health Suggestions</h3>
          <div className="alerts-wrap">
            <div className="alert-chip">Wear a mask in heavy traffic zones.</div>
            <div className="alert-chip secondary">Avoid intense outdoor workouts when AQI rises.</div>
            <div className="alert-chip secondary">Keep indoor ventilation balanced.</div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default AirQualityPage;
