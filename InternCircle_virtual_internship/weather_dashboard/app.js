/**
 * ============================================================================
 * AtmosphereLive — Real-Time Weather Dashboard & 5-Day Forecast
 * Asynchronous JavaScript with Fetch API & Dynamic DOM Injection
 * Author: Upasana Kudape (InternCircle Virtual Internship)
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// Global Application State
// ----------------------------------------------------------------------------
const state = {
  currentCity: 'New Delhi',
  countryCode: 'IN',
  latitude: 28.6139,
  longitude: 77.2090,
  timezone: 'Asia/Kolkata',
  temperatureUnit: 'c', // 'c' or 'f'
  weatherData: null,
  airQualityData: null,
  favorites: JSON.parse(localStorage.getItem('atmosphere_favorites') || '["New Delhi", "Tokyo", "London"]'),
  recentSearches: JSON.parse(localStorage.getItem('atmosphere_recent') || '[]'),
  isFetching: false
};

// ----------------------------------------------------------------------------
// WMO Weather Code Interpretations & SVG Icon Mapping
// Standard WMO (World Meteorological Organization) weather interpretation codes
// ----------------------------------------------------------------------------
const WMO_WEATHER_MAP = {
  0: { label: 'Clear Sky', category: 'clear', icon: 'sun' },
  1: { label: 'Mainly Clear', category: 'clear', icon: 'sun_cloud' },
  2: { label: 'Partly Cloudy', category: 'clouds', icon: 'cloud_sun' },
  3: { label: 'Overcast', category: 'clouds', icon: 'cloud' },
  45: { label: 'Foggy & Misty', category: 'clouds', icon: 'fog' },
  48: { label: 'Depositing Rime Fog', category: 'clouds', icon: 'fog' },
  51: { label: 'Light Drizzle', category: 'drizzle', icon: 'drizzle' },
  53: { label: 'Moderate Drizzle', category: 'drizzle', icon: 'drizzle' },
  55: { label: 'Dense Drizzle', category: 'drizzle', icon: 'drizzle' },
  61: { label: 'Slight Rain', category: 'rain', icon: 'rain' },
  63: { label: 'Moderate Rain', category: 'rain', icon: 'rain' },
  65: { label: 'Heavy Torrential Rain', category: 'rain', icon: 'heavy_rain' },
  71: { label: 'Slight Snowfall', category: 'snow', icon: 'snow' },
  73: { label: 'Moderate Snowfall', category: 'snow', icon: 'snow' },
  75: { label: 'Heavy Snowfall', category: 'snow', icon: 'snow' },
  77: { label: 'Snow Grains', category: 'snow', icon: 'snow' },
  80: { label: 'Slight Rain Showers', category: 'rain', icon: 'rain' },
  81: { label: 'Moderate Rain Showers', category: 'rain', icon: 'rain' },
  82: { label: 'Violent Rain Showers', category: 'rain', icon: 'heavy_rain' },
  85: { label: 'Slight Snow Showers', category: 'snow', icon: 'snow' },
  86: { label: 'Heavy Snow Showers', category: 'snow', icon: 'snow' },
  95: { label: 'Thunderstorm', category: 'thunderstorm', icon: 'thunder' },
  96: { label: 'Thunderstorm with Slight Hail', category: 'thunderstorm', icon: 'thunder_hail' },
  99: { label: 'Severe Thunderstorm with Heavy Hail', category: 'thunderstorm', icon: 'thunder_hail' }
};

// ----------------------------------------------------------------------------
// Weather SVG Visuals Generator
// ----------------------------------------------------------------------------
function getWeatherSvg(iconKey, isDay = true, size = 64) {
  const isNight = !isDay;

  switch (iconKey) {
    case 'sun':
      if (isNight) {
        return `
          <svg viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
            <path d="M44 32C44 43.0457 35.0457 52 24 52C21.8485 52 19.7828 51.6596 17.8516 51.0298C23.7712 55.3377 31.084 57.8 39 57.8C51.1503 57.8 61 47.9503 61 35.8C61 27.884 58.5377 20.5712 54.2298 14.6516C54.8596 16.5828 55.2 18.6485 55.2 20.8C55.2 31.8457 46.2457 40.8 35.2 40.8" fill="#f8fafc" stroke="#38bdf8" stroke-width="2"/>
            <circle cx="28" cy="20" r="1.5" fill="#38bdf8"/>
            <circle cx="42" cy="18" r="2" fill="#38bdf8"/>
          </svg>
        `;
      }
      return `
        <svg viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
          <circle cx="32" cy="32" r="14" fill="#fbbf24" stroke="#f59e0b" stroke-width="2.5" />
          <g stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round">
            <line x1="32" y1="8" x2="32" y2="13"/>
            <line x1="32" y1="51" x2="32" y2="56"/>
            <line x1="8" y1="32" x2="13" y2="32"/>
            <line x1="51" y1="32" x2="56" y2="32"/>
            <line x1="15.03" y1="15.03" x2="18.57" y2="18.57"/>
            <line x1="45.43" y1="45.43" x2="48.97" y2="48.97"/>
            <line x1="15.03" y1="48.97" x2="18.57" y2="45.43"/>
            <line x1="45.43" y1="18.57" x2="48.97" y2="15.03"/>
          </g>
        </svg>
      `;

    case 'sun_cloud':
    case 'cloud_sun':
      return `
        <svg viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
          <circle cx="26" cy="24" r="10" fill="#fbbf24" stroke="#f59e0b" stroke-width="2" />
          <path d="M22 48h24a10 10 0 0 0 1.2-19.93 14 14 0 0 0-26.4 0A10 10 0 0 0 22 48z" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2.5" />
        </svg>
      `;

    case 'cloud':
    case 'fog':
      return `
        <svg viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
          <path d="M18 44h28a11 11 0 0 0 1.3-21.92 15 15 0 0 0-28.6 0A11 11 0 0 0 18 44z" fill="#64748b" stroke="#94a3b8" stroke-width="2.5" />
        </svg>
      `;

    case 'rain':
    case 'drizzle':
      return `
        <svg viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
          <path d="M18 36h28a10 10 0 0 0 1.3-19.92 14 14 0 0 0-26.6 0A10 10 0 0 0 18 36z" fill="#475569" stroke="#94a3b8" stroke-width="2" />
          <g stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round">
            <line x1="22" y1="42" x2="19" y2="50"/>
            <line x1="32" y1="42" x2="29" y2="50"/>
            <line x1="42" y1="42" x2="39" y2="50"/>
          </g>
        </svg>
      `;

    case 'heavy_rain':
      return `
        <svg viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
          <path d="M18 34h28a10 10 0 0 0 1.3-19.92 14 14 0 0 0-26.6 0A10 10 0 0 0 18 34z" fill="#334155" stroke="#64748b" stroke-width="2" />
          <g stroke="#2563eb" stroke-width="2.5" stroke-linecap="round">
            <line x1="20" y1="40" x2="16" y2="52"/>
            <line x1="29" y1="40" x2="25" y2="52"/>
            <line x1="38" y1="40" x2="34" y2="52"/>
            <line x1="46" y1="40" x2="42" y2="52"/>
          </g>
        </svg>
      `;

    case 'thunder':
    case 'thunder_hail':
      return `
        <svg viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
          <path d="M18 32h28a10 10 0 0 0 1.3-19.92 14 14 0 0 0-26.6 0A10 10 0 0 0 18 32z" fill="#1e1b4b" stroke="#818cf8" stroke-width="2" />
          <polygon points="34 34 26 44 32 44 28 54 40 42 34 42" fill="#fbbf24" stroke="#f59e0b" stroke-width="1.5" />
        </svg>
      `;

    case 'snow':
      return `
        <svg viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
          <path d="M18 36h28a10 10 0 0 0 1.3-19.92 14 14 0 0 0-26.6 0A10 10 0 0 0 18 36z" fill="#475569" stroke="#94a3b8" stroke-width="2" />
          <g stroke="#e0f2fe" stroke-width="2" stroke-linecap="round">
            <line x1="22" y1="43" x2="22" y2="49"/>
            <line x1="19" y1="46" x2="25" y2="46"/>
            <line x1="32" y1="43" x2="32" y2="49"/>
            <line x1="29" y1="46" x2="35" y2="46"/>
            <line x1="42" y1="43" x2="42" y2="49"/>
            <line x1="39" y1="46" x2="45" y2="46"/>
          </g>
        </svg>
      `;

    default:
      return `
        <svg viewBox="0 0 64 64" width="${size}" height="${size}" fill="none">
          <circle cx="32" cy="32" r="14" fill="#fbbf24" stroke="#f59e0b" stroke-width="2.5" />
        </svg>
      `;
  }
}

// ----------------------------------------------------------------------------
// Core Asynchronous Fetch API Engine
// ----------------------------------------------------------------------------

/**
 * Fetch Coordinates for a City using Open-Meteo Geocoding REST API
 */
