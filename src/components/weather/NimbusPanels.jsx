import { FiActivity, FiCloud, FiCloudRain, FiDroplet, FiEye, FiSun, FiSunrise, FiSunset, FiThermometer, FiWind } from 'react-icons/fi';
import { aqiLabel, formatTemperature, formatTime, rainProbability, units, visibilityValue } from '../../utils/weather.js';
import MetricCard from './MetricCard.jsx';

const degToDir = (deg = 0) => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
};

export function AqiGauge({ airQuality }) {
  const aqi = airQuality?.main?.aqi || 1;
  const usAqi = airQuality?.main?.us_aqi;
  const components = airQuality?.components || {};
  const left = ((aqi - 1) / 4) * 100;

  return (
    <article className="glass-panel p-3">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Air quality</h2>
        <span className="rounded-full bg-emerald-500/12 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-300">
          {aqiLabel(aqi)}
        </span>
      </div>
      <p className="mt-2 font-display text-4xl font-light">{usAqi ?? aqi}</p>
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">{usAqi ? 'US AQI' : 'AQI category'}</p>
      <div className="relative mt-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-fuchsia-700">
        <span
          className="absolute -top-1 h-4 w-1 rounded-full bg-white shadow-lg"
          style={{ left: `${left}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        {[
          ['PM2.5', components.pm2_5],
          ['PM10', components.pm10],
          ['O3', components.o3],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-white/60 p-2 dark:bg-white/10">
            <p className="text-slate-500 dark:text-slate-300">{label}</p>
            <p className="font-bold">{value ?? '--'}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export function SunCycleCard({ current, timeZone }) {
  return (
    <article className="glass-panel p-3">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Sun cycle</h2>
        <FiSun className="text-amber-400" />
      </div>
      <div className="mt-2 h-14">
        <svg viewBox="0 0 320 100" className="h-full w-full">
          <path d="M18 82 C78 14 236 14 302 82" fill="none" stroke="currentColor" strokeDasharray="5 7" className="text-sky-300/70" strokeWidth="2" />
          <circle cx="160" cy="34" r="11" className="fill-amber-300 drop-shadow" />
          <line x1="18" x2="302" y1="82" y2="82" stroke="currentColor" className="text-white/20" />
        </svg>
      </div>
      <div className="flex justify-between text-xs">
        <div>
          <p className="flex items-center gap-1 text-slate-500 dark:text-slate-300"><FiSunrise /> Sunrise</p>
          <p className="mt-0.5 font-bold">{formatTime(current.sunrise, timeZone)}</p>
        </div>
        <div className="text-right">
          <p className="flex items-center gap-1 text-slate-500 dark:text-slate-300"><FiSunset /> Sunset</p>
          <p className="mt-0.5 font-bold">{formatTime(current.sunset, timeZone)}</p>
        </div>
      </div>
    </article>
  );
}

export function WindCompassCard({ current, unitSystem }) {
  const direction = current.wind_deg || 0;

  return (
    <article className="glass-panel p-3">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Wind compass</h2>
        <FiWind className="text-sky-500 dark:text-sky-200" />
      </div>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full border-2 border-white/40 bg-white/40 dark:border-white/10 dark:bg-white/5">
          <span className="absolute top-1 text-[10px] font-bold text-slate-400">N</span>
          <span className="absolute bottom-1 text-[10px] font-bold text-slate-400">S</span>
          <span className="absolute right-2 text-[10px] font-bold text-slate-400">E</span>
          <span className="absolute left-2 text-[10px] font-bold text-slate-400">W</span>
          <span
            className="absolute top-2 h-8 w-1 origin-bottom rounded-full bg-gradient-to-b from-rose-500 via-rose-500 to-slate-400 transition-transform duration-700"
            style={{ transform: `rotate(${direction}deg)` }}
          />
          <span className="mt-5 text-xs font-bold">{degToDir(direction)}</span>
        </div>
        <div>
          <p className="font-display text-3xl font-light">{current.wind_speed}</p>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{units[unitSystem].wind}</p>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{direction} degree direction</p>
        </div>
      </div>
    </article>
  );
}

export function ConditionMetrics({ current, unitSystem }) {
  const metrics = [
    {
      icon: FiDroplet,
      label: 'Humidity',
      value: current.humidity !== undefined ? `${current.humidity}%` : '--',
      detail: 'Relative moisture in the air',
    },
    {
      icon: FiActivity,
      label: 'Pressure',
      value: current.pressure ? `${Math.round(current.pressure)} hPa` : '--',
      detail: 'Mean sea-level pressure',
    },
    {
      icon: FiEye,
      label: 'Visibility',
      value: visibilityValue(current.visibility, unitSystem),
      detail: 'Surface visibility estimate',
    },
    {
      icon: FiSun,
      label: 'UV index',
      value: current.uvi !== undefined ? Number(current.uvi).toFixed(1) : '--',
      detail: current.uvi >= 6 ? 'Sun protection recommended' : 'Moderate exposure risk',
    },
    {
      icon: FiCloud,
      label: 'Cloud cover',
      value: current.clouds !== undefined ? `${current.clouds}%` : '--',
      detail: 'Sky coverage near this location',
    },
    {
      icon: FiThermometer,
      label: 'Dew point',
      value: formatTemperature(current.dew_point, unitSystem),
      detail: 'Comfort and moisture signal',
    },
  ];

  return (
    <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </section>
  );
}

export function ForecastRows({ daily = [], timeZone, unitSystem }) {
  const temps = daily.slice(0, 7).flatMap((day) => [day.temp.min, day.temp.max]);
  const low = Math.min(...temps);
  const high = Math.max(...temps);
  const span = Math.max(1, high - low);

  return (
    <section className="glass-panel p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="section-title">Weekly range</h2>
        <FiCloudRain className="text-sky-500 dark:text-sky-200" />
      </div>
      {daily.slice(0, 4).map((day, index) => {
        const left = ((day.temp.min - low) / span) * 100;
        const width = Math.max(8, ((day.temp.max - day.temp.min) / span) * 100);
        const name =
          index === 0
            ? 'Today'
            : new Intl.DateTimeFormat(undefined, { weekday: 'short', timeZone }).format(new Date(day.dt * 1000));

        return (
          <div key={day.dt} className="grid grid-cols-[38px_1fr_36px_54px] items-center gap-1.5 border-b border-white/20 py-1.5 last:border-0 dark:border-white/10 lg:grid-cols-[42px_1fr_44px_64px] lg:gap-2">
            <p className="text-xs font-bold">{name}</p>
            <div className="min-w-0">
              <p className="truncate text-xs capitalize text-slate-500 dark:text-slate-300">{day.weather?.[0]?.description}</p>
              <div className="relative mt-1.5 h-1 rounded-full bg-slate-200 dark:bg-white/10">
                <span
                  className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-300"
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
              </div>
            </div>
            <p className="flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-200">
              <FiDroplet /> {rainProbability(day.pop)}%
            </p>
            <p className="text-right text-xs font-bold">
              {Math.round(day.temp.max)} / <span className="text-slate-500 dark:text-slate-300">{Math.round(day.temp.min)}{units[unitSystem].temp}</span>
            </p>
          </div>
        );
      })}
    </section>
  );
}
