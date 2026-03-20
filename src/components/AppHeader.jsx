function AppHeader({
  headerQuery,
  setHeaderQuery,
  onHeaderSearch,
  onSelectSuggestion,
  suggestions,
  recentSearches,
  showSuggestions,
  onUseCurrentLocation,
  onVoiceSearch,
  isVoiceSupported,
  onToggleTheme,
  isDarkMode,
  onAuthAction,
  activeNav,
  onNavClick
}) {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "forecast", label: "Forecast" },
    { id: "radar", label: "Radar" },
    { id: "air-quality", label: "Air Quality" },
    { id: "compare-cities", label: "Compare Cities" },
    { id: "travel-planner", label: "Travel Planner" },
    { id: "analytics", label: "Analytics" },
    { id: "dashboard", label: "Dashboard" }
  ];

  return (
    <header className="top-header">
      <div className="header-inner header-row">
        <button type="button" className="brand" onClick={() => onNavClick("home")}>
          <span className="brand-mark" aria-hidden="true">
            🌐
          </span>
          <span className="brand-copy">
            <strong>SkyCast</strong>
            <small>Live Weather Insights</small>
          </span>
        </button>

        <span className="header-spacer" aria-hidden="true" />

        <nav className="header-nav-inline" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activeNav === item.id ? "active" : ""}
              onClick={() => onNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <span className="header-spacer" aria-hidden="true" />

        <div className="header-center-controls">
          <div className="header-search">
            <input
              type="text"
              placeholder="Search city (Delhi, London...)"
              value={headerQuery}
              onChange={(event) => setHeaderQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onHeaderSearch(headerQuery);
                }
              }}
              aria-label="Search city from header"
            />
            <button
              type="button"
              className="header-search-icon"
              onClick={() => onHeaderSearch(headerQuery)}
              aria-label="Search city"
            >
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path
                  d="M10.5 4a6.5 6.5 0 1 0 4.14 11.51l4.43 4.42 1.41-1.41-4.42-4.43A6.5 6.5 0 0 0 10.5 4zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9z"
                  fill="currentColor"
                />
              </svg>
            </button>
            {showSuggestions && (
              <div className="search-dropdown">
                {suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="suggestion-item"
                      onClick={() => onSelectSuggestion(item)}
                    >
                      <strong>{item.name}</strong>
                      <span>{item.label}</span>
                    </button>
                  ))
                ) : (
                  <div className="recent-searches">
                    <p>Recent searches</p>
                    {recentSearches.length > 0 ? (
                      <div className="recent-search-list">
                        {recentSearches.map((entry) => (
                          <button key={entry} type="button" onClick={() => onHeaderSearch(entry)}>
                            {entry}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="recent-empty">No recent searches</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="header-tools">
            <button type="button" className="tool-btn" onClick={onUseCurrentLocation}>
              📍
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={onVoiceSearch}
              disabled={!isVoiceSupported}
              title={isVoiceSupported ? "Voice search" : "Voice search unsupported"}
            >
              🎤
            </button>
            <button type="button" className="tool-btn" onClick={onToggleTheme}>
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        <div className="header-auth-group">
          <button type="button" className="tool-btn auth-btn" onClick={() => onAuthAction("auth")}>
            Login
          </button>
          <button type="button" className="tool-btn auth-btn auth-signup" onClick={() => onAuthAction("auth")}>
            Signup
          </button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
