import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { demoWeather, getWeatherBundle, reverseGeocode } from '../services/weatherApi.js';
import { getStoredValue, setStoredValue } from '../utils/storage.js';

const WeatherContext = createContext(null);

const defaultLocation = { name: 'New Delhi', country: 'IN', lat: 28.6139, lon: 77.209 };

export function WeatherProvider({ children }) {
  const [unitSystem, setUnitSystem] = useState(() => getStoredValue('nimbus-units', 'metric'));
  const [language, setLanguage] = useState(() => getStoredValue('nimbus-language', 'en'));
  const [theme, setTheme] = useState(() => {
    const defaultThemeApplied = getStoredValue('nimbus-dark-default-applied', false);
    const storedTheme = getStoredValue('nimbus-theme', null);
    const initialTheme = defaultThemeApplied ? storedTheme || 'dark' : 'dark';
    setStoredValue('nimbus-dark-default-applied', true);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    return initialTheme;
  });
  const [notifications, setNotifications] = useState(() => getStoredValue('nimbus-notifications', false));
  const [favorites, setFavorites] = useState(() => getStoredValue('nimbus-favorites', []));
  const [location, setLocation] = useState(() => getStoredValue('nimbus-location', defaultLocation));
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    setStoredValue('nimbus-theme', theme);
  }, [theme]);

  useEffect(() => setStoredValue('nimbus-units', unitSystem), [unitSystem]);
  useEffect(() => setStoredValue('nimbus-language', language), [language]);
  useEffect(() => setStoredValue('nimbus-notifications', notifications), [notifications]);
  useEffect(() => setStoredValue('nimbus-favorites', favorites), [favorites]);
  useEffect(() => setStoredValue('nimbus-location', location), [location]);

  const loadWeather = useCallback(
    async (target = location) => {
      setLoading(true);
      setError('');
      try {
        const data = await getWeatherBundle({ lat: target.lat, lon: target.lon, units: unitSystem, lang: language });
        setWeather(data);
      } catch (err) {
        setWeather(demoWeather);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [language, location, unitSystem],
  );

  useEffect(() => {
    loadWeather(location);
  }, [location, unitSystem, language, loadWeather]);

  const selectLocation = useCallback((place) => {
    setLocation({
      name: place.name,
      state: place.state,
      country: place.country,
      lat: place.lat,
      lon: place.lon,
    });
  }, []);

  const useCurrentLocation = useCallback(async ({ lat, lon }) => {
    const place = await reverseGeocode({ lat, lon }).catch(() => null);
    setLocation({
      name: place?.name || 'Current location',
      state: place?.state,
      country: place?.country,
      lat,
      lon,
    });
  }, []);

  const toggleFavorite = useCallback(() => {
    setFavorites((items) => {
      const exists = items.some((item) => item.lat === location.lat && item.lon === location.lon);
      if (exists) return items.filter((item) => item.lat !== location.lat || item.lon !== location.lon);
      return [{ ...location, id: `${location.lat}-${location.lon}` }, ...items].slice(0, 12);
    });
  }, [location]);

  const removeFavorite = useCallback((id) => {
    setFavorites((items) => items.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      weather,
      loading,
      error,
      location,
      unitSystem,
      language,
      theme,
      notifications,
      favorites,
      setUnitSystem,
      setLanguage,
      setTheme,
      setNotifications,
      selectLocation,
      useCurrentLocation,
      toggleFavorite,
      removeFavorite,
      refresh: () => loadWeather(location),
    }),
    [
      error,
      favorites,
      language,
      loadWeather,
      loading,
      location,
      notifications,
      selectLocation,
      theme,
      toggleFavorite,
      unitSystem,
      useCurrentLocation,
      weather,
      removeFavorite,
    ],
  );

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within WeatherProvider');
  return context;
};
