import { useState } from 'react';

export default function useGeolocation() {
  const [locating, setLocating] = useState(false);

  const locate = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocating(false);
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          setLocating(false);
          reject(new Error(error.message || 'Unable to detect your location.'));
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 },
      );
    });

  return { locate, locating };
}
