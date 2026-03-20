function DashboardPage({
  isLoggedIn,
  savedCities,
  onQuickCitySelect,
  weatherUnit,
  onToggleUnit,
  notificationsEnabled,
  onToggleNotifications,
  isDarkMode
}) {
  if (!isLoggedIn) {
    return (
      <section className="page-content">
        <article className="glass-card section-card">
          <h2>User Dashboard</h2>
          <p className="meta-line">
            This area is for logged-in users. Use the Login / Signup button to continue.
          </p>
        </article>
      </section>
    );
  }

  return (
    <section className="page-content dashboard-page">
      <article className="glass-card section-card">
        <h2>Saved Cities ❤️</h2>
        <div className="saved-city-list">
          {savedCities.length > 0 ? (
            savedCities.map((city) => (
              <button key={city} type="button" className="chip-btn" onClick={() => onQuickCitySelect(city)}>
                {city}
              </button>
            ))
          ) : (
            <p className="meta-line">No saved cities yet.</p>
          )}
        </div>
      </article>

      <div className="home-grid">
        <article className="glass-card section-card">
          <h2>Preferences</h2>
          <div className="settings-grid">
            <button type="button" className="chip-btn" onClick={onToggleUnit}>
              Units: {weatherUnit}
            </button>
            <button type="button" className="chip-btn" onClick={onToggleNotifications}>
              Alerts: {notificationsEnabled ? "Enabled" : "Disabled"}
            </button>
            <button type="button" className="chip-btn">
              Theme: {isDarkMode ? "Dark" : "Light"}
            </button>
          </div>
        </article>

        <article className="glass-card section-card">
          <h2>Weather Alerts 🔔</h2>
          <div className="alerts-wrap">
            <div className="alert-chip">Heavy rain alerts for low-lying areas.</div>
            <div className="alert-chip secondary">Strong wind advisory this evening.</div>
            <div className="alert-chip secondary">Daily summary notification at 8:00 AM.</div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default DashboardPage;
