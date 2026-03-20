function TravelPlannerPage({
  destination,
  travelDate,
  onDestinationChange,
  onDateChange,
  onPlanTrip,
  travelInsight
}) {
  return (
    <section className="page-content">
      <article className="glass-card section-card">
        <h2>Travel Planner ✈️</h2>
        <div className="planner-form">
          <input
            type="text"
            placeholder="Destination city"
            value={destination}
            onChange={(event) => onDestinationChange(event.target.value)}
          />
          <input type="date" value={travelDate} onChange={(event) => onDateChange(event.target.value)} />
          <button type="button" onClick={onPlanTrip}>
            Plan Travel
          </button>
        </div>
      </article>

      <article className="glass-card section-card">
        <h3>Expected Weather</h3>
        {travelInsight ? (
          <div className="alerts-wrap">
            <div className="alert-chip">
              {travelInsight.city}: {travelInsight.summary}
            </div>
            <div className="alert-chip secondary">Best day: {travelInsight.bestDay}</div>
            <div className="alert-chip secondary">Packing: {travelInsight.packingTip}</div>
          </div>
        ) : (
          <p className="meta-line">Enter destination and date to get travel recommendations.</p>
        )}
      </article>
    </section>
  );
}

export default TravelPlannerPage;
