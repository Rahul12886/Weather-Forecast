import { formatHour, formatTemperature, rainProbability } from '../../utils/weather.js';
import WeatherIcon from './WeatherIcon.jsx';

export default function HourlyForecast({ hourly = [], timeZone, unitSystem = 'metric' }) {
  return (
    <section className="glass-panel min-w-0 p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-300">24-hour forecast</h2>
        <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">Scrollable</span>
      </div>
      <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
        {hourly.slice(0, 24).map((hour, index) => (
          <article key={hour.dt} className="min-w-16 rounded-lg bg-white/60 p-1.5 text-center dark:bg-white/10">
            <p className="text-xs font-bold">{index === 0 ? 'Now' : formatHour(hour.dt, timeZone)}</p>
            <WeatherIcon condition={hour.weather?.[0]?.main} className="mx-auto h-6 w-6" />
            <p className="text-sm font-extrabold">{formatTemperature(hour.temp, unitSystem)}</p>
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-200">{rainProbability(hour.pop)}%</p>
          </article>
        ))}
      </div>
    </section>
  );
}
