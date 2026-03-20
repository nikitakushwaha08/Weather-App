function RadarPage({ mapUrl }) {
  return (
    <section className="page-content">
      <article className="glass-card section-card">
        <h2>Live Radar 🌍</h2>
        <p className="meta-line">Rain movement and cloud coverage map (zoom and drag enabled).</p>
      </article>

      <article className="glass-card section-card">
        {mapUrl ? (
          <iframe title="radar-map" src={mapUrl} className="radar-map" loading="lazy" />
        ) : (
          <p className="meta-line">Radar unavailable for this location.</p>
        )}
      </article>
    </section>
  );
}

export default RadarPage;
