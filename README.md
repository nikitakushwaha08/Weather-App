# Weather App React

A simple and responsive weather application built with React and Vite.  
It fetches real-time weather data from the OpenWeatherMap API and shows:

- City and country
- Temperature (Celsius)
- Weather condition and icon
- Humidity
- Wind speed

The UI background changes dynamically based on weather conditions (sunny, cloudy, rainy, storm, snow, default).

---

## Tech Stack

- React 18
- Vite 5
- JavaScript (ES modules)
- OpenWeatherMap API
- CSS (custom styling)

---

## Project Structure

```text
weather-app-react/
  src/
    api/
      weatherApi.js       # API layer: URL building, config validation, error mapping
    App.jsx               # Root UI composition
    Weather.jsx           # Main weather UI + state management
    Weather.css           # Component styles
    index.css             # Global styles
    main.jsx              # React entry point
  env.example             # Environment variable template
  vite.config.js          # Vite configuration
  package.json            # Scripts and dependencies
```

---

## How It Works

1. App starts and `Weather` component loads.
2. On initial render, app fetches default city weather (`Delhi`).
3. User enters any city name and submits form.
4. `Weather.jsx` calls API layer function `getCurrentWeather(cityName)`.
5. API response is stored in state and shown in UI.
6. If request fails (invalid city, key, server issue), user-friendly error is displayed.

---

## API Layer

`src/api/weatherApi.js` centralizes all API-related logic:

- Reads env values (`VITE_OPENWEATHER_API_KEY`, optional `VITE_OPENWEATHER_API_BASE_URL`)
- Builds request URL
- Converts HTTP status codes into user-friendly errors:
  - `401`: Invalid API key
  - `404`: City not found
  - `5xx`: Weather service unavailable
- If API key is missing, app automatically uses a public fallback weather source so city search still works

This keeps UI components clean and easier to maintain.

---

## Setup Instructions

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file in the project root:

```env
VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key_here
VITE_OPENWEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5/weather
```

You can copy from `env.example`.

### 3) Run development server

```bash
npm run dev
```

### 4) Build for production

```bash
npm run build
```

### 5) Preview production build

```bash
npm run preview
```

---

## Available Scripts

- `npm run dev` - start local Vite dev server
- `npm run build` - create production build in `dist/`
- `npm run preview` - preview production build locally

---

## Common Issues and Fixes

### 1) `404 (Not Found)` in browser

Possible reasons:

- Wrong route/asset path when opening build files directly
- Invalid city name returned 404 from weather API

Fix:

- Use `npm run dev` or `npm run preview` instead of opening `dist/index.html` directly
- Check Network tab to see whether 404 is from `/assets/...` or `api.openweathermap.org`
- Verify city spelling

### 2) `Invalid API key`

Fix:

- Ensure `.env` exists in project root
- Set `VITE_OPENWEATHER_API_KEY` correctly
- Restart dev server after editing `.env`

### 3) Environment variables not loading

Fix:

- Variable names must start with `VITE_`
- Restart Vite server after changing env values

---

## Security Note

- `.env` and `.env.local` are ignored in `.gitignore`
- Never commit real API keys to public repositories

---

## Future Improvements

- Add 5-day forecast
- Add geolocation ("Current location weather")
- Add unit switch (Celsius/Fahrenheit)
- Add debounce for search input
- Add test coverage (unit + integration)

---

## License

This project is for learning and personal use.  
Add your preferred license if you plan to distribute it publicly.
