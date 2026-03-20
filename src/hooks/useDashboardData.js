import { useEffect, useState } from "react";

export function useDashboardData(cityName) {
  const [aqiValue, setAqiValue] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [airDetails, setAirDetails] = useState({
    pm2_5: null,
    pm10: null,
    carbon_monoxide: null
  });
  const [dashboardLoading, setDashboardLoading] = useState(false);

  useEffect(() => {
    if (!cityName) return;

    let isCancelled = false;

    const fetchDashboardData = async () => {
      setDashboardLoading(true);
      try {
        const geocodeRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            cityName,
          )}&count=1&language=en&format=json`,
        );
        if (!geocodeRes.ok) {
          throw new Error("Unable to load dashboard data.");
        }

        const geocodeData = await geocodeRes.json();
        const place = geocodeData?.results?.[0];
        if (!place) {
          if (!isCancelled) {
            setHourlyForecast([]);
            setAqiValue(null);
            setAirDetails({
              pm2_5: null,
              pm10: null,
              carbon_monoxide: null
            });
          }
          return;
        }

        const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&hourly=temperature_2m,weather_code&forecast_days=2&timezone=auto`;
        const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${place.latitude}&longitude=${place.longitude}&hourly=us_aqi,pm10,pm2_5,carbon_monoxide&timezone=auto`;

        const [forecastRes, airRes] = await Promise.all([
          fetch(forecastUrl),
          fetch(airUrl),
        ]);
        if (!forecastRes.ok || !airRes.ok) {
          throw new Error("Unable to load dashboard data.");
        }

        const forecastData = await forecastRes.json();
        const airData = await airRes.json();

        const times = forecastData?.hourly?.time || [];
        const temps = forecastData?.hourly?.temperature_2m || [];
        const now = Date.now();

        let startIndex = times.findIndex(
          (timeItem) => new Date(timeItem).getTime() >= now - 30 * 60 * 1000,
        );
        if (startIndex < 0) startIndex = 0;

        const nextHours = times
          .slice(startIndex, startIndex + 8)
          .map((timeItem, idx) => ({
            time: timeItem,
            temp: temps[startIndex + idx],
          }));

        const aqiTimes = airData?.hourly?.time || [];
        const aqiValues = airData?.hourly?.us_aqi || [];
        const pm10Values = airData?.hourly?.pm10 || [];
        const pm25Values = airData?.hourly?.pm2_5 || [];
        const coValues = airData?.hourly?.carbon_monoxide || [];
        let aqiIndex = aqiTimes.findIndex(
          (timeItem) => new Date(timeItem).getTime() >= now - 30 * 60 * 1000,
        );
        if (aqiIndex < 0) aqiIndex = 0;
        const nextAqi = aqiValues[aqiIndex];

        if (!isCancelled) {
          setHourlyForecast(nextHours);
          setAqiValue(
            Number.isFinite(Number(nextAqi))
              ? Math.round(Number(nextAqi))
              : null,
          );
          setAirDetails({
            pm2_5: Number.isFinite(Number(pm25Values[aqiIndex]))
              ? Number(pm25Values[aqiIndex]).toFixed(1)
              : null,
            pm10: Number.isFinite(Number(pm10Values[aqiIndex]))
              ? Number(pm10Values[aqiIndex]).toFixed(1)
              : null,
            carbon_monoxide: Number.isFinite(Number(coValues[aqiIndex]))
              ? Number(coValues[aqiIndex]).toFixed(0)
              : null
          });
        }
      } catch {
        if (!isCancelled) {
          setHourlyForecast([]);
          setAqiValue(null);
          setAirDetails({
            pm2_5: null,
            pm10: null,
            carbon_monoxide: null
          });
        }
      } finally {
        if (!isCancelled) {
          setDashboardLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isCancelled = true;
    };
  }, [cityName]);

  return { aqiValue, hourlyForecast, airDetails, dashboardLoading };
}
