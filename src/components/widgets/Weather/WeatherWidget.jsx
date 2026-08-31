import React, { useState, useEffect, useCallback } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Wind,
  Droplets,
  Compass,
  Search,
  MapPin,
  Thermometer,
  ShieldAlert
} from 'lucide-react';
import WidgetCard from '../../common/WidgetCard';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

const POPULAR_CITIES = [
  { name: 'San Francisco', lat: 37.7749, lon: -122.4194, country: 'USA' },
  { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'USA' },
  { name: 'London', lat: 51.5074, lon: -0.1278, country: 'UK' },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'Japan' },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, country: 'India' },
  { name: 'Berlin', lat: 52.5200, lon: 13.4050, country: 'Germany' },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, country: 'Australia' }
];

const FALLBACK_WEATHER = {
  current: {
    tempC: 22,
    tempF: 72,
    condition: 'Partly Cloudy',
    code: 2,
    humidity: 62,
    windKmh: 14,
    uvIndex: 4.8,
    precipitation: 10
  },
  hourly: [
    { time: 'Now', tempC: 22, tempF: 72, code: 2 },
    { time: '12 PM', tempC: 24, tempF: 75, code: 1 },
    { time: '3 PM', tempC: 25, tempF: 77, code: 0 },
    { time: '6 PM', tempC: 21, tempF: 70, code: 2 },
    { time: '9 PM', tempC: 18, tempF: 64, code: 3 }
  ],
  daily: [
    { day: 'Mon', minC: 15, maxC: 24, minF: 59, maxF: 75, condition: 'Sunny', code: 0 },
    { day: 'Tue', minC: 16, maxC: 25, minF: 61, maxF: 77, condition: 'Partly Cloudy', code: 2 },
    { day: 'Wed', minC: 14, maxC: 22, minF: 57, maxF: 72, condition: 'Light Rain', code: 61 },
    { day: 'Thu', minC: 13, maxC: 21, minF: 55, maxF: 70, condition: 'Cloudy', code: 3 },
    { day: 'Fri', minC: 15, maxC: 23, minF: 59, maxF: 73, condition: 'Sunny', code: 1 }
  ]
};

function getWeatherMeta(code) {
  if (code === 0 || code === 1) {
    return { label: 'Sunny / Clear', icon: Sun, color: 'text-amber-400' };
  }
  if (code === 2 || code === 3) {
    return { label: 'Partly Cloudy', icon: Cloud, color: 'text-sky-300' };
  }
  if (code >= 45 && code <= 48) {
    return { label: 'Foggy', icon: CloudFog, color: 'text-slate-400' };
  }
  if (code >= 51 && code <= 55) {
    return { label: 'Drizzle', icon: CloudDrizzle, color: 'text-cyan-400' };
  }
  if (code >= 61 && code <= 67) {
    return { label: 'Rain', icon: CloudRain, color: 'text-blue-400' };
  }
  if (code >= 71 && code <= 77) {
    return { label: 'Snowfall', icon: CloudSnow, color: 'text-indigo-200' };
  }
  if (code >= 80 && code <= 82) {
    return { label: 'Heavy Showers', icon: CloudRain, color: 'text-blue-500' };
  }
  if (code >= 95) {
    return { label: 'Thunderstorm', icon: CloudLightning, color: 'text-yellow-400' };
  }
  return { label: 'Fair', icon: Sun, color: 'text-amber-400' };
}

