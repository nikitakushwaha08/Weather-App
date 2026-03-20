function AnalyticsPage({ dailyForecast }) {
  const points = dailyForecast.slice(0, 7).map((day, index) => ({
    x: 40 + index * 60,
    y: 180 - Math.round(Number(day.max || 0) * 2),
    label: day.weekday
  }));
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <section className="page-content">
      <article className="glass-card section-card">
        <h2>Analytics 📈</h2>
        <p className="meta-line">Temperature trend and rainfall probability snapshot.</p>
      </article>

      <article className="glass-card section-card">
        <h3>Temperature Trend</h3>
        <svg viewBox="0 0 450 220" className="analytics-chart" role="img" aria-label="Temperature trend chart">
          <path d={path} fill="none" stroke="currentColor" strokeWidth="3" />
          {points.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="4" />
              <text x={point.x - 14} y={210} fontSize="12">
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </article>
    </section>
  );
}

export default AnalyticsPage;
