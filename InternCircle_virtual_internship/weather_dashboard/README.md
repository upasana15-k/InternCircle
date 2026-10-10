# 🌤️ AtmosphereLive — Real-Time Weather Dashboard with Fetch API

A real-time meteorological weather web application built with **Modern Semantic HTML5**, **Modern CSS3 (Meteorological Glassmorphism)**, and **ES6+ Asynchronous JavaScript (`fetch` & `async/await`)**.

Developed for the **InternCircle Virtual Internship** — Project: *Live Weather Dashboard with Fetch API*.

---

## 🌟 Key Highlights & Engineering Features

### 1. Asynchronous JavaScript & Robust Fetch API
- **Keyless, Free & Real-Time Open-Meteo REST APIs**:
  - **Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search` for real-time worldwide city geocoding and live debounced autocomplete search suggestions.
  - **Weather Forecast API**: `https://api.open-meteo.com/v1/forecast` delivering real-time telemetry, 24-hour hourly timeline, and 7-day daily forecasts.
  - **Air Quality API**: `https://air-quality-api.open-meteo.com/v1/air-quality` providing live European & US Air Quality Index (AQI) and PM2.5 monitoring.
- **Parallel Asynchronous Loading**: Uses `Promise.all` to fetch weather and atmospheric telemetry concurrently without blocking.
- **Graceful Error Handling**: Structured `try/catch/finally` blocks with descriptive user error banners and skeleton loading states.

### 2. Dynamic DOM Injection & Visual Wow Factor
- **Custom SVG Weather Visuals**: Animated, high-contrast SVG weather icons for Clear/Sunny, Cloudy, Drizzle, Rain, Heavy Rain, Snow, and Thunderstorm.
- **Dynamic Weather Atmosphere Theming**: Dynamic `data-weather="clear|rain|clouds|thunderstorm|snow"` attribute on `<html>` shifts background ambient gradients and light orbs in real time to match current atmospheric conditions.
- **Interactive 24-Hour Timeline Carousel**: Horizontal scrollable hourly forecast cards with hourly temperatures, SVG weather glyphs, and precipitation chances.
- **5-Day Extended Outlook**: Itemized daily cards with day names, weather descriptions, precipitation probabilities, and visual min-to-max temperature gradient bars.

### 3. Comprehensive Bento Meteorological Metrics
- **Air Quality Index (AQI)**: Good, Moderate, and Unhealthy indicators with gauge bar.
- **Wind & Compass Dial**: Live wind speed in km/h with an animated 360-degree rotating compass needle.
- **UV Index Tracker**: Solar radiation index with risk classification tags (Low, Moderate, High, Very High) and sunscreen advisories.
- **Humidity & Dew Point**: Relative humidity percentage with gauge bar and calculated dew point temperature.
- **Sun Position & Daylight Arc**: Visual quadratic bezier trajectory curve tracking the sun's journey between Sunrise and Sunset with live daylight remaining countdown.
- **Barometric Pressure & Visibility**: Sea-level atmospheric pressure (hPa) and optical visibility range.

### 4. Interactive UX Capabilities
- **Temperature Unit Switcher**: Instant one-click toggle between Celsius (°C) and Fahrenheit (°F) with immediate DOM re-calculation.
- **HTML5 Geolocation API**: "Current Location" button to auto-detect the user's GPS coordinates and reverse-geocode local weather.
- **Quick Preset City Chips**: Instant one-click access to major world capitals (New Delhi, London, Tokyo, New York, Paris, Dubai, Sydney, Singapore).
- **Persistent Favorites**: Save favorite cities via `localStorage` with a star toggle button.
- **Search Validation & Autocomplete**: Debounced live city suggestions dropdown with instant keyboard and touch selection.

---

## 📁 Project File Structure

```
weather_dashboard/
├── index.html        # Semantic HTML5 markup, accessible search, bento grid layout
├── style.css         # Modern CSS3 with custom properties, glassmorphism, responsive breakpoints
├── app.js            # Asynchronous fetch API engine, dynamic DOM rendering, state management
└── README.md         # Comprehensive project documentation
```

---

## 🚀 How to Run Locally

1. Open the project directory:
   ```bash
   cd weather_dashboard
   ```
2. Open `index.html` in any modern web browser, or serve with VS Code **Live Server** (`http://127.0.0.1:5500`).
3. Zero npm install or external API keys required — works completely out of the box!

---

## 👩‍💻 Author & Attribution

- **Author**: Upasana Kudape
- **Internship**: InternCircle Virtual Internship
- **Track**: Web Development — Frontend Engineering
