import { motion } from 'framer-motion';
import { getWeatherIcon } from '../../utils/weather.js';

export default function WeatherIcon({ condition, className = 'h-16 w-16' }) {
  const Icon = getWeatherIcon(condition);
  return (
    <motion.span
      className="inline-grid place-items-center text-sky-500 dark:text-sky-200"
      animate={{ y: [0, -7, 0], rotate: [0, 2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Icon className={className} />
    </motion.span>
  );
}
