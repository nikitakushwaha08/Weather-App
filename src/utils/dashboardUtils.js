export function getWeatherSymbol(condition = "") {
  const value = String(condition).toLowerCase();
  if (value.includes("clear")) return "sun";
  if (
    value.includes("cloud") ||
    value.includes("mist") ||
    value.includes("fog")
  )
    return "cloud";
  if (value.includes("rain") || value.includes("drizzle")) return "rain";
  if (value.includes("snow")) return "snow";
  if (value.includes("thunder")) return "storm";
  return "default";
}

export function getHourlyLabel(timeValue) {
  if (!timeValue) return "--:--";
  const parsed = new Date(timeValue);
  if (Number.isNaN(parsed.getTime())) return "--:--";
  return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function getAqiCategory(aqi) {
  if (aqi === null || aqi === undefined || Number.isNaN(Number(aqi))) {
    return "Unavailable";
  }
  const value = Number(aqi);
  if (value <= 50) return "Good";
  if (value <= 100) return "Moderate";
  if (value <= 150) return "Unhealthy for Sensitive";
  if (value <= 200) return "Unhealthy";
  if (value <= 300) return "Very Unhealthy";
  return "Hazardous";
}
