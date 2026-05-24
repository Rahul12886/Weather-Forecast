import { useEffect, useRef, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { formatHour, rainProbability, units } from '../../utils/weather.js';

export default function WeatherCharts({ hourly = [], timeZone, unitSystem }) {
  const [activeChart, setActiveChart] = useState('temp');
  const chartRef = useRef(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });
  const data = hourly.slice(0, 24).map((hour) => ({
    time: formatHour(hour.dt, timeZone),
    temp: Math.round(hour.temp),
    humidity: hour.humidity,
    wind: Number(hour.wind_speed?.toFixed(1)),
    rain: rainProbability(hour.pop),
  }));
  const chartMeta = {
    temp: { label: 'Temperature', key: 'temp', color: '#0284c7', unit: `\u00b0${units[unitSystem].temp}` },
    humidity: { label: 'Humidity', key: 'humidity', color: '#0f766e', unit: '%' },
    wind: { label: 'Wind speed', key: 'wind', color: '#7c3aed', unit: units[unitSystem].wind },
    rain: { label: 'Rain probability', key: 'rain', color: '#2563eb', unit: '%' },
  }[activeChart];

  useEffect(() => {
    const node = chartRef.current;
    if (!node) return undefined;

    const updateSize = () => {
      const { width, height } = node.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setChartSize({ width: Math.floor(width), height: Math.floor(height) });
      }
    };

    updateSize();
    const frame = window.requestAnimationFrame(updateSize);
    const observer = window.ResizeObserver ? new window.ResizeObserver(updateSize) : null;
    observer?.observe(node);

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);

  return (
    <section className="min-w-0">
      <article className="glass-panel min-w-0 p-3">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-300">Weather trends</h2>
          <div className="flex flex-wrap gap-1">
            {[
              ['temp', 'Temp'],
              ['humidity', 'Hum'],
              ['wind', 'Wind Speed'],
              ['rain', 'Rain %'],
            ].map(([key, label]) => (
              <button key={key} className={`pill-tab ${activeChart === key ? 'active' : ''}`} onClick={() => setActiveChart(key)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div ref={chartRef} className="h-24 min-w-0 lg:h-36">
          {chartSize.width > 0 && chartSize.height > 0 && (
            <AreaChart width={chartSize.width} height={chartSize.height} data={data}>
              <defs>
                <linearGradient id="weatherTrendGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor={chartMeta.color} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={chartMeta.color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} interval={2} />
              <YAxis tick={{ fontSize: 11 }} width={34} />
              <Tooltip />
              <Area
                name={`${chartMeta.label} (${chartMeta.unit})`}
                type="monotone"
                dataKey={chartMeta.key}
                stroke={chartMeta.color}
                fill="url(#weatherTrendGradient)"
                strokeWidth={2.5}
              />
            </AreaChart>
          )}
        </div>
      </article>
    </section>
  );
}