async function fetchCityCoordinates(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=5&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding API responded with HTTP status ${response.status}`);
    }
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      throw new Error(`No locations found matching "${cityName}". Please check the spelling.`);
    }
    return data.results;
  } catch (err) {
    console.warn('Geocoding API fetch failed:', err);
    throw err;
  }
}

/**
 * Fetch Real-Time Weather & 7-Day Forecast via Open-Meteo Weather API
 */
async function fetchWeatherData(lat, lon, tz = 'auto') {
  const weatherEndpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=${encodeURIComponent(tz)}`;

  const aqiEndpoint = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm2_5`;

  try {
    // Parallel Asynchronous Fetch for both Weather and Air Quality Telemetry
    const [weatherRes, aqiRes] = await Promise.all([
      fetch(weatherEndpoint),
      fetch(aqiEndpoint).catch(() => null) // Non-blocking AQI fallback
    ]);

    if (!weatherRes.ok) {
      throw new Error(`Weather telemetry API error (${weatherRes.status})`);
    }

    const weatherData = await weatherRes.json();
    let aqiData = null;
    if (aqiRes && aqiRes.ok) {
      aqiData = await aqiRes.json();
    }

    return { weather: weatherData, aqi: aqiData };
  } catch (err) {
    console.error('Fetch Weather failed:', err);
    throw err;
  }
}

// ----------------------------------------------------------------------------
// Master Controller: Search & Load City
// ----------------------------------------------------------------------------
async function loadCityWeather(cityName, preferredLocationObj = null) {
  if (state.isFetching) return;
  state.isFetching = true;

  showLoading(true);
  hideError();

  try {
    let target = preferredLocationObj;

    if (!target) {
      const results = await fetchCityCoordinates(cityName);
      target = results[0];
    }

    state.currentCity = target.name;
    state.countryCode = target.country_code || target.country || '';
    state.latitude = target.latitude;
    state.longitude = target.longitude;
    state.timezone = target.timezone || 'auto';

    // Fetch live weather data
    const { weather, aqi } = await fetchWeatherData(state.latitude, state.longitude, state.timezone);
    state.weatherData = weather;
    state.airQualityData = aqi;

    // Record in Recent Searches
    addRecentSearch(state.currentCity);

    // Dynamic DOM Injection
    renderDashboard();

    // Show toast
    showToast(`Weather updated for ${state.currentCity}, ${state.countryCode}!`);

  } catch (err) {
    showError(err.message || 'Unable to fetch weather data for this location.');
  } finally {
    state.isFetching = false;
    showLoading(false);
  }
}

// ----------------------------------------------------------------------------
// Dynamic DOM Injection & Rendering
// ----------------------------------------------------------------------------
function renderDashboard() {
  if (!state.weatherData) return;

  const current = state.weatherData.current;
  const daily = state.weatherData.daily;
  const hourly = state.weatherData.hourly;

  const wmoInfo = WMO_WEATHER_MAP[current.weather_code] || { label: 'Clear Sky', category: 'clear', icon: 'sun' };

  // 1. Update Global Theme Attributes
  document.documentElement.setAttribute('data-weather', wmoInfo.category);

  // Sync Weather FX Canvas & Mood Simulator Buttons
  if (window.weatherFx) {
    window.weatherFx.setMode(wmoInfo.category);
  }
  document.querySelectorAll('.scene-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-scene') === wmoInfo.category);
  });

  // Sync Quick Cities Preset Chips
  document.querySelectorAll('.quick-chips-scroll .city-chip').forEach(btn => {
    const isMatch = btn.getAttribute('data-city').toLowerCase() === state.currentCity.toLowerCase();
    btn.classList.toggle('active', isMatch);
  });

  // 2. City & Meta
  document.getElementById('currentCityName').textContent = state.currentCity;
  document.getElementById('currentCountryPill').textContent = state.countryCode;

  // Local Time formatted
  const now = new Date();
  const timeFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) + ` · Local ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  document.getElementById('currentTimestamp').textContent = timeFormatted;

  document.getElementById('currentConditionPill').textContent = wmoInfo.label;

  // 3. Temperatures
  const tempVal = convertTemp(current.temperature_2m);
  const feelsLikeVal = convertTemp(current.apparent_temperature);
  const dayHigh = convertTemp(daily.temperature_2m_max[0]);
  const dayLow = convertTemp(daily.temperature_2m_min[0]);
  const unitSymbol = state.temperatureUnit === 'c' ? '°C' : '°F';

  document.getElementById('currentTempVal').textContent = tempVal;
  document.getElementById('currentTempUnit').textContent = unitSymbol;
  document.getElementById('currentFeelsLikeVal').textContent = `${feelsLikeVal}${unitSymbol}`;
  document.getElementById('currentDayHighVal').textContent = `${dayHigh}${unitSymbol}`;
  document.getElementById('currentDayLowVal').textContent = `${dayLow}${unitSymbol}`;
  document.getElementById('currentPrecipVal').textContent = `${current.precipitation || 0} mm`;

  // 4. Hero Visual SVG
  const heroSvgContainer = document.getElementById('heroSvgContainer');
  heroSvgContainer.innerHTML = getWeatherSvg(wmoInfo.icon, current.is_day === 1, 120);

  // 5. Update Favorite Star State
  updateFavoriteStarUI();

  // 6. Render Hourly Timeline Carousel (Next 24 Hours)
  renderHourlyTimeline(hourly);

  // 7. Render 5-Day Extended Forecast
  renderFiveDayForecast(daily);

  // 8. Render Atmospheric Bento Metrics Grid
  renderBentoMetrics(current, daily);
}

