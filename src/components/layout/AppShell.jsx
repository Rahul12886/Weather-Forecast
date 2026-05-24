import { motion } from 'framer-motion';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { FiHeart, FiHome, FiMap, FiMoon, FiSettings, FiSun } from 'react-icons/fi';
import SearchBar from '../weather/SearchBar.jsx';
import { useWeather } from '../../context/WeatherContext.jsx';
import { getWeatherTheme } from '../../utils/weather.js';

const links = [
  { to: '/', label: 'Home', icon: FiHome },
  { to: '/forecast', label: 'Forecast', icon: FiMap },
  { to: '/favorites', label: 'Favorites', icon: FiHeart },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

export default function AppShell() {
  const { weather, theme, setTheme } = useWeather();
  const location = useLocation();
  const scrollContainerRef = useRef(null);
  const condition = weather?.current?.weather?.[0]?.main;
  const isNight = weather?.current?.dt < weather?.current?.sunrise || weather?.current?.dt > weather?.current?.sunset;
  const bgClass = getWeatherTheme(condition, isNight);

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  return (
    <div className={`h-screen overflow-hidden ${theme === 'dark' ? 'weather-night' : bgClass} transition-colors duration-700`}>
      <div ref={scrollContainerRef} className="h-full overflow-y-auto bg-white/20 px-3 py-3 backdrop-blur-[1px] dark:bg-slate-950/28 sm:px-5 lg:px-6">
        <header className="mx-auto flex max-w-7xl flex-col gap-2 py-1 min-[560px]:flex-row min-[560px]:items-center min-[560px]:justify-between">
          <div className="flex items-center justify-between gap-3">
            <NavLink to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-base font-black text-white shadow-soft dark:bg-white dark:text-slate-950">
                N
              </span>
              <div>
                <p className="font-display text-lg font-semibold leading-5 tracking-normal text-sky-600 dark:text-sky-200">Nimbus</p>
                <p className="hidden text-xs font-semibold uppercase text-slate-500 dark:text-slate-300 xl:block">Weather Intelligence</p>
              </div>
            </NavLink>
            <button
              aria-label="Toggle theme"
              className="icon-button lg:hidden"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
          </div>

          <div className="min-[560px]:max-w-[230px] lg:max-w-xl">
            <SearchBar />
          </div>

          <nav className="glass-panel flex items-center gap-1 overflow-x-auto p-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className="nav-link">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden xl:inline">{label}</span>
              </NavLink>
            ))}
            <button
              aria-label="Toggle theme"
              className="icon-button hidden lg:inline-flex"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
          </nav>
        </header>

        <motion.main
          className="mx-auto max-w-7xl pb-0 pt-2"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
