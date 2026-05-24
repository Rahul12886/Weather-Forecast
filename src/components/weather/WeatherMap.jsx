import { FiMapPin } from 'react-icons/fi';

export default function WeatherMap({ location }) {
  const zoom = 4;
  const tiles = 2 ** zoom;
  const latRad = (location.lat * Math.PI) / 180;
  const x = Math.floor(((location.lon + 180) / 360) * tiles);
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * tiles);

  return (
    <section className="glass-panel overflow-hidden">
      <div className="flex items-center justify-between p-3">
        <div>
          <h2 className="section-title">Location map</h2>
          <p className="mt-1 text-sm font-bold">{location.name}</p>
        </div>
        <FiMapPin className="text-sky-600 dark:text-sky-200" />
      </div>
      <div className="grid h-36 place-items-center bg-slate-900/10 dark:bg-white/10">
        <img loading="lazy" src='Map02.jpg' alt={`${location.name} map preview`} className="h-full w-full object-cover opacity-90" />
      </div>
    </section>
  );
}
