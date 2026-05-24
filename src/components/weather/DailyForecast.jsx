import { formatDay, formatTemperature, rainProbability } from '../../utils/weather.js';
import WeatherIcon from './WeatherIcon.jsx';

export default function DailyForecast({ daily = [], timeZone, unitSystem }) {
  return (
    <section className="glass-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">7-day forecast</h2>
        <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">Daily outlook</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
        {daily.slice(0, 7).map((day, index) => (
          <article key={day.dt} className="rounded-lg bg-white/60 p-4 text-center dark:bg-white/10">
            <p className="font-bold">{index === 0 ? 'Today' : formatDay(day.dt, timeZone)}</p>
            <WeatherIcon condition={day.weather?.[0]?.main} className="mx-auto h-12 w-12" />
            <p className="mt-1 text-sm capitalize text-slate-600 dark:text-slate-300">{day.weather?.[0]?.description}</p>
            <div className="mt-3 flex items-center justify-center gap-2 font-bold">
              <span>{formatTemperature(day.temp.max, unitSystem)}</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-500 dark:text-slate-300">{formatTemperature(day.temp.min, unitSystem)}</span>
            </div>
            <p className="mt-2 text-xs font-semibold text-sky-600 dark:text-sky-200">{rainProbability(day.pop)}% rain</p>
          </article>
        ))}
      </div>
    </section>
  );
}