/**
 * Render 24-Hour Timeline Carousel
 */
function renderHourlyTimeline(hourly) {
  const container = document.getElementById('hourlyTimelineContainer');
  if (!container || !hourly || !hourly.time) return;

  container.innerHTML = '';
  const unitSymbol = state.temperatureUnit === 'c' ? '°C' : '°F';
  const nowMs = Date.now();

  // Find the starting index closest to current hour
  let startIdx = 0;
  for (let i = 0; i < hourly.time.length; i++) {
    const itemTime = new Date(hourly.time[i]).getTime();
    if (itemTime >= nowMs - 1800000) {
      startIdx = i;
      break;
    }
  }

  // Slice next 24 hourly periods starting from current hour
  const hoursToShow = 24;
  for (let i = 0; i < hoursToShow && (startIdx + i) < hourly.time.length; i++) {
    const idx = startIdx + i;
    const timeStr = hourly.time[idx];
    const dateObj = new Date(timeStr);
    const hourLabel = i === 0 ? 'Now' : dateObj.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    const temp = convertTemp(hourly.temperature_2m[idx]);
    const wCode = hourly.weather_code[idx];
    const wInfo = WMO_WEATHER_MAP[wCode] || { icon: 'sun' };
    const precipProb = hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 0;
    const hourVal = dateObj.getHours();
    const isDay = hourVal >= 6 && hourVal < 19;

    const item = document.createElement('div');
    item.className = `hourly-item ${i === 0 ? 'now' : ''}`;
    item.innerHTML = `
      <span class="hourly-time">${hourLabel}</span>
      <div class="hourly-icon-wrap">
        ${getWeatherSvg(wInfo.icon, isDay, 30)}
      </div>
      <span class="hourly-temp">${temp}${unitSymbol}</span>
      <span class="hourly-precip">${precipProb > 0 ? `💧 ${precipProb}%` : ''}</span>
    `;
    container.appendChild(item);
  }
}

