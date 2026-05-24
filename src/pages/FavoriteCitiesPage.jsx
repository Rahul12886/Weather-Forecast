import { FiHeart, FiMapPin, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../context/WeatherContext.jsx';

export default function FavoriteCitiesPage() {
  const { favorites, selectLocation, removeFavorite } = useWeather();
  const navigate = useNavigate();

  const openFavorite = (city) => {
    selectLocation(city);
    navigate('/');
  };

  return (
    <section className="glass-panel p-6">
      <div className="flex items-center gap-3">
        <FiHeart className="h-6 w-6 text-rose-500" />
        <div>
          <h1 className="text-2xl font-extrabold">Favorite cities</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Saved locally in this browser.</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="mt-8 rounded-lg bg-white/60 p-8 text-center dark:bg-white/10">
          <p className="font-semibold">No favorite cities yet.</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Use the heart button on the home page to save the current city.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((city) => (
            <article key={city.id} className="rounded-lg bg-white/65 p-4 dark:bg-white/10">
              <div className="flex items-start justify-between gap-3">
                <button className="text-left" onClick={() => openFavorite(city)}>
                  <p className="text-lg font-bold">{city.name}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <FiMapPin /> {[city.state, city.country].filter(Boolean).join(', ')}
                  </p>
                </button>
                <button className="icon-button h-10 w-10" aria-label="Remove favorite" onClick={() => removeFavorite(city.id)}>
                  <FiTrash2 />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
