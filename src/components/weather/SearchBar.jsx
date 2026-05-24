import { useEffect, useState } from 'react';
import { FiMapPin, FiMic, FiSearch } from 'react-icons/fi';
import { searchLocations } from '../../services/weatherApi.js';
import { useWeather } from '../../context/WeatherContext.jsx';
import useDebounce from '../../hooks/useDebounce.js';
import useGeolocation from '../../hooks/useGeolocation.js';

export default function SearchBar() {
  const { selectLocation, useCurrentLocation: selectCurrentLocation } = useWeather();
  const { locate, locating } = useGeolocation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    let active = true;
    if (debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      setSearchError('');
      return;
    }

    setSearching(true);
    setSearchError('');
    searchLocations(debouncedQuery)
      .then((results) => active && setSuggestions(results))
      .catch(() => {
        if (active) {
          setSuggestions([]);
          setSearchError('Unable to search locations right now.');
        }
      })
      .finally(() => active && setSearching(false));

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const pickLocation = (place) => {
    selectLocation(place);
    setQuery('');
    setSuggestions([]);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;

    if (suggestions[0]) {
      pickLocation(suggestions[0]);
      return;
    }

    setSearching(true);
    setSearchError('');
    try {
      const results = await searchLocations(value, 1);
      if (results[0]) {
        pickLocation(results[0]);
      } else {
        setSearchError('No matching location found.');
      }
    } catch {
      setSearchError('Unable to search locations right now.');
    } finally {
      setSearching(false);
    }
  };

  const handleLocate = async () => {
    const coords = await locate();
    await selectCurrentLocation(coords);
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => setQuery(event.results[0][0].transcript);
    recognition.start();
  };

  return (
    <form className="relative w-full lg:max-w-xl" onSubmit={handleSearch}>
      <div className="glass-panel flex items-center gap-1 p-1.5">
        <FiSearch className="ml-2 h-5 w-5 text-slate-500 dark:text-slate-300" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSearch(event);
          }}
          placeholder="Search city, area, or country"
          className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-sm font-medium outline-none placeholder:text-slate-500 dark:placeholder:text-slate-300"
        />
        <button type="button" className="icon-button h-9 w-9" aria-label="Voice search" onClick={startVoiceSearch}>
          <FiMic />
        </button>
        <button type="button" className="icon-button h-9 w-9" aria-label="Use current location" onClick={handleLocate} disabled={locating}>
          <FiMapPin className={locating ? 'animate-pulse' : ''} />
        </button>
      </div>

      {(suggestions.length > 0 || searching || searchError) && (
        <div className="glass-panel absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden p-2">
          {searching && <div className="skeleton h-11" />}
          {!searching && searchError && <p className="px-3 py-2 text-sm font-semibold text-rose-600 dark:text-rose-300">{searchError}</p>}
          {suggestions.map((place) => (
            <button
              type="button"
              key={`${place.name}-${place.lat}-${place.lon}`}
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm transition hover:bg-white/70 dark:hover:bg-white/10"
              onClick={() => pickLocation(place)}
            >
              <span className="font-semibold">{place.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-300">
                {[place.state, place.country].filter(Boolean).join(', ')}
              </span>
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