/**
 * Render 5-Day Extended Forecast List
 */
function renderFiveDayForecast(daily) {
  const container = document.getElementById('fiveDayListContainer');
  if (!container || !daily || !daily.time) return;

  container.innerHTML = '';
  const unitSymbol = state.temperatureUnit === 'c' ? '°C' : '°F';

  // Compute week's global temperature span for dynamic range bars
  const weekMin = Math.min(...daily.temperature_2m_min);
  const weekMax = Math.max(...daily.temperature_2m_max);
  const tempRange = Math.max(1, weekMax - weekMin);

  // 5-6 day extended daily outlook
  const daysCount = Math.min(6, daily.time.length);
  for (let i = 0; i < daysCount; i++) {
    const dateStr = daily.time[i];
    // Noon time parsing prevents timezone midnight day shifts
    const dateObj = new Date(dateStr + 'T12:00:00');
    const dayName = i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'short' }));
    const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const wCode = daily.weather_code[i];
    const wInfo = WMO_WEATHER_MAP[wCode] || { label: 'Clear Sky', icon: 'sun' };
    const minRaw = daily.temperature_2m_min[i];
    const maxRaw = daily.temperature_2m_max[i];
    const minTemp = convertTemp(minRaw);
    const maxTemp = convertTemp(maxRaw);
    const rainChance = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0;

    // Dynamic temperature gradient range bar positioning
    const leftPct = Math.round(((minRaw - weekMin) / tempRange) * 100);
    const widthPct = Math.max(16, Math.round(((maxRaw - minRaw) / tempRange) * 100));

    const row = document.createElement('div');
    row.className = 'fiveday-row';
    row.innerHTML = `
      <div class="day-label-group">
        <span class="day-name">${dayName}</span>
        <span class="day-date">${dateFormatted}</span>
      </div>
      <div class="fiveday-icon">
        ${getWeatherSvg(wInfo.icon, true, 26)}
      </div>
      <div class="fiveday-desc-wrap">
        <span>${wInfo.label}</span>
        ${rainChance > 20 ? `<small style="color:#60a5fa; margin-left:6px;">💧 ${rainChance}%</small>` : ''}
      </div>
      <div class="fiveday-range-bar-group">
        <span class="range-min">${minTemp}°</span>
        <div class="range-bar-track">
          <div class="range-bar-fill" style="margin-left: ${leftPct}%; width: ${Math.min(100 - leftPct, widthPct)}%;"></div>
        </div>
        <span class="range-max">${maxTemp}°</span>
      </div>
    `;
    container.appendChild(row);
  }
}

/**
 * Render Meteorological Metrics Bento Grid
 */
