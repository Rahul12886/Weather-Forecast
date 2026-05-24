import { FiAlertCircle } from 'react-icons/fi';

export default function WeatherAlert({ alerts = [], error }) {
  if (!alerts.length && !error) return null;
  const alert = alerts[0];
  const title = error ? 'Live data fallback' : alert?.event;
  const message = error || alert?.description || 'No active alerts for this location.';

  return (
    <section className="glass-panel flex items-start gap-3 border-amber-300/35 bg-amber-50/80 p-4 dark:border-amber-200/15 dark:bg-amber-400/10">
      <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
      <div>
        <h2 className="font-bold">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>
      </div>
    </section>
  );
}
