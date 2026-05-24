import { FiBell, FiGlobe, FiMoon, FiRefreshCcw, FiThermometer } from 'react-icons/fi';
import { useWeather } from '../context/WeatherContext.jsx';
import { languages } from '../utils/weather.js';

export default function SettingsPage() {
  const {
    unitSystem,
    setUnitSystem,
    language,
    setLanguage,
    theme,
    setTheme,
    notifications,
    setNotifications,
    refresh,
  } = useWeather();

  return (
    <section className="glass-panel p-6">
      <h1 className="text-2xl font-extrabold">Settings</h1>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="metric-card">
          <div className="mb-4 flex items-center gap-3">
            <FiThermometer className="text-sky-600 dark:text-sky-200" />
            <h2 className="font-bold">Units</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-white/60 p-1 dark:bg-white/10">
            {['metric', 'imperial'].map((unit) => (
              <button
                key={unit}
                className={`rounded-lg px-4 py-3 text-sm font-bold capitalize transition ${unitSystem === unit ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : ''}`}
                onClick={() => setUnitSystem(unit)}
              >
                {unit === 'metric' ? 'Celsius' : 'Fahrenheit'}
              </button>
            ))}
          </div>
        </article>

        <article className="metric-card">
          <div className="mb-4 flex items-center gap-3">
            <FiGlobe className="text-sky-600 dark:text-sky-200" />
            <h2 className="font-bold">Language</h2>
          </div>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="w-full rounded-lg border border-white/60 bg-white/70 px-4 py-3 font-semibold outline-none dark:border-white/10 dark:bg-white/10"
          >
            {languages.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </article>

        <article className="metric-card">
          <div className="mb-4 flex items-center gap-3">
            <FiMoon className="text-sky-600 dark:text-sky-200" />
            <h2 className="font-bold">Appearance</h2>
          </div>
          <label className="flex cursor-pointer items-center justify-between rounded-lg bg-white/60 p-4 dark:bg-white/10">
            <span className="font-semibold">Dark mode</span>
            <input type="checkbox" checked={theme === 'dark'} onChange={(event) => setTheme(event.target.checked ? 'dark' : 'light')} />
          </label>
        </article>

        <article className="metric-card">
          <div className="mb-4 flex items-center gap-3">
            <FiBell className="text-sky-600 dark:text-sky-200" />
            <h2 className="font-bold">Notifications</h2>
          </div>
          <label className="flex cursor-pointer items-center justify-between rounded-lg bg-white/60 p-4 dark:bg-white/10">
            <span className="font-semibold">Weather alerts</span>
            <input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} />
          </label>
        </article>
      </div>
      <button className="primary-button mt-6" onClick={refresh}>
        <FiRefreshCcw /> Refresh weather data
      </button>
    </section>
  );
}