function renderBentoMetrics(current, daily) {
  // 1. Air Quality Index (AQI)
  const aqiBadge = document.getElementById('aqiBadge');
  const aqiDesc = document.getElementById('aqiDesc');
  const aqiFillBar = document.getElementById('aqiFillBar');

  if (state.airQualityData && state.airQualityData.current) {
    const usAqi = state.airQualityData.current.us_aqi || state.airQualityData.current.european_aqi * 20 || 35;
    let label = 'Good';
    let color = 'var(--accent-emerald)';
    let desc = 'Air quality is considered satisfactory, and air pollution poses little or no risk.';
    let pct = Math.min(100, (usAqi / 300) * 100);

    if (usAqi > 150) {
      label = `Unhealthy (AQI ${usAqi})`;
      color = 'var(--accent-rose)';
      desc = 'Everyone may begin to experience health effects. Limit prolonged outdoor exposure.';
    } else if (usAqi > 100) {
      label = `Moderate-High (AQI ${usAqi})`;
      color = 'var(--accent-amber)';
      desc = 'Sensitive groups may experience health effects.';
    } else if (usAqi > 50) {
      label = `Moderate (AQI ${usAqi})`;
      color = 'var(--accent-sun)';
      desc = 'Air quality is acceptable; some pollutants may pose a moderate concern.';
    } else {
      label = `Good (AQI ${usAqi})`;
    }

    aqiBadge.textContent = label;
    aqiBadge.style.color = color;
    aqiDesc.textContent = desc;
    aqiFillBar.style.width = `${pct}%`;
  }

  // 2. Wind & Compass
  const windSpeedEl = document.getElementById('windSpeedVal');
  const windDirText = document.getElementById('windDirText');
  const compassNeedle = document.getElementById('compassNeedle');
  const windSpeedKmH = Math.round(current.wind_speed_10m || 10);
  const windDeg = current.wind_direction_10m || 0;

  windSpeedEl.innerHTML = `${windSpeedKmH} <span class="wind-unit">km/h</span>`;
  windDirText.textContent = `${getCompassDirection(windDeg)} (${windDeg}°)`;
  if (compassNeedle) {
    compassNeedle.style.transform = `rotate(${windDeg}deg)`;
  }

  // 3. UV Index
  const uvScore = daily.uv_index_max ? daily.uv_index_max[0] : 4.5;
  const uvScoreEl = document.getElementById('uvScoreVal');
  const uvRiskTag = document.getElementById('uvRiskTag');
  const uvAdviceText = document.getElementById('uvAdviceText');
  const uvIndicatorDot = document.getElementById('uvIndicatorDot');

  uvScoreEl.textContent = uvScore.toFixed(1);
  const uvPct = Math.min(100, (uvScore / 11) * 100);
  if (uvIndicatorDot) uvIndicatorDot.style.left = `${uvPct}%`;

  if (uvScore >= 8) {
    uvRiskTag.className = 'uv-tag high';
    uvRiskTag.textContent = 'Very High';
    uvAdviceText.textContent = 'Avoid sun exposure around midday. Seek shade & wear SPF 50+.';
  } else if (uvScore >= 6) {
    uvRiskTag.className = 'uv-tag high';
    uvRiskTag.textContent = 'High';
    uvAdviceText.textContent = 'Protection required. Wear hats, sunglasses, and sunscreen.';
  } else if (uvScore >= 3) {
    uvRiskTag.className = 'uv-tag moderate';
    uvRiskTag.textContent = 'Moderate';
    uvAdviceText.textContent = 'Moderate UV radiation. Wear sunglasses if outdoors.';
  } else {
    uvRiskTag.className = 'uv-tag low';
    uvRiskTag.textContent = 'Low';
    uvAdviceText.textContent = 'Low UV exposure. No special protection necessary.';
  }

  // 4. Humidity & Dew Point
  const humidity = current.relative_humidity_2m || 50;
  document.getElementById('humidityNum').textContent = `${humidity}%`;
  const dewPointC = Math.round(current.temperature_2m - ((100 - humidity) / 5));
  const dewPointDisplay = convertTemp(dewPointC);
  const unitSymbol = state.temperatureUnit === 'c' ? '°C' : '°F';
  document.getElementById('dewPointText').textContent = `The dew point is ${dewPointDisplay}${unitSymbol} right now.`;
  document.getElementById('humidityMeterFill').style.width = `${humidity}%`;

  // 5. Sun Position & Trajectory Arc
  if (daily.sunrise && daily.sunset) {
    const sunriseStr = daily.sunrise[0];
    const sunsetStr = daily.sunset[0];
    const sunriseDate = new Date(sunriseStr);
    const sunsetDate = new Date(sunsetStr);

    document.getElementById('sunriseTimeVal').textContent = sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sunsetTimeVal').textContent = sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const nowMs = Date.now();
    const sunTotalMs = sunsetDate.getTime() - sunriseDate.getTime();
    const sunPassedMs = nowMs - sunriseDate.getTime();
    let sunProgress = sunPassedMs / sunTotalMs;
    sunProgress = Math.max(0, Math.min(1, sunProgress));

    const daylightRemainingHours = Math.max(0, (sunsetDate.getTime() - nowMs) / (1000 * 60 * 60));
    const h = Math.floor(daylightRemainingHours);
    const m = Math.floor((daylightRemainingHours - h) * 60);
    document.getElementById('daylightRemainVal').textContent = nowMs > sunsetDate.getTime() ? 'Night Time' : `${h}h ${m}m`;

    // Move SVG Sun Marker along quadratic bezier curve (M 20 95 Q 140 10 260 95)
    const t = sunProgress;
    const x = Math.round((1 - t) * (1 - t) * 20 + 2 * (1 - t) * t * 140 + t * t * 260);
    const y = Math.round((1 - t) * (1 - t) * 95 + 2 * (1 - t) * t * 10 + t * t * 95);
    const marker = document.getElementById('sunMarkerCircle');
    if (marker) {
      marker.setAttribute('cx', x);
      marker.setAttribute('cy', y);
    }
  }

  // 6. Surface Pressure
  const pressure = Math.round(current.surface_pressure || 1013);
  document.getElementById('pressureVal').innerHTML = `${pressure} <span class="metric-unit">hPa</span>`;

  // 7. Visibility
  document.getElementById('visibilityVal').innerHTML = `10 <span class="metric-unit">km</span>`;
}

// ----------------------------------------------------------------------------
// Utilities & Helper Functions
// ----------------------------------------------------------------------------
function convertTemp(tempC) {
  if (tempC === undefined || tempC === null) return 0;
  if (state.temperatureUnit === 'f') {
    return Math.round((tempC * 9 / 5) + 32);
  }
  return Math.round(tempC);
}

function getCompassDirection(deg) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
  return directions[index];
}

function showLoading(isLoading) {
  const loadingEl = document.getElementById('loadingState');
  const mainEl = document.getElementById('dashboardMain');
  if (loadingEl) loadingEl.style.display = isLoading ? 'flex' : 'none';
  if (mainEl) mainEl.style.opacity = isLoading ? '0.45' : '1';
}

function showError(msg) {
  const banner = document.getElementById('errorBanner');
  const desc = document.getElementById('errorDesc');
  if (banner && desc) {
    desc.textContent = msg;
    banner.style.display = 'flex';
  }
}

