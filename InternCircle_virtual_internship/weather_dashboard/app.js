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

// ----------------------------------------------------------------------------
// Curated Country Entities & Worldwide Capital City Directory
// Guarantees prominent, accurate resolutions for country queries (e.g. Korea, India, Japan)
// ----------------------------------------------------------------------------
const COUNTRY_SHORTCUTS = {
  'korea': [
    { name: 'Seoul', admin1: 'Seoul', country: 'South Korea', country_code: 'KR', latitude: 37.5665, longitude: 126.9780, timezone: 'Asia/Seoul', population: 9776000, feature_code: 'PPLC' },
    { name: 'South Korea', admin1: '', country: 'South Korea', country_code: 'KR', latitude: 36.5, longitude: 127.75, timezone: 'Asia/Seoul', population: 51635256, feature_code: 'PCLI' },
    { name: 'Busan', admin1: 'Busan', country: 'South Korea', country_code: 'KR', latitude: 35.1796, longitude: 129.0756, timezone: 'Asia/Seoul', population: 3413000, feature_code: 'PPLA' }
  ],
  'south korea': [
    { name: 'Seoul', admin1: 'Seoul', country: 'South Korea', country_code: 'KR', latitude: 37.5665, longitude: 126.9780, timezone: 'Asia/Seoul', population: 9776000, feature_code: 'PPLC' },
    { name: 'South Korea', admin1: '', country: 'South Korea', country_code: 'KR', latitude: 36.5, longitude: 127.75, timezone: 'Asia/Seoul', population: 51635256, feature_code: 'PCLI' }
  ],
  'north korea': [
    { name: 'Pyongyang', admin1: 'Pyongyang', country: 'North Korea', country_code: 'KP', latitude: 39.0392, longitude: 125.7625, timezone: 'Asia/Pyongyang', population: 2870000, feature_code: 'PPLC' }
  ],
  'india': [
    { name: 'New Delhi', admin1: 'Delhi', country: 'India', country_code: 'IN', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata', population: 33000000, feature_code: 'PPLC' },
    { name: 'India', admin1: '', country: 'India', country_code: 'IN', latitude: 22.0, longitude: 79.0, timezone: 'Asia/Kolkata', population: 1352617328, feature_code: 'PCLI' },
    { name: 'Mumbai', admin1: 'Maharashtra', country: 'India', country_code: 'IN', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata', population: 12442373, feature_code: 'PPLA' }
  ],
  'bharat': [
    { name: 'New Delhi', admin1: 'Delhi', country: 'India', country_code: 'IN', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata', population: 33000000, feature_code: 'PPLC' }
  ],
  // Indian States → their capital cities
  'bihar': [
    { name: 'Patna', admin1: 'Bihar', country: 'India', country_code: 'IN', latitude: 25.5941, longitude: 85.1376, timezone: 'Asia/Kolkata', population: 1684222, feature_code: 'PPLA' }
  ],
  'uttar pradesh': [
    { name: 'Lucknow', admin1: 'Uttar Pradesh', country: 'India', country_code: 'IN', latitude: 26.8467, longitude: 80.9462, timezone: 'Asia/Kolkata', population: 2901474, feature_code: 'PPLA' },
    { name: 'Kanpur', admin1: 'Uttar Pradesh', country: 'India', country_code: 'IN', latitude: 26.4499, longitude: 80.3319, timezone: 'Asia/Kolkata', population: 2920496, feature_code: 'PPLA' }
  ],
  'up': [
    { name: 'Lucknow', admin1: 'Uttar Pradesh', country: 'India', country_code: 'IN', latitude: 26.8467, longitude: 80.9462, timezone: 'Asia/Kolkata', population: 2901474, feature_code: 'PPLA' }
  ],
  'maharashtra': [
    { name: 'Mumbai', admin1: 'Maharashtra', country: 'India', country_code: 'IN', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata', population: 12442373, feature_code: 'PPLA' },
    { name: 'Pune', admin1: 'Maharashtra', country: 'India', country_code: 'IN', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata', population: 3124458, feature_code: 'PPLA' }
  ],
  'madhya pradesh': [
    { name: 'Bhopal', admin1: 'Madhya Pradesh', country: 'India', country_code: 'IN', latitude: 23.2599, longitude: 77.4126, timezone: 'Asia/Kolkata', population: 1795648, feature_code: 'PPLA' },
    { name: 'Indore', admin1: 'Madhya Pradesh', country: 'India', country_code: 'IN', latitude: 22.7196, longitude: 75.8577, timezone: 'Asia/Kolkata', population: 1994397, feature_code: 'PPLA' }
  ],
  'mp': [
    { name: 'Bhopal', admin1: 'Madhya Pradesh', country: 'India', country_code: 'IN', latitude: 23.2599, longitude: 77.4126, timezone: 'Asia/Kolkata', population: 1795648, feature_code: 'PPLA' }
  ],
  'rajasthan': [
    { name: 'Jaipur', admin1: 'Rajasthan', country: 'India', country_code: 'IN', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata', population: 3073350, feature_code: 'PPLA' }
  ],
  'gujarat': [
    { name: 'Ahmedabad', admin1: 'Gujarat', country: 'India', country_code: 'IN', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata', population: 5570585, feature_code: 'PPLA' },
    { name: 'Surat', admin1: 'Gujarat', country: 'India', country_code: 'IN', latitude: 21.1702, longitude: 72.8311, timezone: 'Asia/Kolkata', population: 4462002, feature_code: 'PPLA' }
  ],
  'west bengal': [
    { name: 'Kolkata', admin1: 'West Bengal', country: 'India', country_code: 'IN', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata', population: 4496694, feature_code: 'PPLA' }
  ],
  'wb': [
    { name: 'Kolkata', admin1: 'West Bengal', country: 'India', country_code: 'IN', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata', population: 4496694, feature_code: 'PPLA' }
  ],
  'tamil nadu': [
    { name: 'Chennai', admin1: 'Tamil Nadu', country: 'India', country_code: 'IN', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata', population: 7088000, feature_code: 'PPLA' }
  ],
  'tn': [
    { name: 'Chennai', admin1: 'Tamil Nadu', country: 'India', country_code: 'IN', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata', population: 7088000, feature_code: 'PPLA' }
  ],
  'karnataka': [
    { name: 'Bengaluru', admin1: 'Karnataka', country: 'India', country_code: 'IN', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata', population: 8425970, feature_code: 'PPLA' }
  ],
  'andhra pradesh': [
    { name: 'Visakhapatnam', admin1: 'Andhra Pradesh', country: 'India', country_code: 'IN', latitude: 17.6868, longitude: 83.2185, timezone: 'Asia/Kolkata', population: 1730320, feature_code: 'PPLA' }
  ],
  'telangana': [
    { name: 'Hyderabad', admin1: 'Telangana', country: 'India', country_code: 'IN', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata', population: 6993262, feature_code: 'PPLA' }
  ],
  'kerala': [
    { name: 'Thiruvananthapuram', admin1: 'Kerala', country: 'India', country_code: 'IN', latitude: 8.5241, longitude: 76.9366, timezone: 'Asia/Kolkata', population: 957730, feature_code: 'PPLA' },
    { name: 'Kochi', admin1: 'Kerala', country: 'India', country_code: 'IN', latitude: 9.9312, longitude: 76.2673, timezone: 'Asia/Kolkata', population: 677381, feature_code: 'PPLA' }
  ],
  'punjab': [
    { name: 'Chandigarh', admin1: 'Chandigarh', country: 'India', country_code: 'IN', latitude: 30.7333, longitude: 76.7794, timezone: 'Asia/Kolkata', population: 960787, feature_code: 'PPLA' }
  ],
  'haryana': [
    { name: 'Chandigarh', admin1: 'Chandigarh', country: 'India', country_code: 'IN', latitude: 30.7333, longitude: 76.7794, timezone: 'Asia/Kolkata', population: 960787, feature_code: 'PPLA' }
  ],
  'jharkhand': [
    { name: 'Ranchi', admin1: 'Jharkhand', country: 'India', country_code: 'IN', latitude: 23.3441, longitude: 85.3096, timezone: 'Asia/Kolkata', population: 1073440, feature_code: 'PPLA' }
  ],
  'odisha': [
    { name: 'Bhubaneswar', admin1: 'Odisha', country: 'India', country_code: 'IN', latitude: 20.2961, longitude: 85.8245, timezone: 'Asia/Kolkata', population: 837737, feature_code: 'PPLA' }
  ],
  'chhattisgarh': [
    { name: 'Raipur', admin1: 'Chhattisgarh', country: 'India', country_code: 'IN', latitude: 21.2514, longitude: 81.6296, timezone: 'Asia/Kolkata', population: 1010433, feature_code: 'PPLA' }
  ],
  'assam': [
    { name: 'Guwahati', admin1: 'Assam', country: 'India', country_code: 'IN', latitude: 26.1445, longitude: 91.7362, timezone: 'Asia/Kolkata', population: 963429, feature_code: 'PPLA' }
  ],
  'himachal pradesh': [
    { name: 'Shimla', admin1: 'Himachal Pradesh', country: 'India', country_code: 'IN', latitude: 31.1048, longitude: 77.1734, timezone: 'Asia/Kolkata', population: 169578, feature_code: 'PPLA' }
  ],
  'uttarakhand': [
    { name: 'Dehradun', admin1: 'Uttarakhand', country: 'India', country_code: 'IN', latitude: 30.3165, longitude: 78.0322, timezone: 'Asia/Kolkata', population: 578420, feature_code: 'PPLA' }
  ],
  'goa': [
    { name: 'Panaji', admin1: 'Goa', country: 'India', country_code: 'IN', latitude: 15.4909, longitude: 73.8278, timezone: 'Asia/Kolkata', population: 65000, feature_code: 'PPLA' }
  ],
  'japan': [
    { name: 'Tokyo', admin1: 'Tokyo', country: 'Japan', country_code: 'JP', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo', population: 14000000, feature_code: 'PPLC' },
    { name: 'Osaka', admin1: 'Osaka', country: 'Japan', country_code: 'JP', latitude: 34.6937, longitude: 135.5023, timezone: 'Asia/Tokyo', population: 2691000, feature_code: 'PPLA' }
  ],
  'usa': [
    { name: 'Washington, D.C.', admin1: 'District of Columbia', country: 'United States', country_code: 'US', latitude: 38.8951, longitude: -77.0364, timezone: 'America/New_York', population: 689545, feature_code: 'PPLC' },
    { name: 'New York', admin1: 'New York', country: 'United States', country_code: 'US', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', population: 8804190, feature_code: 'PPL' }
  ],
  'us': [
    { name: 'Washington, D.C.', admin1: 'District of Columbia', country: 'United States', country_code: 'US', latitude: 38.8951, longitude: -77.0364, timezone: 'America/New_York', population: 689545, feature_code: 'PPLC' },
    { name: 'New York', admin1: 'New York', country: 'United States', country_code: 'US', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', population: 8804190, feature_code: 'PPL' }
  ],
  'united states': [
    { name: 'Washington, D.C.', admin1: 'District of Columbia', country: 'United States', country_code: 'US', latitude: 38.8951, longitude: -77.0364, timezone: 'America/New_York', population: 689545, feature_code: 'PPLC' },
    { name: 'New York', admin1: 'New York', country: 'United States', country_code: 'US', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', population: 8804190, feature_code: 'PPL' }
  ],
  'america': [
    { name: 'Washington, D.C.', admin1: 'District of Columbia', country: 'United States', country_code: 'US', latitude: 38.8951, longitude: -77.0364, timezone: 'America/New_York', population: 689545, feature_code: 'PPLC' },
    { name: 'New York', admin1: 'New York', country: 'United States', country_code: 'US', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', population: 8804190, feature_code: 'PPL' }
  ],
  'uk': [
    { name: 'London', admin1: 'England', country: 'United Kingdom', country_code: 'GB', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', population: 8982000, feature_code: 'PPLC' }
  ],
  'united kingdom': [
    { name: 'London', admin1: 'England', country: 'United Kingdom', country_code: 'GB', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', population: 8982000, feature_code: 'PPLC' }
  ],
  'england': [
    { name: 'London', admin1: 'England', country: 'United Kingdom', country_code: 'GB', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', population: 8982000, feature_code: 'PPLC' }
  ],
  'australia': [
    { name: 'Sydney', admin1: 'New South Wales', country: 'Australia', country_code: 'AU', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney', population: 4623000, feature_code: 'PPLA' },
    { name: 'Melbourne', admin1: 'Victoria', country: 'Australia', country_code: 'AU', latitude: -37.8136, longitude: 144.9631, timezone: 'Australia/Melbourne', population: 4246000, feature_code: 'PPLA' },
    { name: 'Canberra', admin1: 'Australian Capital Territory', country: 'Australia', country_code: 'AU', latitude: -35.2809, longitude: 149.1300, timezone: 'Australia/Sydney', population: 456652, feature_code: 'PPLC' }
  ],
  'canada': [
    { name: 'Toronto', admin1: 'Ontario', country: 'Canada', country_code: 'CA', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto', population: 2794356, feature_code: 'PPLA' },
    { name: 'Ottawa', admin1: 'Ontario', country: 'Canada', country_code: 'CA', latitude: 45.4215, longitude: -75.6972, timezone: 'America/Toronto', population: 1017449, feature_code: 'PPLC' }
  ],
  'china': [
    { name: 'Beijing', admin1: 'Beijing', country: 'China', country_code: 'CN', latitude: 39.9042, longitude: 116.4074, timezone: 'Asia/Shanghai', population: 21540000, feature_code: 'PPLC' },
    { name: 'Shanghai', admin1: 'Shanghai', country: 'China', country_code: 'CN', latitude: 31.2304, longitude: 121.4737, timezone: 'Asia/Shanghai', population: 24870000, feature_code: 'PPLA' }
  ],
  'germany': [
    { name: 'Berlin', admin1: 'Berlin', country: 'Germany', country_code: 'DE', latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin', population: 3645000, feature_code: 'PPLC' },
    { name: 'Munich', admin1: 'Bavaria', country: 'Germany', country_code: 'DE', latitude: 48.1351, longitude: 11.5820, timezone: 'Europe/Berlin', population: 1472000, feature_code: 'PPLA' }
  ],
  'france': [
    { name: 'Paris', admin1: 'Ile-de-France', country: 'France', country_code: 'FR', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris', population: 2161000, feature_code: 'PPLC' }
  ],
  'italy': [
    { name: 'Rome', admin1: 'Lazio', country: 'Italy', country_code: 'IT', latitude: 41.9028, longitude: 12.4964, timezone: 'Europe/Rome', population: 2873000, feature_code: 'PPLC' }
  ],
  'spain': [
    { name: 'Madrid', admin1: 'Madrid', country: 'Spain', country_code: 'ES', latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid', population: 3223000, feature_code: 'PPLC' }
  ],
  'russia': [
    { name: 'Moscow', admin1: 'Moscow', country: 'Russia', country_code: 'RU', latitude: 55.7558, longitude: 37.6173, timezone: 'Europe/Moscow', population: 13010000, feature_code: 'PPLC' }
  ],
  'brazil': [
    { name: 'São Paulo', admin1: 'Sao Paulo', country: 'Brazil', country_code: 'BR', latitude: -23.5505, longitude: -46.6333, timezone: 'America/Sao_Paulo', population: 12330000, feature_code: 'PPLA' },
    { name: 'Rio de Janeiro', admin1: 'Rio de Janeiro', country: 'Brazil', country_code: 'BR', latitude: -22.9068, longitude: -43.1729, timezone: 'America/Sao_Paulo', population: 6748000, feature_code: 'PPLA' }
  ],
  'uae': [
    { name: 'Dubai', admin1: 'Dubai', country: 'United Arab Emirates', country_code: 'AE', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai', population: 3331420, feature_code: 'PPLA' },
    { name: 'Abu Dhabi', admin1: 'Abu Dhabi', country: 'United Arab Emirates', country_code: 'AE', latitude: 24.4539, longitude: 54.3773, timezone: 'Asia/Dubai', population: 1483000, feature_code: 'PPLC' }
  ],
  'dubai': [
    { name: 'Dubai', admin1: 'Dubai', country: 'United Arab Emirates', country_code: 'AE', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai', population: 3331420, feature_code: 'PPLA' }
  ],
  'singapore': [
    { name: 'Singapore', admin1: '', country: 'Singapore', country_code: 'SG', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore', population: 5686000, feature_code: 'PPLC' }
  ],
  'thailand': [
    { name: 'Bangkok', admin1: 'Bangkok', country: 'Thailand', country_code: 'TH', latitude: 13.7563, longitude: 100.5018, timezone: 'Asia/Bangkok', population: 10539000, feature_code: 'PPLC' }
  ],
  'indonesia': [
    { name: 'Jakarta', admin1: 'Jakarta', country: 'Indonesia', country_code: 'ID', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta', population: 10560000, feature_code: 'PPLC' }
  ],
  'pakistan': [
    { name: 'Islamabad', admin1: 'Islamabad Capital Territory', country: 'Pakistan', country_code: 'PK', latitude: 33.6844, longitude: 73.0479, timezone: 'Asia/Karachi', population: 1015000, feature_code: 'PPLC' },
    { name: 'Karachi', admin1: 'Sindh', country: 'Pakistan', country_code: 'PK', latitude: 24.8607, longitude: 67.0011, timezone: 'Asia/Karachi', population: 14910352, feature_code: 'PPLA' }
  ],
  'bangladesh': [
    { name: 'Dhaka', admin1: 'Dhaka Division', country: 'Bangladesh', country_code: 'BD', latitude: 23.8103, longitude: 90.4125, timezone: 'Asia/Dhaka', population: 10295000, feature_code: 'PPLC' }
  ],
  'nepal': [
    { name: 'Kathmandu', admin1: 'Bagmati', country: 'Nepal', country_code: 'NP', latitude: 27.7172, longitude: 85.3240, timezone: 'Asia/Kathmandu', population: 1442000, feature_code: 'PPLC' }
  ],
  'sri lanka': [
    { name: 'Colombo', admin1: 'Western Province', country: 'Sri Lanka', country_code: 'LK', latitude: 6.9271, longitude: 79.8612, timezone: 'Asia/Colombo', population: 752993, feature_code: 'PPLC' }
  ],
  'switzerland': [
    { name: 'Zurich', admin1: 'Zurich', country: 'Switzerland', country_code: 'CH', latitude: 47.3769, longitude: 8.5417, timezone: 'Europe/Zurich', population: 428000, feature_code: 'PPLA' },
    { name: 'Bern', admin1: 'Bern', country: 'Switzerland', country_code: 'CH', latitude: 46.9480, longitude: 7.4474, timezone: 'Europe/Zurich', population: 133883, feature_code: 'PPLC' }
  ],
  'netherlands': [
    { name: 'Amsterdam', admin1: 'North Holland', country: 'Netherlands', country_code: 'NL', latitude: 52.3676, longitude: 4.9041, timezone: 'Europe/Amsterdam', population: 872680, feature_code: 'PPLC' }
  ],
  'turkey': [
    { name: 'Istanbul', admin1: 'Istanbul', country: 'Turkey', country_code: 'TR', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul', population: 15460000, feature_code: 'PPLA' },
    { name: 'Ankara', admin1: 'Ankara', country: 'Turkey', country_code: 'TR', latitude: 39.9334, longitude: 32.8597, timezone: 'Europe/Istanbul', population: 5663000, feature_code: 'PPLC' }
  ],
  'turkiye': [
    { name: 'Istanbul', admin1: 'Istanbul', country: 'Turkey', country_code: 'TR', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul', population: 15460000, feature_code: 'PPLA' },
    { name: 'Ankara', admin1: 'Ankara', country: 'Turkey', country_code: 'TR', latitude: 39.9334, longitude: 32.8597, timezone: 'Europe/Istanbul', population: 5663000, feature_code: 'PPLC' }
  ],
  'egypt': [
    { name: 'Cairo', admin1: 'Cairo Governorate', country: 'Egypt', country_code: 'EG', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo', population: 9600000, feature_code: 'PPLC' }
  ],
  'south africa': [
    { name: 'Cape Town', admin1: 'Western Cape', country: 'South Africa', country_code: 'ZA', latitude: -33.9249, longitude: 18.4241, timezone: 'Africa/Johannesburg', population: 4618000, feature_code: 'PPLA' },
    { name: 'Johannesburg', admin1: 'Gauteng', country: 'South Africa', country_code: 'ZA', latitude: -26.2041, longitude: 28.0473, timezone: 'Africa/Johannesburg', population: 4434827, feature_code: 'PPLA' }
  ],
  'mexico': [
    { name: 'Mexico City', admin1: 'CDMX', country: 'Mexico', country_code: 'MX', latitude: 19.4326, longitude: -99.1332, timezone: 'America/Mexico_City', population: 9209944, feature_code: 'PPLC' }
  ],
  'argentina': [
    { name: 'Buenos Aires', admin1: 'Buenos Aires', country: 'Argentina', country_code: 'AR', latitude: -34.6037, longitude: -58.3816, timezone: 'America/Argentina/Buenos_Aires', population: 3120612, feature_code: 'PPLC' }
  ],
  'new zealand': [
    { name: 'Auckland', admin1: 'Auckland', country: 'New Zealand', country_code: 'NZ', latitude: -36.8485, longitude: 174.7633, timezone: 'Pacific/Auckland', population: 1657000, feature_code: 'PPLA' },
    { name: 'Wellington', admin1: 'Wellington', country: 'New Zealand', country_code: 'NZ', latitude: -41.2865, longitude: 174.7762, timezone: 'Pacific/Auckland', population: 215900, feature_code: 'PPLC' }
  ]
};

// 2-Letter ISO Country Code to Full Name normalization
const CODE_TO_COUNTRY = {
  'in': 'India',
  'us': 'United States',
  'gb': 'United Kingdom',
  'uk': 'United Kingdom',
  'au': 'Australia',
  'ca': 'Canada',
  'jp': 'Japan',
  'kr': 'South Korea',
  'cn': 'China',
  'de': 'Germany',
  'fr': 'France',
  'it': 'Italy',
  'es': 'Spain',
  'br': 'Brazil',
  'ae': 'United Arab Emirates',
  'ru': 'Russia',
  'sg': 'Singapore',
  'th': 'Thailand',
  'id': 'Indonesia',
  'pk': 'Pakistan',
  'bd': 'Bangladesh',
  'np': 'Nepal',
  'lk': 'Sri Lanka',
  'ch': 'Switzerland',
  'nl': 'Netherlands',
  'tr': 'Turkey',
  'eg': 'Egypt',
  'za': 'South Africa',
  'mx': 'Mexico',
  'ar': 'Argentina',
  'nz': 'New Zealand'
};

// ----------------------------------------------------------------------------
// Known admin1 Corrections for Indian Cities
// Open-Meteo's geocoding database has errors — e.g. some Bihar cities are
// tagged as Madhya Pradesh, and other similar misattributions.
// Key: "CityName|IN" → correct admin1 (state name)
// ----------------------------------------------------------------------------
const INDIA_CITY_STATE_CORRECTIONS = {
  'patna|in':        'Bihar',
  'gaya|in':         'Bihar',
  'muzaffarpur|in':  'Bihar',
  'bhagalpur|in':    'Bihar',
  'darbhanga|in':    'Bihar',
  'purnia|in':       'Bihar',
  'begusarai|in':    'Bihar',
  'nalanda|in':      'Bihar',
  'ara|in':          'Bihar',
  'munger|in':       'Bihar',
  'bettiah|in':      'Bihar',
  'motihari|in':     'Bihar',
  'samastipur|in':   'Bihar',
  'sitamarhi|in':    'Bihar',
  'hajipur|in':      'Bihar',
  'chapra|in':       'Bihar',
  'siwan|in':        'Bihar',
  'sasaram|in':      'Bihar',
  'dehri|in':        'Bihar',
  'buxar|in':        'Bihar',
  'bhopal|in':       'Madhya Pradesh',
  'indore|in':       'Madhya Pradesh',
  'jabalpur|in':     'Madhya Pradesh',
  'gwalior|in':      'Madhya Pradesh',
  'lucknow|in':      'Uttar Pradesh',
  'kanpur|in':       'Uttar Pradesh',
  'varanasi|in':     'Uttar Pradesh',
  'agra|in':         'Uttar Pradesh',
  'allahabad|in':    'Uttar Pradesh',
  'meerut|in':       'Uttar Pradesh',
  'prayagraj|in':    'Uttar Pradesh',
  'ranchi|in':       'Jharkhand',
  'jamshedpur|in':   'Jharkhand',
  'dhanbad|in':      'Jharkhand',
  'raipur|in':       'Chhattisgarh',
  'bhubaneswar|in':  'Odisha',
  'cuttack|in':      'Odisha',
  'guwahati|in':     'Assam',
  'shillong|in':     'Meghalaya',
  'imphal|in':       'Manipur',
  'aizawl|in':       'Mizoram',
  'kohima|in':       'Nagaland',
  'itanagar|in':     'Arunachal Pradesh',
  'gangtok|in':      'Sikkim',
  'agartala|in':     'Tripura',
  'panaji|in':       'Goa',
  'port blair|in':   'Andaman and Nicobar Islands',
};

/**
 * Intelligent City & Country Geocoding via Open-Meteo REST API
 * Corrects country misattributions, ranks by population and administrative prominence,
 * supports comma-separated syntax ("Lucknow, India", "Lucknow, IN"), and resolves country queries.
 */
async function fetchCityCoordinates(cityName) {
  if (!cityName || typeof cityName !== 'string') return [];
  const trimmed = cityName.trim();
  if (trimmed.length < 2) return [];

  const rawLower = trimmed.toLowerCase();

  // 1. Direct or prefix match for curated country shortcuts
  let initialShortcuts = [];
  if (COUNTRY_SHORTCUTS[rawLower]) {
    initialShortcuts = [...COUNTRY_SHORTCUTS[rawLower]];
  } else {
    for (const [key, items] of Object.entries(COUNTRY_SHORTCUTS)) {
      if (key.startsWith(rawLower) && rawLower.length >= 3) {
        initialShortcuts = [...items];
        break;
      }
    }
  }

  // 2. Parse comma-separated syntax: "Lucknow, India" or "Lucknow, IN" or "Dubai, India"
  let mainQuery = trimmed;
  let countryOrStateFilter = '';

  if (trimmed.includes(',')) {
    const parts = trimmed.split(',').map(p => p.trim());
    mainQuery = parts[0];
    if (parts[1]) {
      const f = parts[1].toLowerCase();
      countryOrStateFilter = CODE_TO_COUNTRY[f] || f;
    }
  }

  const cleanMain = mainQuery.trim();
  const cleanMainLower = cleanMain.toLowerCase();

  // 3. Query Open-Meteo Geocoding API with 20 candidates for a rich candidate pool
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanMain)}&count=20&language=en&format=json`;

  let apiResults = [];
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.results)) {
        apiResults = data.results;
      }
    }
  } catch (err) {
    console.warn('Geocoding API fetch warning:', err);
  }

  // Mark curated shortcut entries so they bypass name-match filters below
  const curatedSet = new Set(initialShortcuts.map(r => `${r.name}|${r.country_code}`));

  // Combine curated shortcuts with API results
  let candidates = [
    ...initialShortcuts.map(r => ({ ...r, _curated: true })),
    ...apiResults
  ];

  // Apply known admin1 corrections for Indian cities
  // (Open-Meteo's DB has geographic errors, e.g. Bihar cities tagged as MP)
  candidates = candidates.map(r => {
    if ((r.country_code || '').toLowerCase() === 'in') {
      const correctionKey = `${(r.name || '').toLowerCase()}|in`;
      if (INDIA_CITY_STATE_CORRECTIONS[correctionKey]) {
        return { ...r, admin1: INDIA_CITY_STATE_CORRECTIONS[correctionKey] };
      }
    }
    return r;
  });

  if (candidates.length === 0) {
    throw new Error(`No locations found matching "${cityName}". Please check the spelling.`);
  }

  // Filter 1: Valid city/populated place/administrative feature codes only
  // Discards mountains (MT), hills (HLL), streams (STM), etc.
  // Curated entries are always kept regardless of feature_code.
  candidates = candidates.filter(r => {
    if (r._curated) return true;
    const code = r.feature_code || '';
    return code.startsWith('PPL') || code.startsWith('PCL') || code.startsWith('ADM');
  });

  // Filter 2: Name or country must match the query
  // Curated shortcut entries (_curated:true) are always kept — their relevance
  // is guaranteed by the COUNTRY_SHORTCUTS table, not by name substring matching.
  candidates = candidates.filter(item => {
    if (item._curated) return true; // always keep hand-curated results

    const itemName = (item.name || '').toLowerCase();
    const itemCountry = (item.country || '').toLowerCase();
    const itemCountryCode = (item.country_code || '').toLowerCase();

    // Prevent country misattribution: if searching for "korea", do NOT return India or Ivory Coast
    if (rawLower.includes('korea')) {
      if (itemCountryCode !== 'kr' && itemCountryCode !== 'kp' && !itemCountry.includes('korea')) {
        return false;
      }
    }

    // If searching for "india", do NOT return Gambia, Moldova, or Mozambique
    if (rawLower === 'india' || rawLower === 'bharat') {
      if (itemCountryCode !== 'in' && !itemCountry.includes('india')) {
        return false;
      }
    }

    return itemName.includes(cleanMainLower) || itemCountry.includes(cleanMainLower);
  });

  // Filter 3: If user provided a specific country/state filter (e.g. "Dubai, India" or "Lucknow, Australia")
  if (countryOrStateFilter) {
    candidates = candidates.filter(item => {
      const admin = (item.admin1 || '').toLowerCase();
      const codeMatch = (item.country_code || '').toLowerCase() === countryOrStateFilter;
      const countryMatch = (item.country || '').toLowerCase().includes(countryOrStateFilter);
      const adminMatch = admin.includes(countryOrStateFilter);
      return codeMatch || countryMatch || adminMatch;
    });
  }

  // Filter 4: Strict deduplication by place identity (Name + Admin1 + Country)
  // Eliminates duplicate rows (e.g. identical entries for Dubai, UP, India or Dubai, Sichuan, China)
  const seenPlaces = new Set();
  candidates = candidates.filter(item => {
    const key = `${(item.name || '').toLowerCase()}|${(item.admin1 || '').toLowerCase()}|${(item.country_code || item.country || '').toLowerCase()}`;
    if (seenPlaces.has(key)) return false;
    seenPlaces.add(key);
    return true;
  });

  // Filter 5: Population relevance cutoff (when no explicit country filter was specified)
  // If top candidate is a major world city (pop >= 100,000), omit tiny hamlets (pop < 25,000 & < 3% of top)
  if (!countryOrStateFilter) {
    const maxPop = Math.max(0, ...candidates.map(r => r.population || 0));
    if (maxPop >= 100000) {
      candidates = candidates.filter(r => {
        const pop = r.population || 0;
        const isSignificant = pop >= 25000 || pop >= (maxPop * 0.03) || r.feature_code === 'PPLC' || r.feature_code === 'PPLA';
        return isSignificant;
      });
    }
  }

  // Sort by relevance, capital status, and population
  candidates.sort((a, b) => {
    const aName = (a.name || '').toLowerCase();
    const bName = (b.name || '').toLowerCase();

    // Exact name match
    const aExact = aName === cleanMainLower ? 1 : 0;
    const bExact = bName === cleanMainLower ? 1 : 0;
    if (aExact !== bExact) return bExact - aExact;

    // Starts-with prefix match
    const aPrefix = aName.startsWith(cleanMainLower) ? 1 : 0;
    const bPrefix = bName.startsWith(cleanMainLower) ? 1 : 0;
    if (aPrefix !== bPrefix) return bPrefix - aPrefix;

    // Administrative importance (PPLC = National Capital, PPLA = State Capital)
    const aCapScore = a.feature_code === 'PPLC' ? 3000000 : (a.feature_code === 'PPLA' ? 1500000 : 0);
    const bCapScore = b.feature_code === 'PPLC' ? 3000000 : (b.feature_code === 'PPLA' ? 1500000 : 0);

    const totalA = aCapScore + (a.population || 0);
    const totalB = bCapScore + (b.population || 0);

    return totalB - totalA;
  });

  return candidates;
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

  const isDay = current.is_day === 1;
  const weatherCategory = (wmoInfo.category === 'clear' && !isDay) ? 'clear-night' : wmoInfo.category;

  // 1. Update Global Theme Attributes
  document.documentElement.setAttribute('data-weather', weatherCategory);

  // Sync Weather FX Video Background & Mood Simulator Buttons
  if (window.weatherFx) {
    window.weatherFx.setMode(weatherCategory, isDay);
  }
  document.querySelectorAll('.scene-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-scene') === weatherCategory);
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
    const y = Math.round((1 - t) * (1 - t) * 85 + 2 * (1 - t) * t * 10 + t * t * 85);
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
// Fullscreen Weather Video Background & Lightning FX Engine
// ----------------------------------------------------------------------------
class WeatherFxEngine {
  constructor(canvasId = 'weatherFxCanvas') {
    this.videoA = document.getElementById('videoBgA');
    this.videoB = document.getElementById('videoBgB');
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.lightningOverlay = document.getElementById('lightningFlashOverlay');

    this.activeSlot = 'A'; // 'A' or 'B'
    this.currentSrc = '';
    this.currentMode = 'clear';
    this.isDay = true;

    // Lightning state for thunderstorm mode
    this.lightningBolts = [];
    this.nextLightningTime = 0;
    this.animId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Ensure muted & inline play for strict browser autoplay requirements
    [this.videoA, this.videoB].forEach(v => {
      if (v) {
        v.muted = true;
        v.playsInline = true;
        v.autoplay = true;
        v.loop = true;
      }
    });

    // Pause / resume media on tab visibility change
    document.addEventListener('visibilitychange', () => {
      const activeVideo = this.activeSlot === 'A' ? this.videoA : this.videoB;
      if (document.hidden) {
        if (activeVideo) activeVideo.pause();
        if (this.animId) {
          cancelAnimationFrame(this.animId);
          this.animId = null;
        }
      } else {
        if (activeVideo && activeVideo.src) activeVideo.play().catch(() => {});
        if (this.currentMode === 'thunderstorm' && !this.animId) {
          this.loopLightning();
        }
      }
    });

    this.setMode(this.currentMode, this.isDay);
  }

  resize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  getVideoForWeather(category, isDay = true) {
    switch (category) {
      case 'clear':
        return isDay ? 'videos/sunny.mp4' : 'videos/clear-night.mp4';
      case 'clear-night':
        return 'videos/clear-night.mp4';
      case 'rain':
      case 'drizzle':
        return 'videos/rainy.mp4';
      case 'snow':
        return 'videos/snowy.mp4';
      case 'clouds':
        return 'videos/cloudy.mp4';
      case 'thunderstorm':
        return 'videos/rainy.mp4';
      default:
        return isDay ? 'videos/sunny.mp4' : 'videos/clear-night.mp4';
    }
  }

  setMode(mode, isDay = true) {
    this.currentMode = mode;
    this.isDay = isDay;

    const targetSrc = this.getVideoForWeather(mode, isDay);
    this.crossfadeTo(targetSrc);

    // Lightning canvas loop
    if (mode === 'thunderstorm') {
      this.nextLightningTime = performance.now() + 1500;
      if (!this.animId) {
        this.loopLightning();
      }
    } else {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }
    }
  }

  crossfadeTo(videoPath) {
    if (!this.videoA || !this.videoB) return;

    // Check if the target is already playing
    const currentVideo = this.activeSlot === 'A' ? this.videoA : this.videoB;
    if (this.currentSrc === videoPath && !currentVideo.paused) {
      return;
    }

    this.currentSrc = videoPath;
    const incoming = this.activeSlot === 'A' ? this.videoB : this.videoA;
    const outgoing = this.activeSlot === 'A' ? this.videoA : this.videoB;

    incoming.src = videoPath;
    incoming.currentTime = 0;

    const playPromise = incoming.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          incoming.classList.add('active');
          outgoing.classList.remove('active');
          this.activeSlot = this.activeSlot === 'A' ? 'B' : 'A';
          setTimeout(() => {
            if (!outgoing.classList.contains('active')) {
              outgoing.pause();
            }
          }, 1400);
        })
        .catch(err => {
          // Fallback if browser requires user gesture: show incoming anyway
          incoming.classList.add('active');
          outgoing.classList.remove('active');
          this.activeSlot = this.activeSlot === 'A' ? 'B' : 'A';
        });
    } else {
      incoming.classList.add('active');
      outgoing.classList.remove('active');
      this.activeSlot = this.activeSlot === 'A' ? 'B' : 'A';
    }
  }

  triggerLightning() {
    const startX = Math.random() * (this.width * 0.7) + (this.width * 0.15);
    let curX = startX;
    let curY = 0;
    const targetY = Math.random() * (this.height * 0.55) + (this.height * 0.4);
    const segments = [];

    while (curY < targetY) {
      const nextX = curX + (Math.random() - 0.5) * 70;
      const nextY = curY + Math.random() * 30 + 15;
      segments.push({ x1: curX, y1: curY, x2: nextX, y2: nextY });
      curX = nextX;
      curY = nextY;
    }

    this.lightningBolts.push({
      segments,
      alpha: 1.0,
      decay: 0.1
    });

    if (this.lightningOverlay) {
      this.lightningOverlay.style.opacity = '0.8';
      setTimeout(() => {
        if (this.lightningOverlay) this.lightningOverlay.style.opacity = '0.1';
        setTimeout(() => {
          if (this.lightningOverlay) this.lightningOverlay.style.opacity = '0.9';
          setTimeout(() => {
            if (this.lightningOverlay) this.lightningOverlay.style.opacity = '0';
          }, 80);
        }, 50);
      }, 60);
    }
  }

  loopLightning() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
    const now = performance.now();

    if (now > this.nextLightningTime) {
      this.triggerLightning();
      this.nextLightningTime = now + Math.random() * 4500 + 3000;
    }

    for (let i = this.lightningBolts.length - 1; i >= 0; i--) {
      const bolt = this.lightningBolts[i];
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${bolt.alpha})`;
      this.ctx.lineWidth = 2.8;
      this.ctx.shadowColor = '#93c5fd';
      this.ctx.shadowBlur = 16;

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

    if (this.currentMode === 'thunderstorm') {
      this.animId = requestAnimationFrame(() => this.loopLightning());
    }
  }

  start() {
    const activeVideo = this.activeSlot === 'A' ? this.videoA : this.videoB;
    if (activeVideo && activeVideo.paused) {
      activeVideo.play().catch(() => {});
    }
  }

  pause() {
    const activeVideo = this.activeSlot === 'A' ? this.videoA : this.videoB;
    if (activeVideo) activeVideo.pause();
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  resume() {
    this.start();
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
        const isDay = scene !== 'clear-night';
        window.weatherFx.setMode(scene, isDay);
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

  // 4. Suggestion Selection Helper
  function selectSuggestion(res) {
    let displayVal = res.name;
    if (res.country && res.country.toLowerCase() !== res.name.toLowerCase()) {
      displayVal = `${res.name}, ${res.country}`;
    } else if (res.country_code) {
      displayVal = `${res.name}, ${res.country_code}`;
    }
    searchInput.value = displayVal;
    clearBtn.style.display = 'block';
    autocompleteList.style.display = 'none';
    autocompleteList.innerHTML = '';
    activeSuggestionIndex = -1;
    loadCityWeather(res.name, res);
  }

  // Search Form Submit
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      autocompleteList.style.display = 'none';
      autocompleteList.innerHTML = '';
      activeSuggestionIndex = -1;
      loadCityWeather(query);
    }
  });

  // 5. Autocomplete with Debounced Fetch & Full Keyboard Navigation
  let debounceTimer = null;
  let activeSuggestionIndex = -1;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    clearBtn.style.display = query.length > 0 ? 'block' : 'none';

    if (debounceTimer) clearTimeout(debounceTimer);
    activeSuggestionIndex = -1;

    if (query.length < 2) {
      autocompleteList.style.display = 'none';
      autocompleteList.innerHTML = '';
      return;
    }

    debounceTimer = setTimeout(async () => {
      try {
        const results = await fetchCityCoordinates(query);
        if (results && results.length > 0) {
          autocompleteList.innerHTML = '';
          const displayResults = results.slice(0, 6);

          displayResults.forEach((res, idx) => {
            const li = document.createElement('li');
            li.className = 'autocomplete-item';
            li.setAttribute('role', 'option');
            li.setAttribute('data-index', idx);

            let adminPart = '';
            if (res.admin1 && res.admin1.trim().toLowerCase() !== res.name.trim().toLowerCase()) {
              adminPart = `${res.admin1}, `;
            }
            const countryPart = res.country || res.country_code || '';
            const locationMeta = `${adminPart}${countryPart}`.trim();

            li.innerHTML = `
              <div class="item-text-group">
                <span class="item-city-name">${res.name}</span>
                <span class="item-admin-name">${locationMeta}</span>
              </div>
              <span class="item-country-badge">${res.country_code || 'GEO'}</span>
            `;

            li.addEventListener('mousedown', (e) => {
              e.preventDefault();
              selectSuggestion(res);
            });

            autocompleteList.appendChild(li);
          });
          autocompleteList.style.display = 'block';
        } else {
          autocompleteList.style.display = 'none';
          autocompleteList.innerHTML = '';
        }
      } catch (err) {
        autocompleteList.style.display = 'none';
        autocompleteList.innerHTML = '';
      }
    }, 220);
  });

  // Keyboard navigation for autocomplete list
  searchInput.addEventListener('keydown', (e) => {
    const items = autocompleteList.querySelectorAll('.autocomplete-item');
    if (!items.length || autocompleteList.style.display === 'none') {
      if (e.key === 'Escape') {
        autocompleteList.style.display = 'none';
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length;
      updateActiveSuggestion(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeSuggestionIndex = (activeSuggestionIndex - 1 + items.length) % items.length;
      updateActiveSuggestion(items);
    } else if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < items.length) {
        e.preventDefault();
        items[activeSuggestionIndex].dispatchEvent(new MouseEvent('mousedown'));
      }
    } else if (e.key === 'Escape') {
      autocompleteList.style.display = 'none';
      activeSuggestionIndex = -1;
    }
  });

  function updateActiveSuggestion(items) {
    items.forEach((item, idx) => {
      item.classList.toggle('active', idx === activeSuggestionIndex);
      if (idx === activeSuggestionIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  // Click outside to dismiss autocomplete
  document.addEventListener('click', (e) => {
    if (!searchForm.contains(e.target)) {
      autocompleteList.style.display = 'none';
      activeSuggestionIndex = -1;
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

// ----------------------------------------------------------------------------
// Weather-Driven Theme Announcer
// Themes change automatically via data-weather attribute set in renderDashboard().
// This watches for attribute changes and shows a brief toast with the theme name.
// ----------------------------------------------------------------------------
(function initWeatherThemeAnnouncer() {
  const THEME_NAMES = {
    clear:        '☀️ Sunny & Clear — Golden Hour',
    'clear-night':'🌙 Clear Night — Moonlit Indigo',
    rain:         '🌧️ Rainy — Ocean Blue',
    drizzle:      '🌦️ Drizzle — Ocean Blue',
    thunderstorm: '⛈️ Thunderstorm — Electric Violet',
    snow:         '❄️ Snowy — Arctic Ice',
    clouds:       '☁️ Cloudy — Steel Overcast',
  };

  let lastWeather = null;

  const observer = new MutationObserver(() => {
    const current = document.documentElement.getAttribute('data-weather');
    // Only announce theme changes AFTER the initial page load (skip the very first paint)
    if (current && current !== lastWeather && lastWeather !== null) {
      const name = THEME_NAMES[current] || current;
      if (typeof showToast === 'function') {
        showToast(`Theme: ${name}`);
      }
    }
    lastWeather = current;
  });

  document.addEventListener('DOMContentLoaded', () => {
    lastWeather = document.documentElement.getAttribute('data-weather') || null;
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-weather']
    });
  });
})();
