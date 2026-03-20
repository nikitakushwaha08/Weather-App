import { useEffect, useMemo, useState } from "react";
import "./Weather.css";
import {
  getCityForecast,
  getCitySuggestions,
  getCurrentWeather,
  getDailyForecastByCoordinates,
  getWeatherByCoordinates
} from "./api/weatherApi";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import { WEATHER_BACKGROUNDS } from "./constants/weatherBackgrounds";
import { useBackgroundRotation } from "./hooks/useBackgroundRotation";
import { useDashboardData } from "./hooks/useDashboardData";
import AirQualityPage from "./pages/AirQualityPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AuthPage from "./pages/AuthPage";
import CompareCitiesPage from "./pages/CompareCitiesPage";
import DashboardPage from "./pages/DashboardPage";
import ForecastPage from "./pages/ForecastPage";
import HomePage from "./pages/HomePage";
import RadarPage from "./pages/RadarPage";
import TravelPlannerPage from "./pages/TravelPlannerPage";

const DEFAULT_COMPARE_CITIES = ["Delhi", "Mumbai", "London"];
const NAV_IDS = new Set(["home", "forecast", "radar", "air-quality", "compare-cities", "travel-planner", "analytics", "dashboard", "auth"]);

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bgClass, setBgClass] = useState("default");
  const [headerQuery, setHeaderQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    const stored = window.localStorage.getItem("recent-weather-searches");
    return stored ? JSON.parse(stored) : [];
  });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [comparedCities, setComparedCities] = useState([]);
  const [weatherUnit, setWeatherUnit] = useState("Celsius");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelInsight, setTravelInsight] = useState(null);
  const [activePage, setActivePage] = useState("home");
  const [activeNav, setActiveNav] = useState("home");

  const { bgIndex, baseBgIndex, isBgFading } = useBackgroundRotation(WEATHER_BACKGROUNDS);
  const { aqiValue, hourlyForecast, airDetails } = useDashboardData(weatherData?.name);
  const isVoiceSupported = typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  const updateBackground = (condition = "") => {
    const value = condition.toLowerCase();
    if (value.includes("clear")) return setBgClass("sunny");
    if (value.includes("cloud") || value.includes("mist") || value.includes("haze") || value.includes("fog")) {
      return setBgClass("cloudy");
    }
    if (value.includes("rain") || value.includes("drizzle")) return setBgClass("rainy");
    if (value.includes("thunder")) return setBgClass("storm");
    if (value.includes("snow")) return setBgClass("snow");
    return setBgClass("default");
  };

  const addRecentSearch = (cityName) => {
    const cleaned = cityName.trim();
    if (!cleaned) return;
    setRecentSearches((prev) => {
      const next = [cleaned, ...prev.filter((entry) => entry.toLowerCase() !== cleaned.toLowerCase())].slice(0, 6);
      window.localStorage.setItem("recent-weather-searches", JSON.stringify(next));
      return next;
    });
  };

  const mapDailyForecast = (payload) => {
    const daily = payload?.daily || {};
    const times = daily.time || [];
    const max = daily.temperature_2m_max || [];
    const min = daily.temperature_2m_min || [];
    const sunrise = daily.sunrise || [];
    const sunset = daily.sunset || [];
    const rainProbability = daily.precipitation_probability_max || [];
    return times.map((date, index) => ({
      date,
      weekday: new Date(date).toLocaleDateString([], { weekday: "short" }),
      max: max[index],
      min: min[index],
      sunrise: sunrise[index]
        ? new Date(sunrise[index]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : null,
      sunset: sunset[index]
        ? new Date(sunset[index]).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : null,
      rainProbability: rainProbability[index]
    }));
  };

  const loadDailyForecast = async (lat, lon) => {
    const payload = await getDailyForecastByCoordinates(lat, lon, 7);
    setDailyForecast(mapDailyForecast(payload));
  };

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return;
    try {
      setLoading(true);
      setError("");
      const data = await getCurrentWeather(cityName);
      setWeatherData(data);
      updateBackground(data.weather?.[0]?.main);
      addRecentSearch(data.name || cityName);
      setHeaderQuery(data.name || cityName);
      if (data?.coord?.lat && data?.coord?.lon) {
        await loadDailyForecast(data.coord.lat, data.coord.lon);
      }
    } catch (err) {
      setWeatherData(null);
      setBgClass("default");
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleHeaderSearch = (queryValue) => {
    const nextQuery = String(queryValue || headerQuery || "").trim();
    if (!nextQuery) return;
    setShowSuggestions(false);
    fetchWeather(nextQuery);
  };

  const handleSelectSuggestion = (item) => {
    setHeaderQuery(item.name);
    setShowSuggestions(false);
    fetchWeather(item.name);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const data = await getWeatherByCoordinates(lat, lon, "My Location");
          setWeatherData(data);
          updateBackground(data.weather?.[0]?.main);
          setHeaderQuery("My Location");
          await loadDailyForecast(lat, lon);
          setActivePage("home");
          setActiveNav("home");
        } catch (err) {
          setError(err.message || "Unable to fetch current location weather.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied. Please allow location permissions.");
        setLoading(false);
      }
    );
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice search is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript.trim()) {
        setHeaderQuery(transcript.trim());
        handleHeaderSearch(transcript.trim());
      }
    };
    recognition.onerror = () => {
      setError("Unable to capture voice input. Try again.");
    };
    recognition.start();
  };

  const handleNavClick = (navId) => {
    const nextNavId = NAV_IDS.has(navId) ? navId : "home";
    setShowSuggestions(false);
    setActiveNav(nextNavId);
    setActivePage(nextNavId);
  };

  useEffect(() => {
    fetchWeather("Delhi");
  }, []);

  useEffect(() => {
    if (!headerQuery.trim() || headerQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const result = await getCitySuggestions(headerQuery, 6);
        if (!cancelled) {
          setSuggestions(result);
        }
      } catch {
        if (!cancelled) {
          setSuggestions([]);
        }
      }
    }, 220);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [headerQuery]);

  useEffect(() => {
    const clickHandler = (event) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest(".header-search")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, []);

  useEffect(() => {
    const syncComparedCities = async () => {
      const targetCities = [...new Set([weatherData?.name, ...DEFAULT_COMPARE_CITIES].filter(Boolean))].slice(0, 3);
      const responses = await Promise.all(
        targetCities.map(async (cityName) => {
          try {
            const cityWeather = await getCurrentWeather(cityName);
            return {
              name: cityWeather.name,
              temp: cityWeather.main?.temp,
              humidity: cityWeather.main?.humidity
            };
          } catch {
            return null;
          }
        })
      );
      setComparedCities(responses.filter(Boolean));
    };

    if (weatherData?.name) {
      syncComparedCities();
    }
  }, [weatherData?.name]);

  const mapUrl = useMemo(() => {
    const lat = Number(weatherData?.coord?.lat);
    const lon = Number(weatherData?.coord?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return "";
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.45}%2C${lat - 0.24}%2C${lon + 0.45}%2C${lat + 0.24}&layer=mapnik&marker=${lat}%2C${lon}`;
  }, [weatherData?.coord?.lat, weatherData?.coord?.lon]);

  const handlePlanTrip = async () => {
    const targetCity = destination || weatherData?.name;
    if (!targetCity) return;
    try {
      const { place, forecast } = await getCityForecast(targetCity, 7);
      const mapped = mapDailyForecast(forecast);
      const selectedDay = mapped.find((item) => item.date === travelDate) || mapped[0];
      if (!selectedDay) return;
      setTravelInsight({
        city: `${place.name}${place.country ? `, ${place.country}` : ""}`,
        summary: `${selectedDay.weekday}: ${Math.round(Number(selectedDay.max || 0))}deg / ${Math.round(
          Number(selectedDay.min || 0)
        )}deg, rain ${Math.round(Number(selectedDay.rainProbability || 0))}%`,
        bestDay: mapped.reduce((best, current) =>
          Number(current.rainProbability || 0) < Number(best.rainProbability || 101) ? current : best
        ).weekday,
        packingTip:
          Number(selectedDay.rainProbability || 0) > 45
            ? "Carry umbrella and light waterproof layer."
            : Number(selectedDay.max || 0) > 30
              ? "Carry breathable cotton clothes and water bottle."
              : "Carry a light jacket for cooler hours."
      });
    } catch (err) {
      setError(err.message || "Unable to plan travel right now.");
    }
  };

  const renderPage = () => {
    if (activePage === "forecast") {
      return <ForecastPage hourlyForecast={hourlyForecast} dailyForecast={dailyForecast} />;
    }
    if (activePage === "radar") {
      return <RadarPage mapUrl={mapUrl} />;
    }
    if (activePage === "air-quality") {
      return <AirQualityPage aqiValue={aqiValue} airDetails={airDetails} />;
    }
    if (activePage === "compare-cities") {
      return <CompareCitiesPage comparedCities={comparedCities} />;
    }
    if (activePage === "travel-planner") {
      return (
        <TravelPlannerPage
          destination={destination}
          travelDate={travelDate}
          onDestinationChange={setDestination}
          onDateChange={setTravelDate}
          onPlanTrip={handlePlanTrip}
          travelInsight={travelInsight}
        />
      );
    }
    if (activePage === "analytics") {
      return <AnalyticsPage dailyForecast={dailyForecast} />;
    }
    if (activePage === "dashboard") {
      return (
        <DashboardPage
          isLoggedIn={isLoggedIn}
          savedCities={recentSearches}
          onQuickCitySelect={fetchWeather}
          weatherUnit={weatherUnit}
          onToggleUnit={() =>
            setWeatherUnit((prev) => (prev === "Celsius" ? "Fahrenheit" : "Celsius"))
          }
          notificationsEnabled={notificationsEnabled}
          onToggleNotifications={() => setNotificationsEnabled((prev) => !prev)}
          isDarkMode={isDarkMode}
        />
      );
    }
    if (activePage === "auth") {
      return (
        <AuthPage
          authMode={authMode}
          onSwitchMode={setAuthMode}
          authForm={authForm}
          onUpdateAuthForm={(field, value) =>
            setAuthForm((prev) => ({
              ...prev,
              [field]: value
            }))
          }
          onSubmitAuth={() => {
            setIsLoggedIn(true);
            setActivePage("dashboard");
            setActiveNav("dashboard");
            setAuthForm({ name: "", email: "", password: "" });
          }}
        />
      );
    }

    return (
      <HomePage
        loading={loading}
        error={error}
        weatherData={weatherData}
        hourlyForecast={hourlyForecast}
        dailyForecast={dailyForecast}
        aqiValue={aqiValue}
        mapUrl={mapUrl}
      />
    );
  };

  return (
    <section className={`weather-page ${isDarkMode ? "theme-dark" : "theme-light"} ${bgClass}`} id="home">
      <div
        className="bg-layer bg-base"
        style={{ "--bg-image": `url("${WEATHER_BACKGROUNDS[baseBgIndex]}")` }}
      />
      <div
        className={`bg-layer bg-fade ${isBgFading ? "visible" : ""}`}
        style={{ "--bg-image": `url("${WEATHER_BACKGROUNDS[bgIndex]}")` }}
      />

      <AppHeader
        headerQuery={headerQuery}
        setHeaderQuery={(value) => {
          setHeaderQuery(value);
          setShowSuggestions(true);
        }}
        onHeaderSearch={handleHeaderSearch}
        onSelectSuggestion={handleSelectSuggestion}
        suggestions={suggestions}
        recentSearches={recentSearches}
        showSuggestions={showSuggestions}
        onUseCurrentLocation={handleUseCurrentLocation}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        isDarkMode={isDarkMode}
        onVoiceSearch={handleVoiceSearch}
        isVoiceSupported={isVoiceSupported}
        onAuthAction={(nextPage) => {
          if (nextPage === "auth") {
            setAuthMode("login");
            setActiveNav("auth");
            setActivePage("auth");
            return;
          }
          setActiveNav("dashboard");
          setActivePage("dashboard");
        }}
        activeNav={activeNav}
        onNavClick={handleNavClick}
      />

      <main className="page-shell">{renderPage()}</main>
      <AppFooter />
    </section>
  );
}

export default Weather;
