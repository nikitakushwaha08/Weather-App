# SkyCast Weather App (React + Vite)

A modern, responsive weather dashboard with multi-page navigation, smart city search, geolocation, air quality insights, and travel planning support.

## Features

- Header layout: logo -> navigation -> search/controls -> login/signup
- Smart search with city suggestions and recent searches
- Current location weather using browser geolocation
- Voice search (supported browsers)
- Dark/light mode toggle
- Dynamic weather backgrounds (sunny, cloudy, rainy, storm, snow)
- Home dashboard:
  - current weather card
  - hourly forecast strip
  - 7-day forecast
  - metrics (humidity, wind, pressure, AQI)
  - map preview
  - alert/AI-style weather tips
- Dedicated pages:
  - Home
  - Forecast
  - Radar
  - Air Quality
  - Compare Cities
  - Travel Planner
  - Analytics
  - Dashboard (user-focused)
  - Auth (login/signup UI)

## Tech Stack

- React 18
- Vite 5
- JavaScript (ES modules)
- Custom CSS (glassmorphism UI)
- OpenWeather API (primary)
- Open-Meteo + Open-Meteo Air Quality APIs (fallback + extended forecast/air data)
- OpenStreetMap embed (map preview)

## Project Structure

```text
weather-app-react/
  src/
    api/
      weatherApi.js
    components/
      AppHeader.jsx
      AppFooter.jsx
    constants/
      weatherBackgrounds.js
    hooks/
      useBackgroundRotation.js
      useDashboardData.js
    pages/
      HomePage.jsx
      ForecastPage.jsx
      RadarPage.jsx
      AirQualityPage.jsx
      CompareCitiesPage.jsx
      TravelPlannerPage.jsx
      AnalyticsPage.jsx
      DashboardPage.jsx
      AuthPage.jsx
    App.jsx
    Weather.jsx
    Weather.css
    index.css
    main.jsx
  env.example
  package.json
  vite.config.js
```

## Getting Started

### 1) Install

```bash
npm install
```

### 2) Configure environment

Create `.env` in project root:

```env
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key_here
VITE_OPENWEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5/weather
```

If `VITE_OPENWEATHER_API_KEY` is missing, the app automatically falls back to public Open-Meteo endpoints for core weather flows.

### 3) Run locally

```bash
npm run dev
```

### 4) Build production bundle

```bash
npm run build
```

### 5) Preview production build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build to `dist/`
- `npm run preview` - preview built app locally

## Notes

- Voice search requires `SpeechRecognition` support (WebKit-based browsers usually work best).
- Geolocation requires browser permission.
- Do not commit real API keys.
