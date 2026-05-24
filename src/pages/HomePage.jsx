import { motion } from 'framer-motion';
import CurrentWeatherCard from '../components/weather/CurrentWeatherCard.jsx';
import HourlyForecast from '../components/weather/HourlyForecast.jsx';
import LoadingSkeleton from '../components/weather/LoadingSkeleton.jsx';
import { AqiGauge, ConditionMetrics, ForecastRows, WindCompassCard } from '../components/weather/NimbusPanels.jsx';
import WeatherAlert from '../components/weather/WeatherAlert.jsx';
import WeatherCharts from '../components/weather/WeatherCharts.jsx';
import WeatherMap from '../components/weather/WeatherMap.jsx';
import { useWeather } from '../context/WeatherContext.jsx';
import { buildInsight } from '../utils/weather.js';

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { weather, loading, error, location, unitSystem } = useWeather();

  if (loading || !weather) return <LoadingSkeleton />;

  const current = weather.current;
  return (
    <motion.div className="grid gap-3 lg:h-[calc(100vh-104px)]" initial="hidden" animate="show" transition={{ staggerChildren: 0.06 }}>
      <section className="grid min-h-0 gap-3 min-[560px]:grid-cols-[minmax(0,1fr)_250px] lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-3">
          {(weather.alerts?.length || error) && (
            <motion.div variants={item}>
              <WeatherAlert alerts={weather.alerts} error={error} />
            </motion.div>
          )}

          <motion.div variants={item}>
            <CurrentWeatherCard />
          </motion.div>

          <motion.div variants={item}>
            <ConditionMetrics current={current} unitSystem={unitSystem} />
          </motion.div>

          <motion.div variants={item}>
            <HourlyForecast hourly={weather.hourly} timeZone={weather.timezone} unitSystem={unitSystem} />
          </motion.div>

          <motion.div variants={item}>
            <WeatherCharts hourly={weather.hourly} timeZone={weather.timezone} unitSystem={unitSystem} />
          </motion.div>

          <motion.article variants={item} className="glass-panel hidden border-sky-300/20 bg-gradient-to-br from-sky-500/10 to-transparent p-3 lg:block">
            <p className="section-title text-sky-600 dark:text-sky-200">AI weather insight</p>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{buildInsight(weather, unitSystem)}</p>
          </motion.article>
        </div>

        <aside className="grid min-w-0 content-start gap-3">
          <motion.div variants={item}>
            <ForecastRows daily={weather.daily} timeZone={weather.timezone} unitSystem={unitSystem} />
          </motion.div>
          <motion.div variants={item}>
            <AqiGauge airQuality={weather.airQuality} />
          </motion.div>
          <motion.div variants={item}>
            <WindCompassCard current={current} unitSystem={unitSystem} />
          </motion.div>
          <motion.div variants={item}>
            <WeatherMap location={location} />
          </motion.div>
        </aside>
      </section>
    </motion.div>
  );
}
