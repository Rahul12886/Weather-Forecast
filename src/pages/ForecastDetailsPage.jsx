import { FiDroplet, FiSun, FiWind } from 'react-icons/fi';
import DailyForecast from '../components/weather/DailyForecast.jsx';
import WeatherCharts from '../components/weather/WeatherCharts.jsx';
import WeatherIcon from '../components/weather/WeatherIcon.jsx';
import LoadingSkeleton from '../components/weather/LoadingSkeleton.jsx';
import { useWeather } from '../context/WeatherContext.jsx';
import { formatDay, formatTemperature, rainProbability, units } from '../utils/weather.js';

export default function ForecastDetailsPage() {
  const { weather, loading, unitSystem } = useWeather();
  if (loading || !weather) return <LoadingSkeleton />;

  return (
    <div className="grid gap-5">
      <DailyForecast daily={weather.daily} timeZone={weather.timezone} unitSystem={unitSystem} />
      <section className="glass-panel p-5">
        <h1 className="text-2xl font-extrabold">Forecast details</h1>
        <div className="mt-5 grid gap-3">
          {weather.daily.slice(0, 7).map((day) => (
            <article key={day.dt} className="grid gap-4 rounded-lg bg-white/65 p-4 dark:bg-white/10 md:grid-cols-[1fr_1.2fr] md:items-center">
              <div className="flex items-center gap-4">
                <WeatherIcon condition={day.weather?.[0]?.main} className="h-14 w-14" />
                <div>
                  <h2 className="font-bold">{formatDay(day.dt, weather.timezone, 'long')}</h2>
                  <p className="capitalize text-sm text-slate-600 dark:text-slate-300">{day.weather?.[0]?.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <span className="rounded-lg bg-white/60 p-3 font-bold dark:bg-white/10">
                  {formatTemperature(day.temp.max, unitSystem)} / {formatTemperature(day.temp.min, unitSystem)}
                </span>
                <span className="flex items-center gap-2 rounded-lg bg-white/60 p-3 dark:bg-white/10">
                  <FiDroplet /> {rainProbability(day.pop)}%
                </span>
                <span className="flex items-center gap-2 rounded-lg bg-white/60 p-3 dark:bg-white/10">
                  <FiWind /> {day.wind_speed} {units[unitSystem].wind}
                </span>
                <span className="flex items-center gap-2 rounded-lg bg-white/60 p-3 dark:bg-white/10">
                  <FiSun /> UV {day.uvi ?? '--'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
      <WeatherCharts hourly={weather.hourly} timeZone={weather.timezone} unitSystem={unitSystem} />
    </div>
  );
}
