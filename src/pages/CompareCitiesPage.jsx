function CompareCitiesPage({ comparedCities }) {
  return (
    <section className="page-content">
      <article className="glass-card section-card">
        <h2>Compare Cities</h2>
        <p className="meta-line">Quick comparison of temperature and humidity.</p>
      </article>

      <article className="glass-card section-card">
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>City</th>
                <th>Temp</th>
                <th>Humidity</th>
              </tr>
            </thead>
            <tbody>
              {comparedCities.map((city) => (
                <tr key={city.name}>
                  <td>{city.name}</td>
                  <td>{Math.round(Number(city.temp || 0))}deg C</td>
                  <td>{Math.round(Number(city.humidity || 0))}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

export default CompareCitiesPage;