export default function WeatherWidget() {
  const [selectedCity, setSelectedCity] = useLocalStorage('perdash_weather_city', POPULAR_CITIES[0]);
  const [isCelsius, setIsCelsius] = useLocalStorage('perdash_weather_unit_celsius', true);
  const [weatherData, setWeatherData] = useState(FALLBACK_WEATHER);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCityPicker, setShowCityPicker] = useState(false);

  const fetchWeather = useCallback(async (city) => {
    setLoading(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API fetch failed');
      const data = await res.json();

      const currentTempC = Math.round(data.current.temperature_2m);
      const currentTempF = Math.round((currentTempC * 9) / 5 + 32);

      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const daily = (data.daily?.time || []).slice(0, 5).map((t, idx) => {
        const date = new Date(t);
        const day = daysOfWeek[date.getDay()];
        const minC = Math.round(data.daily.temperature_2m_min[idx]);
        const maxC = Math.round(data.daily.temperature_2m_max[idx]);
        const code = data.daily.weather_code[idx];
        return {
          day,
          minC,
          maxC,
          minF: Math.round((minC * 9) / 5 + 32),
          maxF: Math.round((maxC * 9) / 5 + 32),
          condition: getWeatherMeta(code).label,
          code
        };
      });

      const hourly = (data.hourly?.time || []).slice(0, 5).map((t, idx) => {
        const date = new Date(t);
        const hours = date.getHours();
        const timeStr = idx === 0 ? 'Now' : `${hours % 12 || 12} ${hours >= 12 ? 'PM' : 'AM'}`;
        const tempC = Math.round(data.hourly.temperature_2m[idx]);
        return {
          time: timeStr,
          tempC,
          tempF: Math.round((tempC * 9) / 5 + 32),
          code: data.hourly.weather_code[idx]
        };
      });

      setWeatherData({
        current: {
          tempC: currentTempC,
          tempF: currentTempF,
          condition: getWeatherMeta(data.current.weather_code).label,
          code: data.current.weather_code,
          humidity: data.current.relative_humidity_2m,
          windKmh: Math.round(data.current.wind_speed_10m),
          uvIndex: data.daily?.uv_index_max?.[0] || 5,
          precipitation: data.daily?.precipitation_probability_max?.[0] || 0
        },
        hourly,
        daily
      });
    } catch (e) {
      console.warn('Weather API failed, using fallback cache data:', e);
      setWeatherData(FALLBACK_WEATHER);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity, fetchWeather]);

  const currentMeta = getWeatherMeta(weatherData.current.code);
  const CurrentIcon = currentMeta.icon;

  const currentTemp = isCelsius ? weatherData.current.tempC : weatherData.current.tempF;
  const unitStr = isCelsius ? '°C' : '°F';

  return (
    <WidgetCard
      id="weather"
      title="Live Weather"
      icon={Sun}
      badge={`${selectedCity.name}, ${selectedCity.country}`}
      badgeVariant="primary"
      onRefresh={() => fetchWeather(selectedCity)}
      isRefreshing={loading}
      actions={
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowCityPicker(!showCityPicker)}
            className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-white/5 transition-colors"
            title="Change Location"
          >
            <MapPin className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsCelsius(!isCelsius)}
            className="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-white/5 hover:bg-white/10 text-theme-primary border border-white/10 transition-colors"
            title="Toggle °C / °F"
          >
            {unitStr}
          </button>
        </div>
      }
    >
      {/* City Search / Picker Modal */}
      {showCityPicker && (
        <div className="mb-4 p-3 rounded-2xl bg-black/30 border border-theme-border animate-slide-up">
          <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-theme-border/50">
            <Search className="w-4 h-4 text-theme-primary" />
            <input
              type="text"
              placeholder="Search or pick city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-theme-text placeholder-theme-text-muted outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
            {POPULAR_CITIES.filter((c) =>
              c.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((city) => (
              <button
                key={city.name}
                onClick={() => {
                  setSelectedCity(city);
                  setShowCityPicker(false);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs transition-all ${
                  selectedCity.name === city.name
                    ? 'bg-theme-primary text-white font-medium'
                    : 'bg-white/5 hover:bg-white/10 text-theme-text-muted hover:text-theme-text'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Condition Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner">
            <CurrentIcon className={`w-10 h-10 ${currentMeta.color} animate-pulse-glow`} />
          </div>
          <div>
            <div className="text-4xl font-extrabold tracking-tight text-white flex items-baseline">
              <span>{currentTemp}</span>
              <span className="text-xl text-theme-primary ml-1">{unitStr}</span>
            </div>
            <div className="text-xs font-medium text-theme-text-muted">
              {weatherData.current.condition}
            </div>
          </div>
        </div>

        {/* Mini Highlights */}
        <div className="grid grid-cols-2 gap-2 text-right">
          <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-center">
            <div className="text-[10px] text-theme-text-muted flex items-center justify-center space-x-1">
              <Droplets className="w-3 h-3 text-cyan-400" />
              <span>Humidity</span>
            </div>
            <div className="text-xs font-bold text-white mt-0.5">{weatherData.current.humidity}%</div>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-center">
            <div className="text-[10px] text-theme-text-muted flex items-center justify-center space-x-1">
              <Wind className="w-3 h-3 text-sky-400" />
              <span>Wind</span>
            </div>
            <div className="text-xs font-bold text-white mt-0.5">{weatherData.current.windKmh} km/h</div>
          </div>
        </div>
      </div>

      {/* Hourly Strip */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-theme-text-muted mb-2">
          Hourly Forecast
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {weatherData.hourly.map((h, i) => {
            const HIcon = getWeatherMeta(h.code).icon;
            const t = isCelsius ? h.tempC : h.tempF;
            return (
              <div
                key={i}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex flex-col items-center justify-between text-center transition-colors"
              >
                <span className="text-[10px] text-theme-text-muted">{h.time}</span>
                <HIcon className="w-4 h-4 my-1 text-theme-accent" />
                <span className="text-xs font-semibold text-white">{t}°</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Day Forecast Matrix */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-theme-text-muted mb-2">
          5-Day Forecast
        </div>
        <div className="space-y-1.5">
          {weatherData.daily.map((d, i) => {
            const DIcon = getWeatherMeta(d.code).icon;
            const minT = isCelsius ? d.minC : d.minF;
            const maxT = isCelsius ? d.maxC : d.maxF;
            return (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs transition-colors"
              >
                <span className="w-10 font-medium text-theme-text">{d.day}</span>
                <div className="flex items-center space-x-2 text-theme-text-muted">
                  <DIcon className="w-3.5 h-3.5 text-theme-primary" />
                  <span className="hidden sm:inline text-[11px]">{d.condition}</span>
                </div>
                <div className="flex items-center space-x-2 font-mono">
                  <span className="text-theme-text-muted">{minT}°</span>
                  <span className="text-theme-border">/</span>
                  <span className="text-white font-bold">{maxT}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WidgetCard>
  );
}