function hideError() {
  const banner = document.getElementById('errorBanner');
  if (banner) banner.style.display = 'none';
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>🌤️</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ----------------------------------------------------------------------------
// Favorites & Recent Searches Management
// ----------------------------------------------------------------------------
function addRecentSearch(cityName) {
  if (!state.recentSearches.includes(cityName)) {
    state.recentSearches.unshift(cityName);
    if (state.recentSearches.length > 5) state.recentSearches.pop();
    localStorage.setItem('atmosphere_recent', JSON.stringify(state.recentSearches));
    renderRecentSearches();
  }
}

function renderRecentSearches() {
  const bar = document.getElementById('recentSearchesBar');
  const container = document.getElementById('recentChipsContainer');
  if (!bar || !container) return;

  if (state.recentSearches.length === 0) {
    bar.style.display = 'none';
    return;
  }

  bar.style.display = 'flex';
  container.innerHTML = '';
  state.recentSearches.forEach(city => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'recent-item-chip';
    chip.textContent = city;
    chip.onclick = () => loadCityWeather(city);
    container.appendChild(chip);
  });
}

function updateFavoriteStarUI() {
  const btn = document.getElementById('favoriteToggleBtn');
  if (!btn) return;
  const isFav = state.favorites.includes(state.currentCity);
  if (isFav) {
    btn.classList.add('favorited');
    btn.textContent = '★';
  } else {
    btn.classList.remove('favorited');
    btn.textContent = '☆';
  }
}

