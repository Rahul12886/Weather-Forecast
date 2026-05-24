import { FiHeart, FiRefreshCw } from 'react-icons/fi';
import { useWeather } from '../../context/WeatherContext.jsx';
import { formatTemperature, formatTime } from '../../utils/weather.js';
import WeatherIcon from './WeatherIcon.jsx';

export default function CurrentWeatherCard() {
  const { weather, location, unitSystem, favorites, toggleFavorite, refresh } = useWeather();
  const current = weather.current;
  const condition = current.weather?.[0];
  const isFavorite = favorites.some((item) => item.lat === location.lat && item.lon === location.lon);
  const updatedAt = current.dt ? formatTime(current.dt, weather.timezone) : 'now';

  return (
    <section className="glass-panel relative min-h-0 overflow-hidden border-sky-300/20 bg-gradient-to-br from-sky-50/80 via-white/70 to-slate-50/70 p-3 dark:from-[#0d2137]/90 dark:via-[#0a1628]/90 dark:to-[#061020]/90">
      <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="relative flex flex-col gap-3 min-[560px]:flex-row min-[560px]:items-start min-[560px]:justify-between">
        <div>
          <p className="section-title">Current weather</p>
          <h1 className="mt-1 font-display text-2xl font-light tracking-normal">
            {location.name}
            {location.country ? <span className="text-slate-500 dark:text-slate-300">, {location.country}</span> : null}
          </h1>
          <p className="mt-1 capitalize text-sm text-slate-600 dark:text-slate-300">{condition?.description}</p>
          <p className="mt-1 text-xs font-semibold uppercase text-sky-600 dark:text-sky-200">Live report updated {updatedAt}</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="icon-button" aria-label="Refresh weather" onClick={refresh}>
            <FiRefreshCw />
          </button>
          <button className="icon-button" aria-label="Toggle favorite" onClick={toggleFavorite}>
            <FiHeart className={isFavorite ? 'fill-rose-500 text-rose-500' : ''} />
          </button>
        </div>
      </div>

      <div className="relative mt-3 flex flex-col gap-3 min-[560px]:flex-row min-[560px]:items-end min-[560px]:justify-between">
        <div className="flex items-center gap-4">
          <WeatherIcon condition={condition?.main} className="h-14 w-14" />
          <div>
            <p className="font-display text-4xl font-light leading-none tracking-normal">{formatTemperature(current.temp, unitSystem)}</p>
            <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
              Feels like {formatTemperature(current.feels_like, unitSystem)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs min-[560px]:min-w-36 lg:min-w-52">
          <div className="rounded-lg bg-white/55 p-2 dark:bg-white/10">
            <p className="text-slate-500 dark:text-slate-300">Sunrise</p>
            <p className="font-bold">{formatTime(current.sunrise, weather.timezone)}</p>
          </div>
          <div className="rounded-lg bg-white/55 p-2 dark:bg-white/10">
            <p className="text-slate-500 dark:text-slate-300">Sunset</p>
            <p className="font-bold">{formatTime(current.sunset, weather.timezone)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