// ----------------------------------------------------------------------------
// 60FPS Weather Dynamic Canvas Particle FX Engine
// ----------------------------------------------------------------------------
class WeatherFxEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.splashes = [];
    this.lightningBolts = [];
    this.currentMode = 'clear'; // 'clear' | 'rain' | 'thunderstorm' | 'snow' | 'clouds'
    this.animId = null;
    this.nextLightningTime = performance.now() + 5000;
    this.lightningOverlay = document.getElementById('lightningFlashOverlay');

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Respect page visibility to pause when inactive
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });

    this.setMode(this.currentMode);
    this.start();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  setMode(mode) {
    this.currentMode = mode;
    this.particles = [];
    this.splashes = [];
    this.lightningBolts = [];

    const w = this.width || window.innerWidth;
    const h = this.height || window.innerHeight;

    if (mode === 'rain' || mode === 'drizzle') {
      const count = mode === 'rain' ? 120 : 60;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          length: Math.random() * 16 + 12,
          speed: Math.random() * 9 + 11,
          thickness: Math.random() * 1.2 + 0.8,
          alpha: Math.random() * 0.4 + 0.35,
          tilt: -2.2
        });
      }
    } else if (mode === 'thunderstorm') {
      const count = 160;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          length: Math.random() * 22 + 14,
          speed: Math.random() * 12 + 14,
          thickness: Math.random() * 1.5 + 0.9,
          alpha: Math.random() * 0.45 + 0.4,
          tilt: -3.5
        });
      }
      this.nextLightningTime = performance.now() + 4000;
    } else if (mode === 'snow') {
      const count = 90;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 3 + 1.2,
          speed: Math.random() * 1.5 + 0.8,
          swayAngle: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.02 + 0.01,
          swayRadius: Math.random() * 1.5 + 0.8,
          alpha: Math.random() * 0.6 + 0.35
        });
      }
    } else if (mode === 'clouds') {
      const count = 16;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * (h * 0.7),
          radius: Math.random() * 140 + 80,
          speed: Math.random() * 0.35 + 0.15,
          alpha: Math.random() * 0.06 + 0.03
        });
      }
    } else {
      // 'clear' - golden sun dust motes & gentle sparkle orbs
      const count = 40;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() * 2.5 + 1,
          speedY: -(Math.random() * 0.4 + 0.15),
          speedX: (Math.random() - 0.5) * 0.3,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.03 + 0.015,
          baseAlpha: Math.random() * 0.35 + 0.2
        });
      }
    }
  }

  triggerLightning() {
    const startX = Math.random() * (this.width * 0.7) + (this.width * 0.15);
    const startY = 0;
    const segments = [];
    let curX = startX;
    let curY = startY;
    const targetY = Math.random() * (this.height * 0.5) + (this.height * 0.4);

    while (curY < targetY) {
      const nextX = curX + (Math.random() - 0.5) * 60;
      const nextY = curY + Math.random() * 28 + 14;
      segments.push({ x1: curX, y1: curY, x2: nextX, y2: nextY });
      curX = nextX;
      curY = nextY;
    }

    this.lightningBolts.push({
      segments,
      alpha: 1.0,
      decay: 0.12
    });

    // Screen flash overlay
    if (this.lightningOverlay) {
      this.lightningOverlay.style.opacity = '0.75';
      setTimeout(() => {
        if (this.lightningOverlay) this.lightningOverlay.style.opacity = '0.08';
        setTimeout(() => {
          if (this.lightningOverlay) this.lightningOverlay.style.opacity = '0.85';
          setTimeout(() => {
            if (this.lightningOverlay) this.lightningOverlay.style.opacity = '0';
          }, 80);
        }, 60);
      }, 70);
    }
  }

  updateAndDraw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const mode = this.currentMode;
    const now = performance.now();

    // 1. Rain / Storm
    if (mode === 'rain' || mode === 'drizzle' || mode === 'thunderstorm') {
      this.ctx.strokeStyle = mode === 'thunderstorm' ? 'rgba(190, 220, 255, 0.65)' : 'rgba(147, 197, 253, 0.55)';
      this.ctx.lineCap = 'round';

      for (let p of this.particles) {
        this.ctx.lineWidth = p.thickness;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + p.tilt, p.y + p.length);
        this.ctx.stroke();

        p.x += p.tilt;
        p.y += p.speed;

        // Splashes when hitting bottom
        if (p.y > this.height - 20) {
          if (Math.random() < 0.25) {
            this.splashes.push({
              x: p.x,
              y: this.height - Math.random() * 15,
              radius: 1,
              maxRadius: Math.random() * 6 + 4,
              alpha: 0.5
            });
          }
          p.y = -p.length;
          p.x = Math.random() * this.width;
        }
      }

      // Draw splash ripple rings
      for (let i = this.splashes.length - 1; i >= 0; i--) {
        const s = this.splashes[i];
        this.ctx.strokeStyle = `rgba(186, 230, 253, ${s.alpha})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.ellipse(s.x, s.y, s.radius * 2, s.radius * 0.7, 0, 0, Math.PI * 2);
        this.ctx.stroke();

        s.radius += 0.4;
        s.alpha -= 0.035;
        if (s.alpha <= 0) {
          this.splashes.splice(i, 1);
        }
      }

      // Check lightning triggers
      if (mode === 'thunderstorm') {
        if (now > this.nextLightningTime) {
          this.triggerLightning();
          this.nextLightningTime = now + Math.random() * 5000 + 4000;
        }

        // Draw lightning bolts
        for (let i = this.lightningBolts.length - 1; i >= 0; i--) {
          const bolt = this.lightningBolts[i];
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${bolt.alpha})`;
          this.ctx.lineWidth = 2.5;
          this.ctx.shadowColor = '#60a5fa';
          this.ctx.shadowBlur = 12;

          this.ctx.beginPath();
          for (let seg of bolt.segments) {
            this.ctx.moveTo(seg.x1, seg.y1);
            this.ctx.lineTo(seg.x2, seg.y2);
          }
          this.ctx.stroke();
          this.ctx.shadowBlur = 0;

          bolt.alpha -= bolt.decay;
          if (bolt.alpha <= 0) {
            this.lightningBolts.splice(i, 1);
          }
        }
      }
    }

    // 2. Snow
    else if (mode === 'snow') {
      for (let p of this.particles) {
        p.swayAngle += p.swaySpeed;
        p.x += Math.sin(p.swayAngle) * p.swayRadius;
        p.y += p.speed;

        if (p.y > this.height) {
          p.y = -10;
          p.x = Math.random() * this.width;
        }

        this.ctx.fillStyle = `rgba(240, 248, 255, ${p.alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // 3. Clouds / Mist
    else if (mode === 'clouds') {
      for (let p of this.particles) {
        p.x += p.speed;
        if (p.x - p.radius > this.width) {
          p.x = -p.radius;
          p.y = Math.random() * (this.height * 0.7);
        }

        const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(148, 163, 184, ${p.alpha})`);
        grad.addColorStop(0.6, `rgba(148, 163, 184, ${p.alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(148, 163, 184, 0)');

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // 4. Clear Sky / Golden Sun Dust & Sparkles
    else {
      for (let p of this.particles) {
        p.pulse += p.pulseSpeed;
        const currentAlpha = p.baseAlpha + Math.sin(p.pulse) * 0.15;
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) {
          p.y = this.height + 10;
          p.x = Math.random() * this.width;
        }

        this.ctx.fillStyle = `rgba(251, 191, 36, ${Math.max(0.05, currentAlpha)})`;
        this.ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
        this.ctx.shadowBlur = 6;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    }
  }

  loop() {
    this.updateAndDraw();
    this.animId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.animId) {
      this.loop();
    }
  }

  pause() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  resume() {
    if (!this.animId) {
      this.loop();
    }
  }
}

// ----------------------------------------------------------------------------
// Event Listeners & Interactive Handlers
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

  const searchForm = document.getElementById('weatherSearchForm');
  const searchInput = document.getElementById('citySearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const geoBtn = document.getElementById('geoLocateBtn');
  const autocompleteList = document.getElementById('autocompleteDropdown');
  const dismissErrorBtn = document.getElementById('dismissErrorBtn');
  const unitCelsiusBtn = document.getElementById('unitCelsiusBtn');
  const unitFahrenheitBtn = document.getElementById('unitFahrenheitBtn');
  const refreshBtn = document.getElementById('refreshWeatherBtn');
  const favToggleBtn = document.getElementById('favoriteToggleBtn');
  const clearRecentBtn = document.getElementById('clearRecentBtn');

  // Initialize Dynamic Weather FX Canvas
  window.weatherFx = new WeatherFxEngine('weatherFxCanvas');

  // 1. Initial City Load (New Delhi or user saved)
  loadCityWeather(state.currentCity);
  renderRecentSearches();

  // 2. Weather Scene Mood Preset Simulator Buttons
  const sceneButtons = document.querySelectorAll('.scene-btn');
  sceneButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const scene = btn.getAttribute('data-scene');
      sceneButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.documentElement.setAttribute('data-weather', scene);
      if (window.weatherFx) {
        window.weatherFx.setMode(scene);
      }
      showToast(`Atmosphere simulation: ${btn.textContent.trim()}`);
    });
  });

  // 3. Carousel Drag-to-Scroll UX
  const carousel = document.getElementById('hourlyTimelineContainer');
  if (carousel) {
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      carousel.classList.add('grabbing');
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
      isDown = false;
      carousel.classList.remove('grabbing');
    });

    carousel.addEventListener('mouseup', () => {
      isDown = false;
      carousel.classList.remove('grabbing');
    });

    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.8;
      carousel.scrollLeft = scrollLeft - walk;
    });
  }

  // 4. Search Form Submit
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      autocompleteList.style.display = 'none';
      loadCityWeather(query);
    }
  });

  // 5. Autocomplete with Debounced Fetch
  let debounceTimer = null;
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    clearBtn.style.display = query.length > 0 ? 'block' : 'none';

    if (debounceTimer) clearTimeout(debounceTimer);

    if (query.length < 2) {
      autocompleteList.style.display = 'none';
      return;
    }

    debounceTimer = setTimeout(async () => {
      try {
        const results = await fetchCityCoordinates(query);
        if (results && results.length > 0) {
          autocompleteList.innerHTML = '';
          results.slice(0, 5).forEach(res => {
            const li = document.createElement('li');
            li.className = 'autocomplete-item';
            const admin = res.admin1 ? `${res.admin1}, ` : '';
            li.innerHTML = `
              <span class="item-city-name"><strong>${res.name}</strong>, ${admin}${res.country || ''}</span>
              <span class="item-country-badge">${res.country_code || 'GEO'}</span>
            `;
            li.onclick = () => {
              searchInput.value = res.name;
              autocompleteList.style.display = 'none';
              loadCityWeather(res.name, res);
            };
            autocompleteList.appendChild(li);
          });
          autocompleteList.style.display = 'block';
        } else {
          autocompleteList.style.display = 'none';
        }
      } catch (err) {
        autocompleteList.style.display = 'none';
      }
    }, 280);
  });

  // Click outside to dismiss autocomplete
  document.addEventListener('click', (e) => {
    if (!searchForm.contains(e.target)) {
      autocompleteList.style.display = 'none';
    }
  });

  // Clear Input Button
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    autocompleteList.style.display = 'none';
    searchInput.focus();
  });

  // 6. HTML5 Geolocation API: Current GPS Position
  geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showError('Geolocation is not supported by your browser.');
      return;
    }

    showToast('Locating your GPS coordinates...');
    showLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          
          // Reverse geocoding fallback: fetch location via BigDataCloud or direct weather coords
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
          const geoData = await res.json();
          const detectedCity = geoData.city || geoData.locality || 'Current Location';
          
          loadCityWeather(detectedCity, {
            name: detectedCity,
            country_code: geoData.countryCode || 'LOC',
            latitude: lat,
            longitude: lon,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          });
        } catch (err) {
          // Direct coordinates fallback
          loadCityWeather('Current Location', {
            name: 'Local Coordinates',
            country_code: 'GPS',
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            timezone: 'auto'
          });
        }
      },
      (err) => {
        showLoading(false);
        showError('Unable to retrieve your location. Please check browser location permissions.');
      },
      { timeout: 10000 }
    );
  });

  // 7. Quick Cities Preset Chips
  const chipButtons = document.querySelectorAll('.quick-chips-scroll .city-chip');
  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      chipButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cityName = btn.getAttribute('data-city');
      searchInput.value = cityName;
      loadCityWeather(cityName);
    });
  });

  // 8. Unit Switchers (°C / °F)
  unitCelsiusBtn.addEventListener('click', () => {
    if (state.temperatureUnit === 'c') return;
    state.temperatureUnit = 'c';
    unitCelsiusBtn.classList.add('active');
    unitFahrenheitBtn.classList.remove('active');
    renderDashboard();
    showToast('Temperature unit changed to Celsius (°C)');
  });

  unitFahrenheitBtn.addEventListener('click', () => {
    if (state.temperatureUnit === 'f') return;
    state.temperatureUnit = 'f';
    unitFahrenheitBtn.classList.add('active');
    unitCelsiusBtn.classList.remove('active');
    renderDashboard();
    showToast('Temperature unit changed to Fahrenheit (°F)');
  });

  // 9. Refresh Button
  refreshBtn.addEventListener('click', () => {
    showToast('Refreshing live telemetry...');
    loadCityWeather(state.currentCity);
  });

  // 10. Favorite Star Toggle
  favToggleBtn.addEventListener('click', () => {
    const isFav = state.favorites.includes(state.currentCity);
    if (isFav) {
      state.favorites = state.favorites.filter(c => c !== state.currentCity);
      showToast(`Removed ${state.currentCity} from favorites.`);
    } else {
      state.favorites.push(state.currentCity);
      showToast(`Saved ${state.currentCity} to favorites! ⭐`);
    }
    localStorage.setItem('atmosphere_favorites', JSON.stringify(state.favorites));
    updateFavoriteStarUI();
  });

  // 11. Clear Recent Searches
  if (clearRecentBtn) {
    clearRecentBtn.addEventListener('click', () => {
      state.recentSearches = [];
      localStorage.removeItem('atmosphere_recent');
      renderRecentSearches();
      showToast('Cleared recent searches.');
    });
  }

  // 12. Dismiss Error
  if (dismissErrorBtn) {
    dismissErrorBtn.addEventListener('click', hideError);
  }
});
